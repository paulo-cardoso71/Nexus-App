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
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Create a Post</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="What's on your mind?"
            name="body"
            onChange={onChange}
            value={values.body}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={values.body.trim() === ''}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Post
        </button>
      </form>
      
      {error && (
        <div className="mt-3 text-red-600 text-sm bg-red-100 p-2 rounded">
          {error.graphQLErrors[0]?.message}
        </div>
      )}
    </div>
  );
}

export default PostForm;