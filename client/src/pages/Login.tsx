// client/src/pages/Login.tsx

import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';

// 1. GraphQL Mutation for Login
const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});

  // 2. Form State
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  // 3. Handle Input Change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // 4. Mutation Hook
  // We use the same logic as Register: obtain token -> save to context -> redirect
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate('/');
    },
    onError(err) {
      // Capture errors (e.g., "User not found", "Wrong password")
      setErrors(err && err.graphQLErrors[0] ? err.graphQLErrors[0].extensions?.errors : {});
    },
    variables: values
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.username}
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

          {/* Error Display */}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;   