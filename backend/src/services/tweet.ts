import { prismaClient } from "../client/db"
import { redisClient } from "../client/redis/redis";

export interface CreateTweetData {
  content: string;
  imageURL?: string;
  userId: string;
}

class TweetService {
  public static async createTweet(data: CreateTweetData) {

    const rateLimit = await redisClient.get(`RATE_LIMIT:${data.userId}`);
    if(rateLimit) {
      throw new Error("Rate limit exceeded");                     
    }

    const tweet = await prismaClient.tweet.create({
      data: {
        content: data.content,
        ...(data.imageURL && { imageURL: data.imageURL }),
        author: { connect: { id: data.userId } }
      }
    })
    await redisClient.setex(`RATE_LIMIT:${data.userId}`, 20, "1");
    await redisClient.del("allTweets");
    return tweet;
  }

  public static async getAllTweets() {
    const cachedTweets = await redisClient.get("allTweets");
    if(cachedTweets) {
      return JSON.parse(cachedTweets);
    }

    const tweets = await prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" }})
    await redisClient.set("allTweets", JSON.stringify(tweets));

    return tweets;
  }
}
export default TweetService