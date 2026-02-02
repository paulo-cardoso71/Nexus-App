import React, { useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const DELETE_USER_MUTATION = gql`
  mutation deleteUser {
    deleteUser
  }
`;

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    update() {
      logout(); // Desloga o usuário
      navigate('/'); // Manda pra home
    },
    onError(err) {
      console.log(err);
    }
  });

  const handleDelete = () => {
    // Um confirm nativo simples só pra segurança
    if (window.confirm("Are you sure? This will delete your account and ALL your posts permanently.")) {
      deleteUser();
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        
        {/* Avatar Gigante */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg ring-4 ring-slate-50 dark:ring-slate-900">
          {user.username[0].toUpperCase()}
        </div>

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          @{user.username}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {user.email}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-700 my-8"></div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
          <h3 className="text-red-700 dark:text-red-400 font-bold mb-2">Danger Zone</h3>
          <p className="text-red-600/80 dark:text-red-400/70 text-sm mb-4">
            Once you delete your account, there is no going back. All your posts will be permanently removed.
          </p>
          
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;