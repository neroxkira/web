import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Gemini from 'gemini-ai';
import { SendIcon, CancelIcon } from './icons';
import '../styles/Chatai.css';
import { formatCode } from '../utils/codeFormatter';

const LoadingIndicator = () => (
  <div className="thinking">
    <div className="thinking-dot" style={{ animationDelay: "0s" }}/>
    <div className="thinking-dot" style={{ animationDelay: "0.2s" }}/>
    <div className="thinking-dot" style={{ animationDelay: "0.4s" }}/>
  </div>
);

const ImageIcon = () => (
  <svg className="image-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" strokeWidth="2"/>
  </svg>
);

const ScrollButton = ({ onClick, isVisible }) => (
  <button 
    className={`scroll-bottom-btn ${isVisible ? 'visible' : ''}`}
    onClick={onClick}
    title="Scroll to bottom"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M7 13L12 18L17 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 6L12 11L17 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const geminiRef = useRef(null);
  const chatRef = useRef(null);
  const abortController = useRef(null);
  const inputRef = useRef(null);

  const API_KEY = 'AIzaSyDn5B_9aWSZ7I-vp-9_Ybqtl_Ba0yuSgRM';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!geminiRef.current) {
      const boundFetch = fetch.bind(window);
      geminiRef.current = new Gemini(API_KEY, { 
        fetch: boundFetch,
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      });
    }
    chatRef.current = geminiRef.current.createChat();
  }, []);

  useEffect(() => {
    const hideKeyboard = () => {
      if (window.innerWidth <= 768) {
        document.activeElement?.blur();
      }
    };

    // Add event listener to hide keyboard when clicking outside input
    document.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLInputElement)) {
        hideKeyboard();
      }
    });

    // Prevent elastic scroll on iOS
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('click', hideKeyboard);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && inputRef.current) {
        inputRef.current.blur();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Fix iOS viewport height
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    // Fix iOS input focus
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.style.cursor = 'pointer';
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    const handleResize = () => {
      if (isIOS) {
        // Fix iOS height issues
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        // Force scroll to prevent stutter
        window.scrollTo(0, 0);
      }
      
      if (isAndroid) {
        // Fix Android keyboard issues
        setTimeout(() => {
          window.scrollTo(0, 0);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isAndroid) {
      const detectKeyboard = () => {
        const isKeyboardVisible = window.visualViewport.height < window.innerHeight;
        document.body.classList.toggle('keyboard-visible', isKeyboardVisible);
        
        if (isKeyboardVisible) {
          setTimeout(() => {
            window.scrollTo(0, 0);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      };

      window.visualViewport?.addEventListener('resize', detectKeyboard);
      return () => window.visualViewport?.removeEventListener('resize', detectKeyboard);
    }
  }, []);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      const handleKeyboard = () => {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        const isKeyboardVisible = keyboardHeight > 0;
        
        requestAnimationFrame(() => {
          document.body.classList.toggle('keyboard-visible', isKeyboardVisible);
          
          if (isKeyboardVisible) {
            document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            inputRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
          }
        });
      };

      window.visualViewport?.addEventListener('resize', handleKeyboard);
      window.visualViewport?.addEventListener('scroll', handleKeyboard);

      return () => {
        window.visualViewport?.removeEventListener('resize', handleKeyboard);
        window.visualViewport?.removeEventListener('scroll', handleKeyboard);
      };
    }
  }, []);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const extractBase64FromDataUrl = (dataUrl) => {
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid image data');
    }
    return base64Data;
  };

  const getPromptTemplate = (input, isImage = false) => {
    const basePrompt = "Kamu adalah Nerox AI, asisten virtual cerdas yang sangat membantu, ramah, dan profesional. Tugas utamamu adalah memberikan jawaban yang akurat, relevan, dan mudah dipahami. Selalu gunakan Bahasa Indonesia yang sopan, dan juga gaul, selalu jawab dengan jawaban yang tidak terlalu panjang jika pertanyaannya hanya sepele, tapi jika pertanyaannya menurut kamu detail, kamu jawab detail juga. Dan semisal user berganti suasana kamu juga wajib mengikuti suasana, apapun ceritanya jangan bilang gabisa, kasi referensi yang jelas jika gabisa";
    
    if (isImage) {
      return `${basePrompt}Tolong analisis gambar ini dan jelaskan: ${input || "Apa yang kamu lihat dalam gambar ini?"}`;
    }
    
    return `${basePrompt}${input}`;
  };

  const MessageContent = ({ content }) => {
    return (
      <div 
        className="message-content"
        dangerouslySetInnerHTML={{ __html: formatCode(content) }}
      />
    );
  };

  const typeMessage = (text, messageIndex) => {
    let isCancelled = false;
    const chunkSize = 5; 
    let currentIndex = 0;

    const type = () => {
      if (isCancelled) return;

      if (currentIndex < text.length) {
        currentIndex += chunkSize;

        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, content: text.slice(0, currentIndex) }
            : msg
        ));

        setTimeout(type, 10);
      } else {
        setIsResponding(false);
      }
    };

    type();
    return () => { isCancelled = true; };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        e.target.value = '';
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({ file, previewUrl });
    }
  };

  const cancelImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelResponse = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setIsResponding(false);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading || isResponding) {
        handleSubmit(e);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(true);
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => setIsTyping(false), 1000);
  };

  const handleInputFocus = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        inputRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
      });
    } else if (isAndroid) {
      requestAnimationFrame(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const isMobile = window.innerWidth <= 768;
    const shouldRefocus = isMobile && document.activeElement === inputRef.current;

    if (isResponding) {
      cancelResponse();
      return;
    }
    if (!input.trim() && !selectedImage) return;

    try {
      setIsResponding(true);
      abortController.current = new AbortController();

      const userMessage = {
        role: 'user',
        content: input,
        image: selectedImage?.previewUrl,
        sender: 'You'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setSelectedImage(null); // Clear image immediately after sending
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsLoading(true);

      let response;

      if (selectedImage?.file) {
        const imageData = await fileToBase64(selectedImage.file);
        const base64Data = extractBase64FromDataUrl(imageData);
        
        const result = await geminiRef.current.ask({
          role: "user",
          parts: [
            { text: getPromptTemplate(input, true) },
            {
              inline_data: {
                mime_type: selectedImage.file.type,
                data: base64Data
              }
            }
          ]
        });
        response = result;
      } else {
        response = await chatRef.current.ask(getPromptTemplate(input));
      }

      const formattedResponse = formatCode(response);
      setIsLoading(false);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        sender: 'Nerox AI'
      }]);

      const stopTyping = typeMessage(formattedResponse, messages.length + 1);

      // Handle cancellation
      abortController.current.signal.addEventListener('abort', () => {
        stopTyping();
        setIsResponding(false);
      });

      if (shouldRefocus) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Response cancelled');
        return;
      }
      console.error("Error:", error);
      setIsLoading(false);
      setIsResponding(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message || 'Something went wrong.'}`
      }]);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const bottomThreshold = scrollHeight - clientHeight - 100;
    setShowScrollButton(scrollTop < bottomThreshold);
  };

  const Message = ({ message }) => (
    <motion.div
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={`message ${message.role}`}
    >
      {message.image && (
        <img 
          src={message.image} 
          alt="Uploaded content"
          className="uploaded-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <div className="message-header">
        <span className="message-role">{message.role === 'user' ? 'You' : 'Nerox AI'}</span>
      </div>
      <MessageContent content={message.content || ''} />
    </motion.div>
  );

  return (
    <motion.div className={`chat-container ${isTyping ? 'is-typing' : ''}`}>
      <div className="chat-messages" onScroll={handleScroll}>
        {messages.length === 0 ? (
          <motion.div 
            className="welcome-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Chat AI Assistant</h1>
            <p>How can I help you today?</p>
          </motion.div>
        ) : (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        )}
        {isLoading && (
          <div className="message assistant typing">
            <div className="message-content">
              Thinking<LoadingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ScrollButton 
        onClick={scrollToBottom}
        isVisible={showScrollButton}
      />

      <form onSubmit={handleSubmit} className="chat-input-container">
        <div className="chat-controls">
          <div className="image-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="image-input"
              title="Upload image"
            />
            <ImageIcon />
          </div>
          {selectedImage && (
            <div className="image-preview-container">
              <img 
                src={selectedImage.previewUrl} 
                alt="Preview" 
                className="image-preview"
              />
              <button 
                type="button" 
                className="cancel-image"
                onClick={cancelImage}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onClick={() => inputRef.current?.focus()}
            placeholder="Type your message here..."
            className="chat-input"
            disabled={isLoading && !isResponding}
            enterKeyHint="send"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button 
            type="submit" 
            className={`chat-submit ${isResponding ? 'cancel' : ''}`}
            disabled={isLoading && !isResponding && !input.trim() && !selectedImage}
            title={isResponding ? 'Cancel' : 'Send message'}
          >
            {isResponding ? <CancelIcon /> : <SendIcon />}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatAI;
