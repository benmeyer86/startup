import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Stats } from './stats/stats';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
          <nav className="container">
            <p>Image will open a dropdown nav menu with JS (including login). Will be replaced by profile image when signed in</p>
            <p>temporary links:</p>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/stats">Stats</NavLink>
            <NavLink to="">Play</NavLink>
            <NavLink to="/login">
              <img
                src="/default_account.png"
                alt="Profile image"
                width="60"
                height="60"
              />
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Play />} exact />
          <Route path='/login' element={<Login />} />
          <Route path='/stats' element={<Stats />} />
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