import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item , cartItems} = location.state || {};
    const [cartItem, setCartItems] = useState(cartItems || []);
    const [counter, setCounter] = useState(1);
    const [showMessage, setShowMessage] = useState(false);

    const handleAddToCart = (item, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i._id === item._id);
            if (existingItem) {
                return prevItems.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            setShowMessage(true);
            setTimeout(() => {
            setShowMessage(false);
            navigate('/Shop', {state : {quantity} });
        }, 1000);
            return [...prevItems, { ...item, quantity }];
        });
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
                        <button className="add-to-cart-btn" onClick={() => handleAddToCart(item, counter)}>
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
