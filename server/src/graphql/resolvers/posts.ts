// server/src/graphql/resolvers/posts.ts

import { Post } from '../../models/index.js';

export const postsResolvers = {
  Query: {
    // Lógica para buscar TODOS os posts
    async getPosts() {
      try {
        // .find() é do Mongoose. Busca tudo e ordena por data (mais novo primeiro)
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err as string);
      }
    },
    // Lógica para buscar UM post
    async getPost(_: any, { postId }: { postId: string }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err as string);
      }
    }
  },
  
  Mutation: {
    // Lógica para CRIAR um post (Vamos testar isso jajá!)
    async createPost(_: any, { body }: { body: string }) {
      // NOTE: Authentication check will come later (User context)
      // For now, let's hardcode a username just to test the database
      
      const newPost = new Post({
        body,
        username: 'PauloTeste', // Hardcoded for now
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save(); // Salva no MongoDB
      return post;
    }
  }
};