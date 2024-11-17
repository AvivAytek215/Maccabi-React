// Component for displaying detailed view of a news article
import React from 'react';
import {useLocation } from 'react-router-dom';
import './article.css';

const ArticleDetail = () => {
    // Get article data from router state
    const location = useLocation();
    const {article} = location.state || {};

    // Show error message if no article data is available
    if (!article) {
        return <div className="error-message">Article not found</div>;
    }

    // Helper function to construct image path using PUBLIC_URL
    const getImagePath = (imagePath) => {
        return `${process.env.PUBLIC_URL}/${imagePath}`;
    };

    return (
        <article className="article-detail-container">
            {/* Article Header Section - Title and Meta Information */}
            <div className="article-header">
                <h1 className="article-headline">{article.headline}</h1>
                <div className="article-meta">
                    <span className="article-author">By {article.reporter}</span>
                    <span className="article-date">{article.date}</span>
                </div>
            </div>
    
            {/* Article Image Section with Fallback Handling */}
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
    
            {/* Article Body Content */}
            <div className="article-content">
                <p>{article.body}</p>
            </div>

            {/* Social Media Sharing Section */}
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