import { graphql } from "@/gql";


export const createTweetMutation = graphql(`#@grphql
    mutation CreateTweet($payload: CreateTweetData!) {
      createTweet(payload: $payload) {
        id
      }
    }
`)