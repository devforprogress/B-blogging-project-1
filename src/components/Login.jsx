import React, { useState } from 'react';
    import axios from 'axios';

    function Login() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/api/login', { username, password });
          localStorage.setItem('token', response.data.token);
          alert('Login successful!');
          window.location.href = '/';
        } catch (error) {
          setError('Error logging in. Please try again.');
        }
      };

      return (
        <div className="container">
          <h1 className="header">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit">Login</button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      );
    }

    export default Login;
