import React, { useState, useEffect } from 'react';
import LoadingSpinner from './Loading';
import './article.css';

const ArticlesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayCount = 3;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/allreports/allreports');
        const data = await response.json();
        setArticles(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getImagePath = (imagePath) => {
    return `${process.env.PUBLIC_URL}/${imagePath}`;
  };

  const getVisibleArticles = () => {
    const visibleIndexes = [];
    const totalArticles = articles.length;
    
    for (let i = 0; i < displayCount; i++) {
      let index = (currentSlide + i) % totalArticles;
      // If we've gone past the end, loop back to the beginning
      if (index < 0) index = totalArticles + index;
      visibleIndexes.push(index);
    }
    
    return visibleIndexes.map(index => articles[index]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  const totalSlides = Math.max(0, articles.length - 1);
  const visibleArticles = getVisibleArticles();

  return (
    <section className="articles-section">
      <h2>Latest Articles</h2>
      
      <div className="carousel-container">
        <div className="articles-wrapper">
          <div className="articles-track">
            {visibleArticles.map((article, index) => (
              <article key={`${article._id}-${index}`} className="article-card">
                <div className="article-content">
                  <div className="article-text">
                    <h3>{article.headline}</h3>
                    <p className="author">By {article.reporter}</p>
                  </div>
                  <div className="article-image">
                    <img 
                      src={getImagePath(article.Image)}
                      alt={article.headline || 'Article image'}
                      onError={(e) => {
                        e.target.src = '/fallback-image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          {articles.length > displayCount && (
            <input
              type="range"
              min={0}
              max={totalSlides}
              value={currentSlide}
              onChange={(e) => setCurrentSlide(Number(e.target.value))}
              className="slider"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;