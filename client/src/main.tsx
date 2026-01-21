import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 1. Importe as ferramentas puras do pacote principal
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// 2. Importe o componente React de dentro da pasta específica 'react'
import { ApolloProvider } from '@apollo/client/react';

// 1. Crie o link HTTP separadamente (Isso acalma o TypeScript sobre a 'uri')
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

// 2. Configure o cliente usando 'link' em vez de passar 'uri' direto
const client = new ApolloClient({
  link: httpLink, 
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)