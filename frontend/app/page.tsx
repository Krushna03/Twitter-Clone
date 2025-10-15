"use client";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout/TwitterLayout";


export default function Home() {

  const { user } = useCurrentUser()
  const { tweets } = useGetAllTweets()
  const { mutate } = useCreateTweet()
  const [content, setContent] = useState("")

  const handleCreateTweet = useCallback(() => {
    mutate({
      content
    })
    setContent("")
  }, [content, mutate])
  
  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute("type", 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  }, [])


  return (
    <div>
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
              ></textarea>

              <div className="mt-2 flex justify-between items-center">
                <BiImageAlt
                  onClick={handleSelectImage}
                  className="text-lg sm:text-xl cursor-pointer hover:text-[#2981bc] transition"
                />
                <button
                  onClick={handleCreateTweet}
                  className="bg-[#2981bc] text-xs sm:text-sm font-semibold py-1 px-3 sm:py-2 sm:px-5 rounded-full hover:opacity-90 transition"
                >
                  Tweet
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {tweets?.map((tweet) => (
            <FeedCard
              key={tweet?.id}
              data={tweet as Tweet}
            />
          )
        )}
      </TwitterLayout>
    </div>
  )
}
