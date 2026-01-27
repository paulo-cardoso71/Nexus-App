// client/src/components/PostForm.tsx

import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

// 1. Mutation to Create Post
const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
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

// This query is needed to update the cache (same as in Home.tsx)
const FETCH_POSTS_QUERY = gql`
  query GetPosts {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      likes { username }
      comments { id username body createdAt }
    }
  }
`;

function PostForm() {
  const [values, setValues] = useState({ body: '' });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ body: e.target.value });
  };

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    // 2. IMPORTANT: Update the local cache immediately after creation
    update(proxy, result) {
      const data = proxy.readQuery<any>({
        query: FETCH_POSTS_QUERY,
      });

      // Add the new post to the beginning of the list
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      
      setValues({ body: '' }); // Clear input
    },
    onError(err) {
      console.log(err);
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost();
  };

 return (
    // CARD: Branco no Light, Slate-800 no Dark (Zero Branco puro no escuro)
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-300">
      
      <h2 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">✨</span>
        Create a new post
      </h2>
      
      <form onSubmit={onSubmit}>
        <div className="mb-4 relative">
          {/* INPUT: Fundo Slate-50 no Light, Slate-900 no Dark (Contraste profundo) */}
          <input
            type="text"
            placeholder="What are you thinking today?"
            name="body"
            onChange={onChange}
            value={values.body}
            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={values.body.trim() === ''}
            className="bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 dark:shadow-none"
          >
            Post
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 text-red-500 dark:text-red-300 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-2">
          ⚠️ {error.graphQLErrors[0]?.message}
        </div>
      )}
    </div>
  );
}

export default PostForm;