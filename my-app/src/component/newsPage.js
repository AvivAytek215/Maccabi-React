import React, { useState, useEffect } from 'react';
import LoadingSpinner from './Loading';
import './article.css';
import { Link,useNavigate } from 'react-router-dom';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
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
  const handleClick=(article)=>{
    navigate(`/Articles/${article._id}`,{state:{article}});
  };

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
      <div className="articles-container">
        <h1 className="articles-title">Latest News</h1>
        <div className="articles-grid">
          {articles.map((article) => (
            <article key={article._id} className="article-card">
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
                <p className="article-preview">{article.body?.substring(0, 150)}...</p>
                <button className="read-more-btn" onClick={handleClick(article)}>Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
export default NewsPage;