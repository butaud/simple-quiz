"use client";

import { useAccount, useIsAuthenticated, usePasskeyAuth } from "jazz-react";
import { APPLICATION_NAME } from "./main";

import "./AuthButton.css";

export type AuthButtonProps = {
  username: string;
};
export function AuthButton({ username }: AuthButtonProps) {
  const { logOut } = useAccount();
  const isAuthenticated = useIsAuthenticated();

  const auth = usePasskeyAuth({
    appName: APPLICATION_NAME,
  });

  function handleLogOut() {
    logOut();
    window.history.pushState({}, "", "/");
  }

  if (isAuthenticated) {
    return <button onClick={handleLogOut}>Log out</button>;
  }

  return (
    <div className="auth-button">
      <p>
        Optionally, sign up with a passkey to access your account on any device.
      </p>
      <div className="buttons">
        <button onClick={() => auth.signUp(username)}>Sign up</button>
        <button onClick={() => auth.logIn()}>Log in</button>
      </div>
    </div>
  );
}
