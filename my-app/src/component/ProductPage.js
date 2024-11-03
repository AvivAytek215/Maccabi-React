import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, cartItems: initialCartItems } = location.state || {};
    const [cartItems, setCartItems] = useState(initialCartItems || []); // Fixed naming
    const [counter, setCounter] = useState(1);
    const [showMessage, setShowMessage] = useState(false);

    const handleAddToCart = (item, quantity) => {
        setCartItems(prevCartItems => {
            const existingItem = prevCartItems.find((i) => i._id === item._id);
            const newCartItems = existingItem
                ? prevCartItems.map((i) =>
                    i._id === item._id 
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                )
                : [...prevCartItems, { ...item, quantity }];
            return newCartItems;
        });

        setShowMessage(true);
    };

    // Use useEffect to handle navigation after state update
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
                navigate('/Shop', { 
                    state: { 
                        cartItems, // Now this will have the updated value
                        quantity: counter
                    } 
                });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [showMessage, cartItems, counter, navigate]);

    const handlePlus = () => setCounter(prevCounter => prevCounter + 1);
    
    const handleMinus = () => {
        if (counter > 1) setCounter(prevCounter => prevCounter - 1);
    };

    return (
        <div className="product-page">
            <div className="logo-shadow-container">
                <img className="logo1" src={'/Photos/Maccabi React.png'} alt="Logo 1"/>
                <img className="logo2" src={'/Photos/sponsor.png'} alt="Logo 2"/>
            </div>
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
            <p className='support-message'>Thank You For Supporting Our Shop 😁</p>
            {showMessage && (
                <div className="shadow-message">
                    Item added to cart
                </div>
            )}
        </div>
    );
};

export default ProductPage;