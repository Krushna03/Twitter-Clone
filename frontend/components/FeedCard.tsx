"use client"

import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { Tweet } from "@/gql/graphql"

interface FeedCardProps {
  data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {

  const { data } = props;
  
  return (
    <div className='border border-r-0 border-l-0 border-b-0 p-5 border-gray-600 hover:bg-[#171717] transition-all cursor-pointer'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-1'>
          {
            data.author?.profileImage && (
              <Image 
                src={data.author.profileImage}
                alt="User image" 
                height={90} 
                width={90} 
                className='rounded-full'
              />
            )
          }
        </div>

        <div className='col-span-11'>
          <h1>{data.author?.firstName} {data.author?.lastname}</h1>
          <p>
            {data.content} 
          </p>

          <div className='flex justify-between mt-5 text-xl items-center w-[90%]'>
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <AiOutlineHeart />
            </div>
            <div>
              <BiUpload />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FeedCard