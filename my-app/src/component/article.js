import React from 'react';
import {useLocation } from 'react-router-dom';
import './article.css';

const ArticleDetail = () => {
    const location = useLocation();
  const {article} = location.state || {};
  if (!article) {
    return <div className="error-message">Article not found</div>;
  }
  const getImagePath = (imagePath) => {
    return `${process.env.PUBLIC_URL}/${imagePath}`;
  };
  return (
        <article className="article-detail-container">
          <div className="article-header">
            <h1 className="article-headline">{article.headline}</h1>
            <div className="article-meta">
              <span className="article-author">By {article.reporter}</span>
              <span className="article-date">{article.date}</span>
            </div>
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
    
          <div className="article-content">
            <p>{article.body}</p>
          </div>
        {/* Share Section */}
        <div className="article-share">
          <h3>Share this article</h3>
          <div className="share-buttons">
            <button className="share-button facebook">Facebook</button>
            <button className="share-button twitter">Twitter</button>
            <button className="share-button linkedin">LinkedIn</button>
          </div>
        </div>
      </article>
  );
};

export default ArticleDetail;