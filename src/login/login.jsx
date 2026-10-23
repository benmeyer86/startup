import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

export function Login({setUser}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  function loginUser() {
    localStorage.setItem('user', username);
    localStorage.setItem('password', password);
    setUser(username);
    navigate('/');
  }

  function usernameChange(e) {
    setUsername(e.target.value);
  }

  function passwordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <main className="container">
      <h1>Login</h1>
      <form onSubmit={loginUser}>
          <input id="username" name="username" type="text" placeholder="Username" onChange={usernameChange} />
          <input id="password" name="password" type="password" placeholder="Password " onChange={passwordChange} />
          <div className="login-actions">
            <button type="submit">Log in</button>
            <button type="submit">Create Account</button>
          </div>
      </form>
      <aside>This aside is a placeholder for the third-party service, used to fetch a random quote.</aside>
    </main>
  );
}