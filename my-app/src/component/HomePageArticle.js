import React, { useState, useEffect } from 'react';
import LoadingSpinner from './Loading';
import './HomePageArticle.css';
import { Link } from 'react-router-dom';

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
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
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <section className="articles-section">    
      <div className="carousel-container">
        <div className="link">
          <Link to="/Article">see more</Link>
        </div>
        <div className="articles-wrapper">
          <div className="articles-track">
            {articles.map((article, index) => (
              <article key={`${article._id}-${index}`} className="article-card">
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
                <div className="article-content">
                  <h3 className="article-headline">{article.headline}</h3>
                  <p className="article-author">By {article.reporter}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;