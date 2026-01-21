// client/src/pages/Home.tsx

import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

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

// 2. The Query (Must match exactly what is in PostForm for cache to work!)
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
  // Access user from context to decide if we show the PostForm
  const { user } = useContext(AuthContext);
  
  const { loading, error, data } = useQuery<{ getPosts: Post[] }>(FETCH_POSTS_QUERY);

  if (loading) return (
    <div className="flex items-center justify-center mt-10">
      <p className="text-xl text-blue-600 animate-pulse">Loading posts...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center mt-10">
       <p className="text-red-500 font-bold">Error: {error.message}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 gap-8">
        
        {/* 3. Post Form Section (Only visible if logged in) */}
        {user && (
          <div className="mb-8 animate-fade-in-down">
            <PostForm />
          </div>
        )}

        {/* 4. Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Recent Posts
        </h1>

        {/* 5. Posts Feed */}
        <div className="space-y-6">
          {data?.getPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
               <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    {/* Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {post.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">@{post.username}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
               </div>

               <p className="text-gray-600 text-lg mb-4 leading-relaxed pl-1">
                 {post.body}
               </p>

               <div className="flex gap-6 text-gray-500 font-medium border-t pt-4">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    ❤️ {post.likeCount} Likes
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    💬 {post.commentCount} Comments
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;