import React, { useState } from 'react';
import './ShopProducts.css';
import { useNavigate } from 'react-router';

const ProductSquare = ({ item }) => {
    const navigate = useNavigate();  // Initialize useNavigate for navigation

    const handleViewProduct = () => {
        navigate(`/product/${item.id}`, { state: { item } });
    };

return (
        <div className="square">
            <img src={item.image} alt={item.name} />
            <div className="square-text">
                <div className="price">₪{item.price}</div>
                <div className="description">{item.description}</div>

                <div className="actions-container">
                    {/* Add to Cart Button */}
                    <button className="view-product-btn" onClick={handleViewProduct}>
                        View Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductSquare;



