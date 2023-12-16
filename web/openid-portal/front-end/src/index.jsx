import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { AuthProvider } from "react-oidc-context";

const queryClient = new QueryClient()

const oidcConfig = {
  authority: `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_OIDC_PORT}`,
  client_id: "guest",
  redirect_uri: `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_FRONT_END_PORT}/callback`,
  audience: `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_OIDC_PORT}`,
  scope: "h0h0h0",
  onSigninCallback: (_user) => {
    window.history.replaceState(
      {},
      document.title,
      "/"
    )
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
