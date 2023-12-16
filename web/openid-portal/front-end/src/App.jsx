import styles from './App.module.css';
import React, { useEffect } from 'react';
import { useAuth, hasAuthParams } from "react-oidc-context";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from "./Header";
import { Home } from "./Home";
import { List } from "./List";

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (!hasAuthParams() &&
      !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div className={styles["App"]}>Signing you in...</div>;
    case "signoutRedirect":
      return <div className={styles["App"]}>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div className={styles["App"]}>Loading...</div>;
  }

  if (auth.error) {
    return <div className={styles["App"]}>Oops... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className={styles["App"]}>Unable to log in</div>
    )
  }

  return (
    <div className={styles["App"]}>
      <BrowserRouter>
        <div className={styles["AppHeader"]}>
          <Header />
        </div>
        <div className={styles["AppBody"]}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/List" element={<List />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
