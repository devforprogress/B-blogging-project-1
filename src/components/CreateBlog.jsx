import React, { useState } from 'react';
    import axios from 'axios';
    import ReactQuill from 'react-quill';
    import 'react-quill/dist/quill.snow.css';

    function CreateBlog() {
      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');
      const [error, setError] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('/api/blogs', { title, content }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Blog created successfully!');
          window.location.href = `/blog/${response.data.id}`;
        } catch (error) {
          setError('Error creating blog. Please try again.');
        }
      };

      return (
        <div className="container">
          <h1 className="header">Create Blog</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <ReactQuill
                id="content"
                value={content}
                onChange={setContent}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit">Create Blog</button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      );
    }

    export default CreateBlog;
