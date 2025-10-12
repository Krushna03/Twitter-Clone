import { GraphQLClient } from "graphql-request";

const isCLient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient("http://localhost:8000/graphql", 
  {
    headers: () => ({
      Authorization: isCLient ? `Bearer ${window.localStorage.getItem("_twitter_token")}` : ""
    })
  }
); 