import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../Types/type"
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


interface CreateTweetData {
  content: string
  imageURL: string
}

const accessKeyId: string = process.env.AWS_S3_ACCESS_KEY || ""; 
const secretAccessKey: string = process.env.AWS_S3_ACCESS_SECRET || "";

const s3ClientConfig: S3ClientConfig = {
  region: "ap-south-1",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
}
const s3Client = new S3Client(s3ClientConfig)

const queries = {
  getAllTweets: () => prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
  
  getSignedURLForTweet: async (parent: any, { imageType, imageName }: { imageName: string, imageType: string }, ctx: GraphqlContext) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthorized")
    
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", 'image/webp']
    
    if (!allowedImageTypes.includes(imageType)) throw new Error("Unsupported Image Type")
      
    const putObjectCommand = new PutObjectCommand({
      Bucket: "krushna-twitter-dev",
      Key: `uploads/${ctx.user.id}/tweets/${imageName}-${new Date()}.${imageType}`
    })

    const signedURL = await getSignedUrl(s3Client, putObjectCommand)
    console.log("signed", signedURL);
    
    return signedURL;
  }
}

const mutations = {
  createTweet: async (parent: any, {payload}:{payload: CreateTweetData}, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("You are not authorized");
    }

    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: ctx.user.id } }
      }
    })

    return tweet;
  }
}

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) => 
      prismaClient.user.findUnique({ where: { id: parent.authorId }})
  }
}

export const resolver = { mutations, extraResolvers, queries }


