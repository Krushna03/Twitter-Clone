"use client"

import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'

const FeedCard = () => {
  return (
    <div className='border border-r-0 border-l-0 border-b-0 p-5 border-gray-600 hover:bg-[#171717] transition-all cursor-pointer'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-1'>
          <Image 
            src="https://avatars.githubusercontent.com/u/95876502?v=4" alt="User image" 
            height={90} 
            width={90} 
            className='rounded-full'
          />
        </div>

        <div className='col-span-11'>
          <h1>Krushna Sakhare</h1>
          <p>
            It is just me or everyone else? Do Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus ratione a facilis quis quidem velit perspiciatis aliquid aspernatur vitae provident 
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