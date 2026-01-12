// server/src/models/User.ts

import { Schema, model } from 'mongoose';

// 1. Define the User Interface (TypeScript)
// This ensures our code knows exactly what a "User" looks like.
export interface IUser {
  username: string;
  email: string;
  password?: string; // Optional because we might hash it later
  token?: string;
  createdAt: string;
}

// 2. Define the Schema (Mongoose)
// This tells MongoDB how to store the data properly.
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true, // Must have a username
    unique: true,   // No duplicate usernames allowed
  },
  email: {
    type: String,
    required: true,
    unique: true,   // No duplicate emails allowed
    match: [
      /.+@.+\..+/,  // Regex to validate simple email format
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(), // Auto-generate date
  },
});

// 3. Create and Export the Model
// The 'User' string is the name of the collection in MongoDB (it will become 'users')
export const User = model<IUser>('User', userSchema);