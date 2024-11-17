// Component for displaying detailed product information and handling cart interactions
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductPage.css';
import CustomAlert from './CustomAlert';

const ProductPage = () => {
    // Navigation and routing hooks
    const location = useLocation();
    const navigate = useNavigate();

    // Extract product and cart data from location state
    const { item, cartItems: initialCartItems } = location.state || {};

    // State management
    const [cartItems, setCartItems] = useState(initialCartItems || []); // Cart items state
    const [counter, setCounter] = useState(1);                          // Quantity counter
    const [showAlert, setShowAlert] = useState(false);                 // Alert visibility
    const [alertMessage, setAlertMessage] = useState('');              // Alert message content
    const [showMessage, setShowMessage] = useState(false);             // Success message visibility
    const [selectedSize, setSelectedSize] = useState(null);            // Selected product size

    // Handle adding items to cart
    const handleAddToCart = (item, quantity) => {
        // Validate size selection
        if (!selectedSize) {
            setAlertMessage("Please select a size before adding to cart.");
            setShowAlert(true);
            return;
        }

        // Update cart items with new item or update quantity of existing item
        setCartItems(prevCartItems => {
            // Check if item with same ID and size exists
            const existingItem = prevCartItems.find((i) => 
                i._id === item._id && i.size === selectedSize
            );

            // If item exists, update quantity; if not, add new item
            const newCartItems = existingItem
                ? prevCartItems.map((i) =>
                    i._id === item._id && i.size === selectedSize
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                )
                : [...prevCartItems, { ...item, quantity, size: selectedSize }];  

            return newCartItems;
        });
    
        setShowMessage(true); // Show success message
    };

    // Handle navigation after adding item to cart
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
                // Navigate back to shop with updated cart state
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

    // Quantity counter handlers
    const handlePlus = () => setCounter(prevCounter => prevCounter + 1);
    
    const handleMinus = () => {
        if (counter > 1) setCounter(prevCounter => prevCounter - 1);
    };

    return (
        <div className="product-page">
            {/* Logo section */}
            <div className="logo-shadow-container">
                <img className="logo1" src={'/Photos/Maccabi React.png'} alt="Logo 1"/>
                <img className="logo2" src={'/Photos/sponsor.png'} alt="Logo 2"/>
            </div>

            {/* Product details section */}
            {item ? (
                <div className="product-details">
                    <h1 className="product-name">{item.name}</h1>
                    <img className="product-image" src={item.image} alt={item.name} />
                    <p className="product-description">{item.description}</p>
                    <p className="product-price">₪{item.price}</p>

                    {/* Size selection */}
                    <div className="size-options">
                        <div className="size-line">
                            {item.size && item.size.map((sizeOption, index) => (
                                <span 
                                    key={index} 
                                    className={`size-item ${selectedSize === sizeOption ? 'selected' : ''}`} 
                                    onClick={() => setSelectedSize(sizeOption)}
                                >
                                    {sizeOption}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions section (quantity and add to cart) */}
                    <div className="actions">
                        <div className="counter">
                            <button className="counter-btn" onClick={handleMinus}>-</button>
                            <span className="counter-value">{counter}</span>
                            <button className="counter-btn" onClick={handlePlus}>+</button>
                        </div>
                        <button 
                            className="add-to-cart-btn" 
                            onClick={() => handleAddToCart(item, counter)}
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            ) : (
                <p className="not-found-message">Product not found</p>
            )}

            {/* Support message */}
            <p className='support-message'>Thank You For Supporting Our Shop 😁</p>

            {/* Alert components */}
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