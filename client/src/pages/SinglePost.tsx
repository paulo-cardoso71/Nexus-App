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

  // Busca os dados do Post
  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  // Mutation para CRIAR Comentário
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

  // Mutation para DELETAR Comentário
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading post</p>;
  if (!data?.getPost) return <p className="text-center mt-10">Post not found</p>;

  const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

  function deletePostCallback() {
    navigate('/');
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* --- CARTÃO DO POST PRINCIPAL --- */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex items-center gap-3">
             {/* Avatar do Post */}
             <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow">
                {username[0].toUpperCase()}
             </div>
             <div>
                <h2 className="text-2xl font-bold text-gray-800">@{username}</h2>
                <span className="text-gray-400 text-sm">{new Date(createdAt).toLocaleString()}</span>
             </div>
          </div>
          {/* Lixeira do Post (Só se for dono) */}
          {user && user.username === username && (
            <DeleteButton postId={id} callback={deletePostCallback} />
          )}
        </div>

        <p className="text-gray-700 text-xl mb-8 leading-relaxed pl-2">{body}</p>

        <div className="flex items-center gap-6 border-t pt-4">
          <LikeButton user={user} post={{ id, likeCount, likes }} />
          <span className="text-gray-500 font-medium cursor-default">
            💬 {commentCount} Comments
          </span>
        </div>
      </div>

      {/* --- ÁREA DE COMENTÁRIOS (Wireframe Style) --- */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
        <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          Comentários
          <span className="bg-gray-200 text-gray-600 text-sm py-1 px-2 rounded-full">{commentCount}</span>
        </h3>

        {/* Formulário de Novo Comentário */}
        {user ? (
          <div className="mb-8 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold shrink-0">
                {user.username[0].toUpperCase()}
            </div>
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                className="w-full p-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                ref={commentInputRef}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-600 font-bold hover:text-teal-800 disabled:opacity-50"
                disabled={comment.trim() === ''}
                onClick={() => submitComment()}
              >
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-6 text-gray-500">Faça login para comentar.</p>
        )}

        {/* Lista de Comentários */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {comments.map((comment: any) => (
            <div key={comment.id} className="group flex gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
               {/* Avatar do Comentário */}
               <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold shrink-0">
                  {comment.username[0].toUpperCase()}
               </div>
               
               <div className="w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-gray-800 mr-2">@{comment.username}</span>
                      <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Botão de Deletar Comentário (Discreto) */}
                    {user && user.username === comment.username && (
                      <button
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => deleteComment({ variables: { postId: id, commentId: comment.id } })}
                        title="Apagar comentário"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{comment.body}</p>
               </div>
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-10 text-gray-400">
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