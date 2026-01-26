import React, { useContext, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

// 1. Queries e Mutations
const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes { username }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

function SinglePost() {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [comment, setComment] = useState('');

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current?.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

  if (loading) return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return <p className="text-center mt-10 text-red-500">Error loading post</p>;
  if (!data?.getPost) return <p className="text-center mt-10 dark:text-white">Post not found</p>;

  const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

  function deletePostCallback() {
    navigate('/');
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      {/* --- CARTÃO DO POST PRINCIPAL --- */}
      {/* Ajustado para Dark Mode: bg-slate-800 e bordas sutis */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-white dark:ring-slate-700">
                {username[0].toUpperCase()}
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">@{username}</h2>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {new Date(createdAt).toLocaleString()}
                </span>
             </div>
          </div>
          {user && user.username === username && (
            <DeleteButton postId={id} callback={deletePostCallback} />
          )}
        </div>

        <p className="text-slate-700 dark:text-slate-200 text-xl mb-8 leading-relaxed pl-1">
          {body}
        </p>

        <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-700 pt-4">
          <LikeButton user={user} post={{ id, likeCount, likes }} />
          <span className="text-slate-500 dark:text-slate-400 font-medium cursor-default flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            {commentCount} Comentários
          </span>
        </div>
      </div>

      {/* --- ÁREA DE COMENTÁRIOS --- */}
      {/* Container: Branco no claro, Slate-800 no escuro */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2">
          Discussão
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs py-1 px-2 rounded-full font-bold">
            {commentCount}
          </span>
        </h3>

        {user ? (
          <div className="mb-8 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                {user.username[0].toUpperCase()}
            </div>
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                // INPUT DARK: Fundo Slate-900 para contraste com o card Slate-800
                className="w-full p-3 pr-20 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all shadow-inner"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                ref={commentInputRef}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 transition-colors"
                disabled={comment.trim() === ''}
                onClick={() => submitComment()}
              >
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg text-center">
            Faça login para participar da conversa.
          </p>
        )}

        {/* LISTA DE COMENTÁRIOS */}
        <div className="space-y-4">
          {comments.map((comment: any) => (
            // ITEM: Slate-50 no claro, Slate-900 no escuro (Invertido para destaque)
            <div key={comment.id} className="group flex gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
               <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0 text-sm">
                  {comment.username[0].toUpperCase()}
               </div>
               
               <div className="w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">@{comment.username}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {user && user.username === comment.username && (
                      <button
                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        onClick={() => deleteComment({ variables: { postId: id, commentId: comment.id } })}
                        title="Apagar comentário"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm leading-relaxed">{comment.body}</p>
               </div>
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
              <p>Nenhum comentário ainda.</p>
              <p className="text-sm">Seja o primeiro a falar!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePost;