import React, { useState } from 'react';
import './ShopProducts.css';

const ProductSquare = ({ item, onAddToCart }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [counter,setCounter] = useState(1);

    // Function to handle adding item to cart and showing the shadow message
    const handleAddToCart = (item) => {
        onAddToCart(item, counter);
        setShowMessage(true);
        
        // Hide the message after 0.5 seconds (500ms)
        setTimeout(() => {
            setShowMessage(false);
        }, 1000);
    };

    const handlePlus = () => {
        setCounter(prevCounter => prevCounter + 1);
    };

    const handleMinus = () => {
        if (counter > 1) {
            setCounter(prevCounter => prevCounter - 1);
        }
    };

return (
        <div className="square">
            <img src={item.image} alt={item.name} />
            <div className="square-text">
                <div className="price">₪{item.price}</div>
                <div className="description">{item.description}</div>

                <div className="actions-container">
                    {/* Add to Cart Button */}
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                    </button>

                    {/* Counter Section */}
                    <div className="counter-container">
                        <button className="counter-btn" onClick={handleMinus}>-</button>
                        <span className="counter-value">{counter}</span>
                        <button className="counter-btn" onClick={handlePlus}>+</button>
                    </div>
                </div>
            </div>

            {/* Show shadow message when item is added to the cart */}
            {showMessage && (
                <div className="shadow-message">
                    Item added to cart
                </div>
            )}
        </div>
    );
};

export default ProductSquare;



