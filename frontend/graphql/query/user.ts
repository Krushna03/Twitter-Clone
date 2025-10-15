import { graphql } from "../../gql"

export const verifyUserGoogleTokenQuery = graphql(`#graphql
  query VerifyUserGoogleToken($token: String!){
    verifyGoogleToken(token: $token)
  }
`)


export const getCurrentUserQuery = graphql(`#graphql
  query GetCurrentUser{
    getCurrentUser {
      id
      email
      firstName
      lastname
      profileImage
      tweets {
        id
        content
        author {
          firstName
          lastname
          profileImage
        }
      }
    }
  }
`)


export const getUserByIdQuery = graphql(`#graphql
    query GetUserById($id: ID!) {
      getUserById(id: $id) {
        id
        firstName
        lastname
        profileImage
        tweets {
          id
          content
          author {
            id
            firstName
            lastname
            profileImage
            email
          }
        }  
      }
    }  
`)