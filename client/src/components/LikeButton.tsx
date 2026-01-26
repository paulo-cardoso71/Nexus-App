import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

function LikeButton({ user, post: { id, likeCount, likes } }: any) {
  const [liked, setLiked] = useState(false);

  // Efeito para verificar se o usuário atual já curtiu este post
  useEffect(() => {
    if (user && likes.find((like: any) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  // A Mutation que avisa o servidor
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      console.log(err);
    }
  });

  // Botão se estiver logado
  const likeButton = user ? (
    liked ? (
      <button onClick={() => likePost()} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors">
        ❤️ {likeCount} Likes
      </button>
    ) : (
      <button onClick={() => likePost()} className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
        ♡ {likeCount} Likes
      </button>
    )
  ) : (
    // Botão se NÃO estiver logado (manda pro login)
    <Link to="/login" className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
      ♡ {likeCount} Likes
    </Link>
  );

  return likeButton;
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;