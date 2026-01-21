// client/src/App.tsx

// 1. Standard import (The only correct way in modern Apollo)
import { useQuery, gql } from '@apollo/client';

// 2. Interface Definition (Solves 'implicit any' issues)
interface Post {
  id: string;
  body: string;
  username: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likes: {
    username: string;
  }[];
  comments: {
    id: string;
    username: string;
    body: string;
    createdAt: string;
  }[];
}

// Interface for the Query Result
interface GetPostsData {
  getPosts: Post[];
}

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      commentCount
    }
  }
`;

function App() {
  // 3. Typed Query Hook
  const { loading, error, data } = useQuery<GetPostsData>(GET_POSTS);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-blue-600 animate-pulse">Loading posts...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Connection Error:</p>
        <p>{error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Social Media Feed 🚀
        </h1>

        <div className="space-y-4">
          {/* 4. EXPLICIT TYPING HERE 👇 
            We explicitly tell TS that 'post' is of type 'Post'.
            This kills the "Parameter implicitly has an 'any' type" error.
          */}
          {data?.getPosts.map((post: Post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-800 text-lg">@{post.username}</span>
                <span className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-600 text-lg mb-4 leading-relaxed border-l-4 border-blue-500 pl-4">
                {post.body}
              </p>
              
              <div className="flex gap-6 text-gray-500 font-medium border-t pt-4">
                <span className="flex items-center gap-1 cursor-pointer hover:text-red-500">
                  ❤️ {post.likeCount} Likes
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                  💬 {post.commentCount} Comments
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;