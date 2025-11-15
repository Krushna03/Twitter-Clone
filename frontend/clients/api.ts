import { GraphQLClient } from "graphql-request";

const isCLient = typeof window !== "undefined";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = baseURL.endsWith("/graphql") ? baseURL : `${baseURL}/graphql`;

export const graphqlClient = new GraphQLClient(API_URL, 
  {
    headers: () => ({
      Authorization: isCLient ? `Bearer ${window.localStorage.getItem("_twitter_token")}` : ""
    })
  }
); 