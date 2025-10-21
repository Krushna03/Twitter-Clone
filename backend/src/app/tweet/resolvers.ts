import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../Types/type"
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService, { CreateTweetData } from "../../services/tweet";


const accessKeyId: string = process.env.AWS_S3_ACCESS_KEY || ""; 
const secretAccessKey: string = process.env.AWS_S3_ACCESS_SECRET || "";
const defaultRegion: string = process.env.AWS_DEFAULT_REGION || "";
const awsS3Bucket: string = process.env.AWS_S3_BUCKET || "";

const s3ClientConfig: S3ClientConfig = {
  region: defaultRegion,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
}
const s3Client = new S3Client(s3ClientConfig)

const queries = {
  getAllTweets: () => TweetService.getAllTweets(),
  
  getSignedURLForTweet: async (parent: any, { imageType, imageName }: { imageName: string, imageType: string }, ctx: GraphqlContext) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthorized")
    
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", 'image/webp']
    
    if (!allowedImageTypes.includes(imageType)) throw new Error("Unsupported Image Type")
      
    const extension = imageType.split("/")[1];
    const key = `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}.${extension}`;
    
    const putObjectCommand = new PutObjectCommand({
      Bucket: awsS3Bucket,
      Key: key,
      ContentType: imageType,
    })

    const signedURL = await getSignedUrl(s3Client, putObjectCommand)
    
    return signedURL;
  }
}

const mutations = {
  createTweet: async (parent: any, {payload}:{payload: CreateTweetData}, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("You are not authorized");
    }

    const tweet = await TweetService.createTweet({
      ...payload,
      userId: ctx.user.id
    })

    return tweet;
  }
}

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) => UserService.getUserById(parent.authorId)
  }
}

export const resolver = { mutations, extraResolvers, queries }


