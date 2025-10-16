"use client";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreateTweet } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { graphqlClient } from "@/clients/api";
import { getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import toast from "react-hot-toast";
import axios from "axios";

interface HomeProps {
  tweets: Tweet[];
}

const HomeClient: React.FC<HomeProps> = ({ tweets }) => {
  const { user } = useCurrentUser();
  const { mutate } = useCreateTweet();
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("")

  const handleCreateTweet = useCallback(() => {
    if (!content.trim()) return;
    mutate({ content, imageURL });
    setContent("");
  }, [content, imageURL, mutate]);


  const handleInputChangeFIle = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      
      const file: File | null | undefined = input.files?.item(0)

      if (!file) return;

      const { getSignedURLForTweet } = await graphqlClient.request(getSignedURLForTweetQuery, { 
        imageName: file.name,
        imageType: file.type
      })

      if (getSignedURLForTweet) {
        toast.loading('Uploading....', { id: "2" })
        
        try {
          await axios.put(getSignedURLForTweet, file, {
            headers: {
              'Content-Type': file.type
            }
          })
        } catch (error) {
          console.error("error: ", error);
        }
        toast.success('Upload Completed', { id: "2" })

        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`
        setImageURL(myFilePath)
      }
    }
  }, [])


  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener('change', handleInputChangeFIle(input))

    input.click();
  }, []);

  return (
    <TwitterLayout>
      <div className="border border-r-0 border-l-0 border-b-0 p-3 sm:p-5 border-gray-600 hover:bg-[#171717] transition-all cursor-pointer">
        <div className="grid grid-cols-12 gap-2 sm:gap-3 items-start">
          {/* Profile Image */}
          <div className="col-span-2 sm:col-span-1 flex justify-center sm:justify-start">
            {user?.profileImage && (
              <Image
                src={user.profileImage}
                alt="User image"
                height={40}
                width={40}
                className="rounded-full h-8 w-8"
              />
            )}
          </div>

          <div className="col-span-10 sm:col-span-11">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent text-base sm:text-xl px-2 sm:px-3 placeholder:text-gray-400 border-b border-slate-800 focus:outline-none resize-none"
              placeholder="What's happening?"
              rows={2}
            />

            {
              imageURL && (
                <Image
                  src={imageURL}
                  alt="image-url"
                  height={300}
                  width={300}
                />
              )
            }

            <div className="mt-2 flex justify-between items-center">
              <BiImageAlt
                onClick={handleSelectImage}
                className="text-lg sm:text-xl cursor-pointer hover:text-[#2981bc] transition"
              />
              <button
                onClick={handleCreateTweet}
                className="bg-[#2981bc] text-xs sm:text-sm font-semibold py-1 px-3 sm:py-2 sm:px-5 rounded-full hover:opacity-90 transition cursor-pointer"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>

      {tweets?.map((tweet) => (
        <FeedCard key={tweet?.id} data={tweet as Tweet} />
      ))}
    </TwitterLayout>
  );
};

export default HomeClient;
