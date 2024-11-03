import React from 'react';
import { useParams } from 'react-router-dom';
import './article.css';

const ArticleDetail = () => {
  const { article } = useParams();
  if (!article) {
    return <div className="error-message">Article not found</div>;
  }

  return (
    <div className="article-detail-container">
      {/* Article Header */}
      <header className="article-header">
        <h1 className="article-title">{article.headline}</h1>
        <div className="article-meta">
          <span className="article-author">By {article.reporter}</span>
          <span className="article-date">
            {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="article-hero-image">
        <img
          src={`${process.env.PUBLIC_URL}/${article.Image}`}
          alt={article.headline}
          onError={(e) => {
            e.target.src = '/fallback-image.jpg';
            e.target.onerror = null;
          }}
        />
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="article-body">
          {article.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
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
      </div>
    </div>
  );
};

export default ArticleDetail;