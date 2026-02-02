import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';
import { validateRegisterInput, validateLoginInput } from '../../util/validators.js';
import { Post } from '../../models/index.js';
import { checkAuth } from '../../util/check-auth.js';

interface UserPayload {
  id: string;
  username: string;
  email: string;
}

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
    // --- REGISTER ---
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

      // Check Username
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('Username is taken');
      }

      // Check Email
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        // Isso vai cair no 'main' error do Frontend e aparecer na caixa vermelha
        throw new Error('Email is already taken');
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

    // --- LOGIN ---
    async login(_: any, { username, password }: any) {
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new Error(JSON.stringify(errors));
      }

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found'); 
      }

      const match = await bcrypt.compare(password, user.password as string);
      if (!match) {
        throw new Error('Wrong credentials');
      }

      const token = generateToken(user);

      return {
        ...user.toObject(),
        id: user._id,
        token,
      };
    },

    // --- DELETE USER ---
    async deleteUser(_: any, __: any, context: any) {
      // 2. Aqui a mágica: dizemos ao TS que o retorno é do tipo UserPayload
      const user = checkAuth(context) as UserPayload;

      try {
        // Agora o erro sumiu porque ele sabe que 'user' tem 'username' e 'id'
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(user.id);

        return 'User and posts deleted successfully';
      } catch (err) {
        throw new Error('Error deleting user');
      }
    }
  },
};