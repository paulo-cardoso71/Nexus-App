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
    # Adicionamos esta linha para bater com o seu Resolver!
    createPost(body: String!): Post!
    
    # Vamos deixar o register comentado por enquanto para não dar erro, 
    # pois ainda não criamos a lógica (resolver) dele.
    # register(username: String!, email: String!, password: String!, confirmPassword: String!): User!
  }
`;