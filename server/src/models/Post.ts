// server/src/models/Post.ts

import { Schema, model, Types } from 'mongoose';

// 1. Interfaces (TypeScript)
// We define strict types for Comments and Likes to ensure code safety.

interface IComment {
  body: string;
  username: string;
  createdAt: string;
}

interface ILike {
  username: string;
  createdAt: string;
}

interface IPost {
  body: string;
  username: string;
  createdAt: string;
  comments: IComment[];
  likes: ILike[];
  user: Types.ObjectId; // Reference to the User who created it
}

// 2. Schemas (Mongoose)

const postSchema = new Schema<IPost>({
  body: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
  // Embedded Array of Comments
  comments: [
    {
      body: String,
      username: String,
      createdAt: {
        type: String,
        default: () => new Date().toISOString(),
      },
    },
  ],
  // Embedded Array of Likes
  likes: [
    {
      username: String,
      createdAt: {
        type: String,
        default: () => new Date().toISOString(),
      },
    },
  ],
  // Relationship: Linking this post to a specific User ID
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users', // This must match the collection name in MongoDB
  },
});

// 3. Export
export const Post = model<IPost>('Post', postSchema);