const express = require('express');
    const cors = require('cors');
    const sqlite3 = require('sqlite3').verbose();
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    const db = new sqlite3.Database(':memory:');

    db.serialize(() => {
      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE blogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          likes INTEGER DEFAULT 0,
          dislikes INTEGER DEFAULT 0,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      db.run(`
        CREATE TABLE comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          blog_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          comment TEXT NOT NULL,
          FOREIGN KEY (blog_id) REFERENCES blogs (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
    });

    const authenticateToken = (req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1];
      if (token == null) return res.sendStatus(401);

      jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    };

    app.post('/api/register', (req, res) => {
      const { username, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);

      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({ message: 'User registered successfully' });
        }
      });
    });

    app.post('/api/login', (req, res) => {
      const { username, password } = req.body;

      db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (user && bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
          res.json({ token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    });

    app.get('/api/blogs', (req, res) => {
      db.all('SELECT * FROM blogs', (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
      });
    });

    app.post('/api/blogs', authenticateToken, (req, res) => {
      const { title, content } = req.body;
      const user_id = req.user.id;

      db.run('INSERT INTO blogs (user_id, title, content) VALUES (?, ?, ?)', [user_id, title, content], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({ id: this.lastID });
        }
      });
    });

    app.put('/api/blogs/:id', authenticateToken, (req, res) => {
      const { id } = req.params;
      const { content } = req.body;
      const user_id = req.user.id;

      db.get('SELECT * FROM blogs WHERE id = ?', [id], (err, blog) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (blog && blog.user_id === user_id) {
          db.run('UPDATE blogs SET content = ? WHERE id = ?', [content, id], function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json({ message: 'Blog updated successfully' });
            }
          });
        } else {
          res.status(403).json({ error: 'Unauthorized' });
        }
      });
    });

    app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
      const { id } = req.params;
      const user_id = req.user.id;

      db.get('SELECT * FROM blogs WHERE id = ?', [id], (err, blog) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (blog && blog.user_id === user_id) {
          db.run('DELETE FROM blogs WHERE id = ?', [id], function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json({ message: 'Blog deleted successfully' });
            }
          });
        } else {
          res.status(403).json({ error: 'Unauthorized' });
        }
      });
    });

    app.post('/api/blogs/:id/like', authenticateToken, (req, res) => {
      const { id } = req.params;

      db.run('UPDATE blogs SET likes = likes + 1 WHERE id = ?', [id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Blog liked successfully' });
        }
      });
    });

    app.post('/api/blogs/:id/dislike', authenticateToken, (req, res) => {
      const { id } = req.params;

      db.run('UPDATE blogs SET dislikes = dislikes + 1 WHERE id = ?', [id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Blog disliked successfully' });
        }
      });
    });

    app.post('/api/blogs/:id/comments', authenticateToken, (req, res) => {
      const { id } = req.params;
      const { comment } = req.body;
      const user_id = req.user.id;

      db.run('INSERT INTO comments (blog_id, user_id, comment) VALUES (?, ?, ?)', [id, user_id, comment], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Comment added successfully' });
        }
      });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
