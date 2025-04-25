import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Projects.css';

const Projects = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="projects-header">
        <h1>Featured Projects</h1>
        <p>Discover my latest works and creative endeavors</p>
      </div>

      <motion.div 
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="project-card featured music-website"
          variants={cardVariants}
        >
          <div className="project-content">
            <div className="music-preview">
              <svg className="music-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="project-info">
              <h2>NeroxOffC Music</h2>
              <p>Your one-stop destination for the latest hits and exclusive tracks. Stream and download your favorite music anytime, anywhere.</p>
              <div className="project-stats">
                <div className="stat">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Songs</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Service</span>
                </div>
              </div>
              <div className="project-tags">
                <span className="tag">Music Streaming</span>
                <span className="tag">Downloads</span>
                <span className="tag">Web App</span>
              </div>
              <a href="https://neroxoffc.xyz" target="_blank" rel="noopener noreferrer" className="visit-btn primary-btn">
                Visit Website
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="project-card social-card github"
          variants={cardVariants}
        >
          <div className="project-content">
            <div className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </div>
            <h3>GitHub</h3>
            <p>Check out my open source projects and contributions</p>
            <div className="social-stats">
              <div className="stat">
                <span className="stat-number">20+</span>
                <span className="stat-label">Repositories</span>
              </div>
            </div>
            <a 
              href="https://github.com/neroxkira" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn github-btn"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://github.com/neroxkira', '_blank');
              }}
            >
              Follow Me
              <span className="arrow">→</span>
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="project-card social-card instagram"
          variants={cardVariants}
        >
          <div className="project-content">
            <div className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h3>Instagram</h3>
            <p>Follow my journey and daily updates</p>
            <div className="social-stats">
              <div className="stat">
                <span className="stat-number">250+</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
            <a 
              href="https://instagram.com/niorxugood" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn instagram-btn"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://instagram.com/niorxugood', '_blank');
              }}
            >
              Follow Me
              <span className="arrow">→</span>
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="project-card social-card whatsapp"
          variants={cardVariants}
        >
          <div className="project-content">
            <div className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3>WhatsApp</h3>
            <p>Contact me directly for collaborations</p>
            <div className="social-stats">
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Available</span>
              </div>
            </div>
            <a 
              href="https://wa.me/447445808356" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn whatsapp-btn"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://wa.me/447445808356', '_blank');
              }}
            >
              Message Me
              <span className="arrow">→</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Projects;
