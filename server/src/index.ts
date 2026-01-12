// server/src/index.ts

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// 1. Load environment variables from .env file
dotenv.config();

// 2. TypeDefs (The Menu)
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// 3. Resolvers (The Chefs)
const resolvers = {
  Query: {
    hello: () => 'Hello World! Database is connected.',
  },
};

// 4. Database Connection & Server Startup
async function startServer() {
  try {
    // Check if the connection string exists
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('⚠️ MONGODB_URI is missing in .env file');
    }

    // Connect to MongoDB
    // strictQuery: true is a recommendation for Mongoose v7+
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('🍃 MongoDB connected successfully!');

    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start the server
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at: ${url}`);

  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

startServer();