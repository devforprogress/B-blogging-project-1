import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import ReactQuill from 'react-quill';
    import 'react-quill/dist/quill.snow.css';

    function BlogDetails({ match }) {
      const [blog, setBlog] = useState(null);
      const [content, setContent] = useState('');
      const [error, setError] = useState('');
      const [isEditing, setIsEditing] = useState(false);

      useEffect(() => {
        const fetchBlog = async () => {
          try {
            const response = await axios.get(`/api/blogs/${match.params.id}`);
            setBlog(response.data);
            setContent(response.data.content);
          } catch (error) {
            setError('Error fetching blog. Please try again.');
          }
        };
        fetchBlog();
      }, [match.params.id]);

      const handleEdit = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          await axios.put(`/api/blogs/${match.params.id}`, { content }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Blog updated successfully!');
          setIsEditing(false);
        } catch (error) {
          setError('Error updating blog. Please try again.');
        }
      };

      const handleDelete = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/api/blogs/${match.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Blog deleted successfully!');
          window.location.href = '/';
        } catch (error) {
          setError('Error deleting blog. Please try again.');
        }
      };

      const handleLike = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`/api/blogs/${match.params.id}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Blog liked successfully!');
          window.location.reload();
        } catch (error) {
          setError('Error liking blog. Please try again.');
        }
      };

      const handleDislike = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`/api/blogs/${match.params.id}/dislike`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Blog disliked successfully!');
          window.location.reload();
        } catch (error) {
          setError('Error disliking blog. Please try again.');
        }
      };

      const handleComment = async (comment) => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`/api/blogs/${match.params.id}/comments`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Comment added successfully!');
          window.location.reload();
        } catch (error) {
          setError('Error adding comment. Please try again.');
        }
      };

      if (error) {
        return <p className="error">{error}</p>;
      }

      if (!blog) {
        return <p>Loading...</p>;
      }

      return (
        <div className="container">
          <h1 className="header">{blog.title}</h1>
          <div className="blog-details">
            {isEditing ? (
              <ReactQuill
                value={content}
                onChange={setContent}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            )}
            <div className="actions">
              {isEditing ? (
                <button onClick={handleEdit}>Save</button>
              ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
              )}
              <button onClick={handleDelete}>Delete</button>
              <button onClick={handleLike}>Like</button>
              <button onClick={handleDislike}>Dislike</button>
            </div>
            <div className="comments">
              <h3>Comments</h3>
              {blog.comments.map((comment, index) => (
                <p key={index}>{comment}</p>
              ))}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleComment(e.target.comment.value);
                e.target.comment.value = '';
              }}>
                <input
                  type="text"
                  name="comment"
                  placeholder="Add a comment"
                  required
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    export default BlogDetails;
