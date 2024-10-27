import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = ({ onAddToCart }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {};
    const [counter, setCounter] = useState(1);
    const [showMessage, setShowMessage] = useState(false);

    const handleAddToCart = () => {
        onAddToCart(item, counter);
        setShowMessage(true);
        // Use setTimeout to simulate an asynchronous operation (e.g., API call)
        setTimeout(() => {
        setShowMessage(false);
        // Navigate back to the Shop page, preserving the previous location
        navigate('/Shop'); 
    }, 1000);
  };

    const handlePlus = () => setCounter(prevCounter => prevCounter + 1);
    const handleMinus = () => {
        if (counter > 1) setCounter(prevCounter => prevCounter - 1);
    };

    return (
        <div className="product-page">
            {item ? (
                <div className="product-details">
                    <h1 className="product-name">{item.name}</h1>
                    <img className="product-image" src={item.image} alt={item.name} />
                    <p className="product-description">{item.description}</p>
                    <p className="product-price">₪{item.price}</p>

                    <div className="actions">
                        <div className="counter">
                            <button className="counter-btn" onClick={handleMinus}>-</button>
                            <span className="counter-value">{counter}</span>
                            <button className="counter-btn" onClick={handlePlus}>+</button>
                        </div>
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            Add To Cart
                        </button>
                    </div>
                </div>
            ) : (
                <p className="not-found-message">Product not found</p>
            )}

            {showMessage && (
                <div className="shadow-message">
                    Item added to cart
                </div>
            )}
        </div>
    );
};

export default ProductPage;
