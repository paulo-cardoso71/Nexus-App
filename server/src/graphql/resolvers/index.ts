// server/src/graphql/resolvers/index.ts

import { postsResolvers } from './posts.js';
import { usersResolvers } from './users.js'; // <--- Importe aqui

export const resolvers = {
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation, // <--- Adicione aqui (Registro/Login)
    ...postsResolvers.Mutation  // (Criar Post)
  }
};