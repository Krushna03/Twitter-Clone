"use client";
import React from 'react'
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/user';
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';

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

interface TwitterLayoutProps {
  children: React.ReactNode
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {

  const queryClient = useQueryClient()
  const { user } = useCurrentUser()

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;

      if (!googleToken) {
        return toast.error("Google token not found")
      }

      const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken})

      toast.success("Verified Success")

      if (verifyGoogleToken) {
        window.localStorage.setItem("_twitter_token", verifyGoogleToken)
        await queryClient.invalidateQueries({ queryKey: ['current-user'] })
      }
    }, [queryClient]) 
  
  
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-2 sm:px-10 lg:px-56">
        {/* Sidebar */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-3 ml-2 sm:ml-8 relative">
          <div className="text-2xl h-fit w-fit hover:bg-[#1c1c1a] rounded-full p-3 sm:p-4 cursor-pointer mt-2 sm:mt-1">
            <BsTwitter />
          </div>

          <div className="text-xl pr-0 sm:pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  key={item.title}
                  className="flex justify-center sm:justify-start items-center gap-0 sm:gap-4 hover:bg-[#1c1c1a] rounded-full p-3 sm:px-5 sm:py-3 w-fit cursor-pointer mt-2"
                >
                  <span className="text-lg sm:text-2xl">{item.icon}</span>
                  <span className="hidden sm:inline">{item.title}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 px-1 sm:px-3">
              <button className="bg-[#2981bc] sm:text-lg font-semibold p-2 sm:px-4 rounded-full sm:w-full">
                <span className="hidden sm:inline">Tweet</span>
                <span className="sm:hidden text-base flex justify-center items-center"><BsTwitter /></span>
              </button>
            </div>

            {user && (
              <div className="absolute bottom-5 flex justify-center sm:justify-start gap-2 items-center bg-[#1e1e1c] px-2 py-2 rounded-full mr-2 w-fit sm:w-auto">
                {user.profileImage && (
                  <Image
                    className="rounded-full"
                    src={user.profileImage}
                    alt="user-image"
                    height={35}
                    width={35}
                  />
                )}
                <div className="hidden sm:block">
                  <h3 className="text-sm">
                    {user?.firstName} {user?.lastname}
                  </h3>
                  <h4 className="text-gray-400 text-xs max-w-fit">{user?.email}</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section */}
        <div className="col-span-10 sm:col-span-6 lg:col-span-6 border-r border-l border-gray-600 h-screen overflow-y-scroll">
          {props.children}
        </div>

        {/* Right Section */}
        <div className="hidden sm:block sm:col-span-3 lg:col-span-3">
          {!user && <GoogleLogin onSuccess={handleLoginWithGoogle} />}
        </div>
      </div>
    </div>


  )
}

export default TwitterLayout
