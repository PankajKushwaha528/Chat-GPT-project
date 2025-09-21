import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// ...existing code...

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Replace this URL with your actual backend login endpoint.
    const LOGIN_API_URL = 'https://chat-gpt-clone-x4sk.onrender.com/api/auth/login';

    try {
      // Use axios.post to send the user's credentials to the backend.
      const response = await axios.post(LOGIN_API_URL, {
        email,
        password,
      },
      {
        withCredentials:true
      });

      // Assuming a successful login returns a 200 OK status.
      // You can also check for specific data in the response body if your API sends a token or user info.
      console.log('Login successful!', response.data);
      
      // On success, navigate to the home page.
      navigate('/');
    } catch (err) {
      // Use axios's specific error handling to check for server responses.
      if (err.response) {
        // The request was made, but the server responded with an error status code (e.g., 400, 401).
        // The error message is often in err.response.data.message.
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        // The request was made, but no response was received (e.g., network error, CORS issue).
        setError('Network error. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an error.
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page page--centered">
      <section className="card auth-card">
        {/* Theme toggle moved to global header */}
        <h2 className="card__title">Welcome back</h2>
        <form className="form" onSubmit={handleLogin}>
          <label className="form__label">
            <span className="form__labelText">Email</span>
            <input className="form__input" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>

          <label className="form__label">
            <span className="form__labelText">Password</span>
            <input className="form__input" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </label>

          <button className="btn btn--primary" type="submit" disabled={loading}>{loading? 'Signing in...' : 'Sign in'}</button>
        </form>

        {error && <p className="muted" style={{color:'salmon'}}>{error}</p>}
        <p className="muted">Don't have an account? <Link to="/register">Create one</Link></p>
      </section>
    </main>
  )
}

export default Login
