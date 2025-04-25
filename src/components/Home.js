import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../styles/Home.css';

const Home = () => {
  const heroImageRef = useRef(null);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = heroImage.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      const rotateX = 20 * (y - 0.5);
      const rotateY = 20 * (x - 0.5);
      
      requestAnimationFrame(() => {
        heroImage.style.setProperty('--rotateX', `${rotateX}deg`);
        heroImage.style.setProperty('--rotateY', `${rotateY}deg`);
      });
    };

    const handleMouseLeave = () => {
      heroImage.style.setProperty('--rotateX', '5deg');
      heroImage.style.setProperty('--rotateY', '-15deg');
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const { left, top, width, height } = heroImage.getBoundingClientRect();
      
      const x = ((touch.clientX - left) / width) * 1.5;
      const y = ((touch.clientY - top) / height) * 1.5;
      
      const rotateX = 15 * (y - 0.5);
      const rotateY = 15 * (x - 0.5);
      
      requestAnimationFrame(() => {
        heroImage.style.setProperty('--rotateX', `${rotateX}deg`);
        heroImage.style.setProperty('--rotateY', `${rotateY}deg`);
      });
    };

    const handleTouchStart = () => {
      heroImage.classList.add('touching');
      heroImage.style.transition = 'none';
    };

    const handleTouchEnd = () => {
      heroImage.classList.remove('touching');
      heroImage.style.transition = 'transform 0.5s ease-out';
      requestAnimationFrame(() => {
        heroImage.style.setProperty('--rotateX', '15deg');
        heroImage.style.setProperty('--rotateY', '0deg');
      });
    };

    heroImage.addEventListener('mousemove', handleMouseMove);
    heroImage.addEventListener('mouseleave', handleMouseLeave);
    heroImage.addEventListener('touchmove', handleTouchMove, { passive: false });
    heroImage.addEventListener('touchstart', handleTouchStart);
    heroImage.addEventListener('touchend', handleTouchEnd);

    handleMouseLeave();

    const particles = document.createElement('div');
    particles.className = 'particles';
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--moveX', `${(Math.random() - 0.5) * 200}px`);
      particle.style.setProperty('--moveY', `${(Math.random() - 0.5) * 200}px`);
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particles.appendChild(particle);
    }
    
    document.querySelector('.home').appendChild(particles);

    return () => {
      heroImage.removeEventListener('mousemove', handleMouseMove);
      heroImage.removeEventListener('mouseleave', handleMouseLeave);
      heroImage.removeEventListener('touchmove', handleTouchMove);
      heroImage.removeEventListener('touchstart', handleTouchStart);
      heroImage.removeEventListener('touchend', handleTouchEnd);
      particles.remove();
    };
  }, []);

  return (
    <motion.div 
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="decorative-lines">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="line" 
            style={{ 
              top: `${20 * i}%`,
              animationDelay: `${i * 3}s`
            }}
          />
        ))}
      </div>
      <div className="content-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">Hi, I'm Nerox</h1>
          <p className="hero-subtitle">
            A passionate Full Stack Developer creating amazing digital experiences
          </p>
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>
        </div>
        <motion.div 
          className="hero-image"
          ref={heroImageRef}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
       <img
          src="https://files.catbox.moe/htqw9r.jpg"
          alt="Hero Character"
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            display: 'block',
            border: '2px solid lime'
          }}
        />

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
