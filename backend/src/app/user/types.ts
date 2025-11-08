

export const types = `#graphql

  type User {
    id: ID! 
    firstName: String! 
    lastname: String
    email: String!
    profileImage: String

    recommendedUsers: [User]
    
    followers: [User]
    following: [User]

    tweets: [Tweet] 
  }
`