// client/src/pages/Register.tsx

import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';

// 1. The GraphQL Mutation
const REGISTER_USER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      # MUDANÇA AQUI: Passamos direto, sem 'registerInput'
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

function Register() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});

  // 2. Form State
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 3. Handle Input Changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // 4. Mutation Hook
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      // SUCCESS: Log the user in via Context and redirect
      context.login(userData);
      navigate('/');
    },
    onError(err) {
      // ERROR: Capture GraphQL validation errors
      // Note: This depends on how your backend formats errors. 
      // Usually accessing err.graphQLErrors[0].extensions.errors
      console.log(err); 
      setErrors(err && err.graphQLErrors[0] ? err.graphQLErrors[0].extensions?.errors : {});
    },
    variables: values
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.username}
              onChange={onChange}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.email}
              onChange={onChange}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.password}
              onChange={onChange}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.confirmPassword}
              onChange={onChange}
            />
          </div>

          {/* Error Message Area */}
          {Object.keys(errors || {}).length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <ul className="list-disc pl-5">
                {Object.values(errors).map((value: any) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;