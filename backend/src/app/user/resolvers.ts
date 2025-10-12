import axios from "axios"
import { GoogleJwtPayload, GraphqlContext } from "../../Types/type";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";

const queries = {
  verifyGoogleToken: async (parent: any, { token } : {token : string}) => {
    
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
  },

  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx.user?.id
    if (!id) {
      return null
    }

    const user = await prismaClient.user.findUnique({ where: { id }})
    return user;
  }
}

export const resolver = { queries }