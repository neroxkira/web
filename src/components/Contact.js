import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/Contact.css';

const Contact = () => {
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : [];
  });
  const [newComment, setNewComment] = useState({ name: '', message: '' });

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.message.trim()) return;

    const comment = {
      id: Date.now(),
      name: newComment.name,
      message: newComment.message,
      likes: 0,
      date: new Date().toISOString(),
    };

    setComments(prev => [comment, ...prev]);
    setNewComment({ name: '', message: '' });
  };

  const handleLike = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <motion.div 
      className="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="contact-content">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Community Comments
        </motion.h1>

        <motion.div 
          className="comments-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Your name"
              value={newComment.name}
              onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <textarea
              placeholder="Add a comment..."
              value={newComment.message}
              onChange={(e) => setNewComment(prev => ({ ...prev, message: e.target.value }))}
              required
            />
            <button type="submit" className="submit-btn">
              Post Comment
              <span className="btn-icon">→</span>
            </button>
          </form>

          <div className="comments-list">
            {comments.map(comment => (
              <motion.div
                key={comment.id}
                className="comment-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="comment-header">
                  <strong>{comment.name}</strong>
                  <span className="comment-date">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.message}</p>
                <button 
                  className="like-button"
                  onClick={() => handleLike(comment.id)}
                >
                  ❤️ {comment.likes}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
