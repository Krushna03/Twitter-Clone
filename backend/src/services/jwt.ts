import { User } from "@prisma/client"
import jwt from "jsonwebtoken"
import { JWTUser } from "../Types/type";

const jwt_scrert = "kehfrqez20732x4r29843yr"


class JWTService {
  public static generateTokenForUser(user : User) {
    
    const payload : JWTUser = {
      id: user?.id,
      email: user?.email
    }

    const token = jwt.sign(payload, jwt_scrert);
    
    return token;
  }

  public static decodeToken(token: string) {
    try {
      return jwt.verify(token, jwt_scrert) as JWTUser
    } catch (error) {
      return null;
    }
  }
}

export default JWTService