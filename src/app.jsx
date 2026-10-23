import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Stats } from './stats/stats';

export default function App() {
  const [user, setUser] = React.useState(null);
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
          <nav className="container">
            <NavLink to="/stats">Stats</NavLink>
            <NavLink to="">Play</NavLink>
            <NavLink className="profile-link" to="/login">
              <img
                src="/default_account.png"
                alt="Profile image"
              />
              <span>{user || 'Log in'}</span>
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Play user={user} />} exact />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/stats' element={<Stats user={user} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <div className="container footer-content">
            <p>Benjamin Meyers CS 260 Startup - <a href="https://github.com/benmeyer86/startup">Github link</a></p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Page not found</main>;
}