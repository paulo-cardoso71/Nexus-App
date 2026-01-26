import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

// 1. Interface for Post Data
interface Post {
  id: string;
  body: string;
  username: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likes: { username: string }[];
  comments: { id: string; username: string; body: string; createdAt: string }[];
}

// 2. The Query
export const FETCH_POSTS_QUERY = gql`
  query GetPosts {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

function Home() {
  const { user } = useContext(AuthContext);
  
  const { loading, error, data } = useQuery<{ getPosts: Post[] }>(FETCH_POSTS_QUERY);

  if (loading) return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
       <p className="text-red-500 font-bold bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 text-center">
         Error: {error.message}
       </p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        
        {/* Formulário de Post (Só aparece se logado) */}
        {user && (
          <div className="animate-fade-in-down">
            <PostForm />
          </div>
        )}

        {/* Título da Página */}
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 pl-1">
          Feed Recente
        </h1>

        {/* Lista de Posts */}
        <div className="space-y-6">
          {data?.getPosts.map((post) => (
            // O CARD COMPLETO:
            // bg-white (claro) | dark:bg-slate-800 (escuro)
            // shadow-sm (sutil) + hover:shadow-md (efeito visual)
            <div 
              key={post.id} 
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 relative"
            >
               
               {/* Cabeçalho do Card */}
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar Moderno */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white dark:ring-slate-700">
                      {post.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">@{post.username}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Botão de Delete (Posicionado com segurança) */}
                  {user && user.username === post.username && (
                    <div className="z-10">
                      <DeleteButton postId={post.id} />
                    </div>
                  )}
               </div>

               {/* Corpo do Texto */}
               <p className="text-slate-700 dark:text-slate-200 text-lg mb-6 leading-relaxed">
                 {post.body}
               </p>

               {/* Ações (Like e Comentários) - ÁREA CRÍTICA CORRIGIDA */}
               <div className="flex items-center gap-8 border-t border-slate-100 dark:border-slate-700 pt-5 mt-2">
                  
                  {/* Container do Like */}
                  <div className="flex items-center z-10">
                    <LikeButton user={user} post={post} />
                  </div>
                  
                  {/* Container do Comentário */}
                  <Link 
                    to={`/posts/${post.id}`} 
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium group z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform duration-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <span>{post.commentCount} Comentários</span>
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;