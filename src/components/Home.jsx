import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    function Home() {
      const [blogs, setBlogs] = useState([]);

      useEffect(() => {
        axios.get('/api/blogs')
          .then(response => {
            setBlogs(response.data);
          })
          .catch(error => {
            console.error('Error fetching blogs:', error);
          });
      }, []);

      return (
        <div className="container">
          <h1 className="header">Blogging Website</h1>
          <ul className="blog-list">
            {blogs.map(blog => (
              <li key={blog.id}>
                <h2><a href={`/blog/${blog.id}`}>{blog.title}</a></h2>
                <p>{blog.content.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default Home;
