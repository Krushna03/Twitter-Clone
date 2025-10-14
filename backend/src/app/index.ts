import express from "express"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@as-integrations/express5"
import bodyParser from "body-parser"
import { User } from "./user"
import cors from "cors"
import { GraphqlContext } from "../Types/type"
import JWTService from "../services/jwt"
import { Tweet } from "./tweet"

export async function initServer() {
  const app = express()
  app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
  }))
  app.use(bodyParser.json())

  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
      ${User.types}
      ${Tweet.types}

      type Query {
        ${User.queries}
        ${Tweet.queries}
      }

      type Mutation {
        ${Tweet.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolver.queries,
        ...Tweet.resolver.queries,
      },
      Mutation: {
        ...Tweet.resolver.mutations
      },
        ...Tweet.resolver.extraResolvers,
        ...User.resolver.extraResolvers,
    },
  })

  await graphqlServer.start()

  app.use("/graphql", expressMiddleware(graphqlServer, { 
    context: async ({ req, res}) => {
      return {
        user: req.headers.authorization ? 
        JWTService.decodeToken(req.headers.authorization?.split("Bearer ")[1]) : undefined
      }
    }  
  }));

  return app;
}