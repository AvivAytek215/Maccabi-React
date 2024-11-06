import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductPage.css';
import CustomAlert from './CustomAlert';

const ProductPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, cartItems: initialCartItems } = location.state || {};
    const [cartItems, setCartItems] = useState(initialCartItems || []); // Fixed naming
    const [counter, setCounter] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);

    const handleAddToCart = (item, quantity) => {
        if (!selectedSize) {
            setAlertMessage("Please select a size before adding to cart.");
            setShowAlert(true);
            return;
        }
        setCartItems(prevCartItems => {
            const existingItem = prevCartItems.find((i) => i._id === item._id && i.size === selectedSize);
            const newCartItems = existingItem
                ? prevCartItems.map((i) =>
                    i._id === item._id && i.size === selectedSize
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                )
                : [...prevCartItems, { ...item, quantity, size: selectedSize }];  
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
                        cartItems, 
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
                    <div className="size-options">
                        <div className="size-line">
                            {item.size && item.size.map((sizeOption, index) => (
                                <span 
                                    key={index} 
                                    className={`size-item ${selectedSize === sizeOption ? 'selected' : ''}`} 
                                    onClick={() => setSelectedSize(sizeOption)}
                                >
                                    {sizeOption}{index < item.size.length - 1 }
                                </span>
                            ))}
                        </div>
                    </div>
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
            <CustomAlert
                message={alertMessage}
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
            {showMessage && (
                <div className="shadow-message">
                    Item added to cart
                </div>
            )}
        </div>
    );
};

export default ProductPage;