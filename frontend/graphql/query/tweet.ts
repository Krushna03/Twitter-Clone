import { graphql } from "@/gql";

// import { graphql } from "graphql";


export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
      getAllTweets {
        id
        content 
        imageUrl
        author {
          id
          firstName
          lastname
          profileImage
        }
      }
    }
`)