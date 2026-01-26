import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../pages/Home';
interface DeleteButtonProps {
  postId: string;
  callback?: () => void; // Opção para redirecionar se deletarmos de dentro da página do post
}

function DeleteButton({ postId, callback }: DeleteButtonProps) {
  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      // 1. Pega os dados atuais do Cache
      const data = proxy.readQuery<any>({
        query: FETCH_POSTS_QUERY
      });

      if (!data) return;

      // 2. Filtra removendo o post deletado
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter((p: any) => p.id !== postId)
        }
      });

      if (callback) callback();
    },
    variables: { postId }
  });

  const onClick = () => {
    // Confirmação simples do navegador
    if (window.confirm("Tem certeza que quer apagar este post?")) {
      deletePostMutation();
    }
  };

  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-red-600 transition-colors ml-auto"
      title="Delete Post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;