import React from 'react';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import Home from './components/Home';
    import Register from './components/Register';
    import Login from './components/Login';
    import CreateBlog from './components/CreateBlog';
    import BlogDetails from './components/BlogDetails';

    function App() {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
          </Routes>
        </Router>
      );
    }

    export default App;
