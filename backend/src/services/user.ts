import axios from "axios";
import { prismaClient } from "../client/db";
import { GoogleJwtPayload } from "../Types/type";
import JWTService from "./jwt";


class UserService {
  public static async verifyGoogleAuthToken(token: string) {
    const googleToken = token;
    const googleOAuthTokenUrl = new URL("https://oauth2.googleapis.com/tokeninfo");

    googleOAuthTokenUrl.searchParams.set("id_token", googleToken);
  
    const { data } = await axios.get<GoogleJwtPayload>(googleOAuthTokenUrl.toString(), {
      responseType: "json"
    }) 

    const user = await prismaClient.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastname: data.family_name,
          profileImage: data.picture
        }
      }) 
    }

    const userInDb = await prismaClient.user.findUnique({
      where: { email: data.email }
    })

    if (!userInDb) throw new Error("User with email not found")
      
    const userToken = JWTService.generateTokenForUser(userInDb);

    return userToken;
  }

  public static async getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id }})
  }

  public static async followUser(from: string, to: string) {
    const existingFollow = await prismaClient.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: from,
          followingId: to
        }
      }
    });

    if (existingFollow) {
      return existingFollow;
    }

    return prismaClient.follows.create({
      data: {
        follower: { connect: { id: from } },
        following: { connect: { id: to } }
      }
    })
  }

  public static unfollowUser(from: string, to: string) {
    return prismaClient.follows.delete(
      {
        where: { followerId_followingId: { followerId: from, followingId: to }}
      }
    )
  }
}

export default UserService;