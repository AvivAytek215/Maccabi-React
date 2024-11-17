// Component for displaying a scrollable carousel of news articles on the homepage
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './Loading';
import './HomePageArticle.css';
import { Link } from 'react-router-dom';

const ArticlesSection = () => {
  // State management for articles and loading status
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles data from API on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/allreports/allreports');
        const data = await response.json();
        // Sort articles by date (newest first)
        setArticles(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Utility function to construct image paths
  const getImagePath = (imagePath) => {
    return `${process.env.PUBLIC_URL}/${imagePath}`;
  };

  // Show loading spinner while fetching data
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
        {/* Link to full articles page */}
        <div className="link">
          <Link to="/Article">see more</Link>
        </div>

        {/* Articles carousel */}
        <div className="articles-wrapper">
          <div className="articles-track">
            {/* Map through articles and create cards */}
            {articles.map((article, index) => (
              <article key={`${article._id}-${index}`} className="article-card">
                {/* Article image with fallback handling */}
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
                {/* Article content */}
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