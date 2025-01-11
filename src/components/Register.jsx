import React, { useState } from 'react';
    import axios from 'axios';

    function Register() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post('/api/register', { username, password });
          alert('Registration successful!');
          window.location.href = '/login';
        } catch (error) {
          setError('Error registering user. Please try again.');
        }
      };

      return (
        <div className="container">
          <h1 className="header">Register</h1>
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
              <button type="submit">Register</button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      );
    }

    export default Register;
