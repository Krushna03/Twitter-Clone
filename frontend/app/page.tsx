"use client";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiImageAlt, BiMoney, BiUser } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface TwiiterSidebarButton {
  title: string;
  icon: React.ReactNode
}

const sidebarMenuItems: TwiiterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />
  },
  {
    title: "Explore",
    icon: <BiHash />
  },
  {
    title: "Notifications",
    icon: <BsBell />
  },
  {
    title: "Messages",
    icon: <BsEnvelope />
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />
  },
  {
    title: "Profile",
    icon: <BiUser />
  },
  {
    title: "More Options",
    icon: <SlOptions />
  },
]

export default function Home() {

  const { user } = useCurrentUser()
  const queryClient = useQueryClient()
  
  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute("type", 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  }, [])

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;

      if (!googleToken) {
        return toast.error("Google token not found")
      }

      const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken})

      toast.success("Verified Success")
      console.log(verifyGoogleToken);

      if (verifyGoogleToken) {
        window.localStorage.setItem("_twitter_token", verifyGoogleToken)
        await queryClient.invalidateQueries({ queryKey: ['current-user'] })
      }
  }, [queryClient])


  return (
    <div className="grid grid-cols-12 h-screen w-screen px-56 ">
      
      <div className="col-span-3 ml-8 relative">
        <div className="text-2xl h-fit w-fit hover:bg-[#1c1c1a] rounded-full p-4 cursor-pointer mt-1">
          <BsTwitter />
        </div>

        <div className="text-xl pr-4">
          <ul>
            {sidebarMenuItems.map((item) => (
              <li
                key={item.title}
                className="flex justify-start items-center gap-4 hover:bg-[#1c1c1a] rounded-full px-5 py-3 w-fit cursor-pointer mt-2"
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 px-3">
            <button className="bg-[#2981bc] text-lg font-semibold py-2 px-4 rounded-full w-full">
              Tweet
            </button>
          </div>

          {user && (
            <div className="absolute bottom-5 flex gap-1 items-center bg-[#1e1e1c] px-2 py-2 rounded-full mr-2">
              {user && user.profileImage && (
                <Image
                  className="rounded-full"
                  src={user.profileImage}
                  alt="user-image"
                  height={35}
                  width={35}
                />
              )}
              <div>
                <h3 className="text-sm">
                  {user?.firstName} {user?.lastname}
                </h3>
                <h4 className="text-gray-400 text-xs max-w-fit">
                  {user?.email}
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-6 border-r-[1px] border-l-[1px] border-gray-600 h-screen overflow-y-scroll">
        <div>
            <div className='border border-r-0 border-l-0 border-b-0 p-5 border-gray-600 hover:bg-[#171717] transition-all cursor-pointer'>
              <div className='grid grid-cols-12 gap-3'>
                <div className='col-span-1'>
                  {user?.profileImage && (
                    <Image 
                      src={user?.profileImage} alt="User image" 
                      height={90} 
                      width={90} 
                      className='rounded-full'
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    className="w-full bg-transparent text-xl px-3 border-b border-slate-800"
                    placeholder="What's happening..."
                    rows={2}
                  > 
                  </textarea>
                  <div className="mt-2 flex justify-between itens-center">
                    <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                    <button className="bg-[#2981bc] text-sm font-semibold py-2 px-5 rounded-full">
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
      </div>

      <div className="col-span-3">
        {
          !user && (
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          )
        }
      </div>
    </div>
  )
}
