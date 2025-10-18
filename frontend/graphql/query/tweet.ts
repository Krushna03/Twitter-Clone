import { graphql } from "@/gql";

// import { graphql } from "graphql";


export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
      getAllTweets {
        id
        content 
        imageURL
        author {
          id
          firstName
          lastname
          profileImage
        }
      }
    }
`)

export const getSignedURLForTweetQuery = graphql(`#graphql
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`)