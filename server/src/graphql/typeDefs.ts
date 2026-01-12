// server/src/graphql/typeDefs.ts

export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]
    likes: [Like]
    likeCount: Int
    commentCount: Int
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!

    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    
    register(username: String!, email: String!, password: String!, confirmPassword: String!): User!
    login(username: String!, password: String!): User!
  }
`; // <--- A CRASE DEVE FICAR AQUI NO FINAL