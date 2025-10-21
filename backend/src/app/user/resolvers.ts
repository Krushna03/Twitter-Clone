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
    tweets: async (parent: User) => 
      prismaClient.tweet.findMany({ where: { author: { id: parent.id }}})
  }
}

export const resolver = { queries, extraResolvers }