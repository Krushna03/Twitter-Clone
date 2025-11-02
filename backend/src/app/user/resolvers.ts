import { GraphqlContext } from "../../Types/type";
import { prismaClient } from "../../client/db";
import { User } from "@prisma/client";
import UserService from "../../services/user";

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
        where: { follower: { id: parent.id }},
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
    }
  }
}

const mutations = {
  followUser: async (parent: any, { to }: { to: string }, ctx : GraphqlContext) => {
    if(!ctx || !ctx.user?.id) throw new Error("Un-authenticated");

    await UserService.followUser(ctx.user.id, to)

    return true;
  },
  
  unfollowUser: async (parent: any, { to }: { to: string }, ctx : GraphqlContext) => {
    if(!ctx || !ctx.user?.id) throw new Error("Un-authenticated");

    await UserService.unfollowUser(ctx.user.id, to)

    return true;
  }
}

export const resolver = { queries, extraResolvers, mutations }