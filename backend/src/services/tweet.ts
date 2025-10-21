import { prismaClient } from "../client/db"

export interface CreateTweetData {
  content: string;
  imageURL: string;
  userId: string;
}

class TweetService {
  public static async createTweet(data: CreateTweetData) {
    return prismaClient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userId } }
      }
    })
  }

  public static getAllTweets() {
    return prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" }})
  }
}
export default TweetService