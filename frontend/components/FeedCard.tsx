"use client"

import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { Tweet } from "@/gql/graphql"
import Link from 'next/link'

interface FeedCardProps {
  data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {

  const { data } = props;
  
  return (
    <div className="border border-r-0 border-l-0 border-b-0 p-3 sm:p-5 border-gray-600 hover:bg-[#171717] transition-all">
      <div className="grid grid-cols-12 gap-2 sm:gap-3">
        
        {/* User Profile */}
        <div className="col-span-2 sm:col-span-1 flex justify-center sm:justify-start">
          {data.author?.profileImage && (
            <Image
              src={data.author.profileImage}
              alt="User image"
              height={40}
              width={40}
              className="rounded-full h-6 w-6 sm:h-8 sm:w-8"
            />
          )}
        </div>

        {/* Tweet Content */}
        <div className="col-span-10 sm:col-span-11">
          <Link href={`/${data.author?.id}`}>
            <h1 className="font-semibold text-sm sm:text-base text-gray-100  cursor-pointer">
              {data.author?.firstName} {data.author?.lastname}
            </h1>
          </Link>

          <p className="text-sm sm:text-lg mt-1 break-words text-gray-200">
            {data.content}
          </p>

          {/* Action Icons */}
          <div className="flex justify-between mt-4 sm:mt-5 text-base sm:text-xl items-center w-full sm:w-[90%] text-gray-500">
            <BiMessageRounded className="hover:text-[#2981bc] cursor-pointer transition" />
            <FaRetweet className="hover:text-green-500 cursor-pointer transition" />
            <AiOutlineHeart className="hover:text-red-500 cursor-pointer transition" />
            <BiUpload className="hover:text-[#2981bc] cursor-pointer transition" />
          </div>
        </div>
      </div>
    </div>

  )
}

export default FeedCard