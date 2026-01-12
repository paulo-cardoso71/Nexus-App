// server/src/util/check-auth.ts

import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const checkAuth = (context: any) => {
  // context = { req: ... }
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    // Bearer ....
    const token = authHeader.split('Bearer ')[1];
    
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY || 'unsafe_fallback_key');
        return user; // Retorna os dados do usuário (id, email, username)
      } catch (err) {
        throw new GraphQLError('Invalid/Expired token', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  
  throw new Error('Authorization header must be provided');
};