// client/src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// 1. O Link HTTP (Onde está o servidor)
const httpLink = createHttpLink({
uri: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
})

// 2. O Link de Autenticação (O Interceptador)
// Ele roda antes de cada pedido, pega o token e coloca no Header
const authLink = setContext((_, { headers }) => {
  // Pega o token do armazenamento local
  const token = localStorage.getItem('jwtToken');
  
  // Retorna os headers antigos + o novo header de autorização
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// 3. O Cliente Final (Junta os dois links)
const client = new ApolloClient({
  link: authLink.concat(httpLink), // <-- A Mágica acontece aqui: Auth + Http
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)