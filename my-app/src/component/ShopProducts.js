import React, { useState } from 'react';
import './ShopProducts.css';
import { useNavigate } from 'react-router';

const ProductSquare = ({ item }) => {
    const navigate = useNavigate();  // Initialize useNavigate for navigation

    const handleViewProduct = () => {
        const trimedName = item.name.trim();
        navigate(`/product/${trimedName}`, { state: { item } });
    };

return (
        <div 
            className="square" 
            onClick={handleViewProduct} 
            style={{ cursor: "pointer" }}>
            <img src={item.image} alt={item.name} />
            <div className="square-text">
                <div className="price">₪{item.price}</div>
                <div className="description">{item.description}</div>
            </div>
        </div>
    );
};

export default ProductSquare;



