import { GraphqlContext } from "../../Types/type";
import { prismaClient } from "../../client/db";
import { User } from "@prisma/client";
import UserService from "../../services/user";
import { redisClient } from "../../client/redis/redis";

const queries = {
  
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    
    const userToken = await UserService.verifyGoogleAuthToken(token);

    return userToken;
  },

  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx.user?.id
    if (!id) {
      return null
    }

    const user = await UserService.getUserById(id);
    return user;
  },

  getUserById: async (parent: any, { id }: { id: string }, ctx: GraphqlContext) => {
    if (!id) throw new Error("UserId not found");

    const user = await UserService.getUserById(id);
    
    return user;
  }
}

const extraResolvers = {
  User: {
    tweets: (parent: User) => 
      prismaClient.tweet.findMany({ where: { author: { id: parent.id }}}),

    followers: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { following: { id: parent.id }},
        include: {
          follower: true,
        }
      })
      return result.map(el => el.follower);
    },

    following: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { follower: { id: parent.id }},
        include: {
          following: true,
        }
      })  
      return result.map(el => el.following);
    },

    recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
      if(!ctx.user) return [];

      console.log("Before finding users");
      const cachedUsers = await redisClient.get(`recommendedUsers:${ctx.user.id}`);
      if(cachedUsers) {
        return JSON.parse(cachedUsers);
      }

      const myFollowing = await prismaClient.follows.findMany({
        where: {
          follower: { id: ctx.user.id }
        },
        include: {
          following: {
            include: { followers: { include: { following: true } } }
          }
        }
      });

      const user: User[] = [];

      for (const followings of myFollowing) {
        for (const followingOfFollowedUser of followings.following.followers) {
          if (followingOfFollowedUser.following.id !== ctx.user.id &&
              myFollowing.findIndex((e) => e?.followingId === followingOfFollowedUser.following.id) < 0
            ) {
            user.push(followingOfFollowedUser.following)
          }
        }
      }
      console.log("After finding users");
      await redisClient.set(`recommendedUsers:${ctx.user.id}`, JSON.stringify(user));

      return user;
    }
  }
}

const mutations = {
  followUser: async (parent: any, { to }: { to: string }, ctx : GraphqlContext) => {
    if(!ctx || !ctx.user?.id) throw new Error("Un-authenticated");

    await UserService.followUser(ctx.user.id, to)
    await redisClient.del(`recommendedUsers:${ctx.user.id}`);

    return true;
  },
  
  unfollowUser: async (parent: any, { to }: { to: string }, ctx : GraphqlContext) => {
    if(!ctx || !ctx.user?.id) throw new Error("Un-authenticated");

    await UserService.unfollowUser(ctx.user.id, to)
    await redisClient.del(`recommendedUsers:${ctx.user.id}`);
    
    return true;
  }
}

export const resolver = { queries, extraResolvers, mutations }