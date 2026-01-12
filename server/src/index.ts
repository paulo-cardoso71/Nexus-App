// server/src/index.ts

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// 1. Import our new TypeDefs (The Menu)
import { typeDefs } from './graphql/typeDefs.js';

// 2. Import the REAL Resolvers (The Chefs)
// We import from the index.js file we created in the resolvers folder.
// This connects the server to the logic we wrote in 'posts.ts'.
import { resolvers } from './graphql/resolvers/index.js';

dotenv.config();

// 3. Database Connection & Server Startup
async function startServer() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('⚠️ MONGODB_URI is missing in .env file');
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('🍃 MongoDB connected successfully!');

    // Initialize Apollo Server with the imported definitions
    const server = new ApolloServer({
      typeDefs,
      resolvers, // Uses the imported resolvers, not a local variable
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at: ${url}`);

  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

startServer();