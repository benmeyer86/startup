import React from 'react';
import './login.css';

export function Login() {
  return (
    <main className="container">
      <h1>Login</h1>
      <form>
          <input id="username" name="username" type="text" placeholder="Username" />
          <input id="password" name="password" type="password" placeholder="Password " />
      </form>
      <aside>This aside is a placeholder for the third-party service, used to fetch a random quote.</aside>
    </main>
  );
}