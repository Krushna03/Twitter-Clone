import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../Types/type"


interface CreateTweetData {
  content: string
  imageURL: string
}

const queries = {
  getAllTweets: () => prismaClient.tweet.findMany({ orderBy: { createdAt: "desc"}})
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


