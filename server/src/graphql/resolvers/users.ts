// server/src/graphql/resolvers/users.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';
import { validateRegisterInput, validateLoginInput } from '../../util/validators.js'; // Importe o validateLoginInput

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY || 'unsafe_fallback_key',
    { expiresIn: '1h' }
  );
};

export const usersResolvers = {
  Mutation: {
    // --- REGISTER (JÁ ESTAVA AQUI) ---
    async register(
      _: any,
      { username, email, password, confirmPassword }: any
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new Error(JSON.stringify(errors));
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new Error('Username is taken');
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password: passwordHash,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res.toObject(),
        id: res._id,
        token,
      };
    },

    // --- LOGIN (NOVIDADE AQUI 👇) ---
    async login(_: any, { username, password }: any) {
      // 1. Validar se digitou algo
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new Error(JSON.stringify(errors));
      }

      // 2. Buscar usuário no banco
      const user = await User.findOne({ username });
      if (!user) {
        // Cuidado: Em apps reais, as vezes dizemos "Credenciais Inválidas" para não dar dica a hackers
        throw new Error('User not found'); 
      }

      // 3. Checar a senha (Bcrypt compara a senha digitada com a hash do banco)
      const match = await bcrypt.compare(password, user.password as string);
      if (!match) {
        throw new Error('Wrong credentials');
      }

      // 4. Gerar o token (O Crachá)
      const token = generateToken(user);

      return {
        ...user.toObject(),
        id: user._id,
        token,
      };
    }
  },
};