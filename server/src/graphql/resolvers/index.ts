// server/src/graphql/resolvers/index.ts
import { postsResolvers } from './posts.js';

export const resolvers = {
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...postsResolvers.Mutation
  }
};