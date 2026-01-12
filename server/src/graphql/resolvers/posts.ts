// server/src/graphql/resolvers/posts.ts

import { Post } from '../../models/index.js';
import { checkAuth } from '../../util/check-auth.js'; // <--- IMPORTE ISSO

export const postsResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err as string);
      }
    },
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
    // Adicionamos o argumento 'context' aqui (terceiro parametro)
    async createPost(_: any, { body }: { body: string }, context: any) {
      
      // 1. VERIFICAR QUEM É O USUÁRIO (SEGURANÇA)
      const user = checkAuth(context) as { id: string; username: string; email: string };
      // Se o token for inválido, o código para aqui e dá erro.
      
      console.log("Usuário logado:", user); // Só para debug

      // 2. CRIAR O POST COM O USUÁRIO REAL
      // O 'user' retornado pelo checkAuth tem os dados que colocamos no token (username, id, etc)
      const newPost = new Post({
        body,
        user: user.id,      // Referência ao ID do banco
        username: user.username, // Nome real do usuário logado
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      return post;
    },

    async deletePost(_: any, { postId }: { postId: string }, context: any) {
      // 1. Pega quem está logado (O Token)
      const user = checkAuth(context) as { username: string };

      try {
        // 2. Busca o post no banco
        const post = await Post.findById(postId);
        
        if (!post) {
           throw new Error('Post not found');
        }

        // 3. A REGRA DE OURO: O dono do post é o mesmo do token?
        if (user.username === post.username) {
          await post.deleteOne(); // Apaga do banco
          return 'Post deleted successfully';
        } else {
          // Se não for o dono...
          throw new Error('Action not allowed'); 
        }
      } catch (err) {
        throw new Error(err as string);
      }
    },

    async likePost(_: any, { postId }: { postId: string }, context: any) {
      const user = checkAuth(context) as { username: string };

      const post = await Post.findById(postId);
      
      if (post) {
        // Check if the user has already liked this post
        if (post.likes.find((like) => like.username === user.username)) {
          
          // Post already liked, UNLIKE it
          post.likes = post.likes.filter((like) => like.username !== user.username);
          
        } else {
          
          // Not liked, LIKE it
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString()
          });
          
        }

        await post.save();
        return post;
      } else {
        throw new Error('Post not found');
      }
    },
    async createComment(_: any, { postId, body }: { postId: string, body: string }, context: any) {
      const user = checkAuth(context) as { username: string };

      if (body.trim() === '') {
        throw new Error('Empty comment'); // Validação simples
      }

      const post = await Post.findById(postId);

      if (post) {
        // Adiciona o comentário no INÍCIO da lista (unshift)
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString()
        });
        
        await post.save();
        return post;
      } else {
        throw new Error('Post not found');
      }
    },

    async deleteComment(_: any, { postId, commentId }: { postId: string, commentId: string }, context: any) {
      const user = checkAuth(context) as { username: string };

      const post = await Post.findById(postId);

      if (post) {
        // Encontra o índice do comentário
        const commentIndex = post.comments.findIndex((c: any) => c.id === commentId);

        // Se o comentário existe...
        if (commentIndex > -1) { // (Sim, a verificação no JS puro seria verificando o ID)
            
          // Regra de Ouro: Só quem criou o comentário pode apagar
          if (post.comments[commentIndex].username === user.username) {
            post.comments.splice(commentIndex, 1); // Remove 1 item no índice encontrado
            await post.save();
            return post;
          } else {
            throw new Error('Action not allowed');
          }
        } else {
            throw new Error('Comment not found');
        }
      } else {
        throw new Error('Post not found');
      }
    }
  }
};