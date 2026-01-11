// server/src/index.ts

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// 1. TypeDefs: Define the "Shape" of your data.
// This is like the Interface in C#.
// Use the `#graphql` tag so VS Code highlights the syntax correctly.
const typeDefs = `#graphql
  # Think of "Query" as your GET endpoints in REST.
  type Query {
    # Returns a simple string to test connectivity
    hello: String
  }
`;

// 2. Resolvers: The logic behind the types.
// This tells the server HOW to fetch the data defined above.
const resolvers = {
  Query: {
    // When someone asks for 'hello', this function runs.
    hello: () => 'Hello World! Connectivity is working.',
  },
};

// 3. Server Initialization
// We pass the definition (typeDefs) and the logic (resolvers) to Apollo.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the server properly
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();