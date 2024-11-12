import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ items = [], onClose, onEmptyCart, updateCartItems}) => {
  // Calculate total quantity and total price
  const totalQuantity = items.length > 0 ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const totalPrice = items.length > 0 ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
  const [message,setMessage] = useState("");
  const navigate = useNavigate();  // Initialize useNavigate for navigation
  const proceedToPayment = () => {
    if(items.length)
    {
      const string = "shop";
      const fromShop = true;
      navigate("/payment", { state: { string, items, fromShop, totalPrice } });
    }
    else{
     setMessage("Please Pick Items Before Proceeding");
    }

  };

  // Function to decrease item quantity
  const decreaseItemQuantity = (itemId) => {
    const updatedItems = items.map(item =>
      item._id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0); // Remove items with quantity 0
    updateCartItems(updatedItems);
  };

  // Function to increase item quantity
  const increaseItemQuantity = (itemId) => {
    const updatedItems = items.map(item =>
      item._id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCartItems(updatedItems);
  };

  // Function to delete item from cart
  const deleteItemFromCart = (itemId) => {
    const updatedItems = items.filter(item => item._id !== itemId);
    updateCartItems(updatedItems);
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-menu open" onClick={e => e.stopPropagation()}>
        <button className="close-cart" onClick={onClose}>
          &times;
        </button>
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <p>No items in the cart.</p>
        ) : (
          <table>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className='cart-row'>
                  <td>
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </td>
                  <td className="cart-item-name">{item.name}</td>
                  <td className="cart-item-size">
                    <div>Size:</div>
                    <div>{item.size}</div>
                  </td>
                  <td className="cart-item-controls">
                    <button className="minus-button" onClick={() => decreaseItemQuantity(item._id)}>-</button>
                    <span className="cart-item-quantity">{item.quantity}</span>
                    <button className="plus-button" onClick={() => increaseItemQuantity(item._id)}>+</button>
                  </td>
                  <td>
                    <button className="delete-button" onClick={() => deleteItemFromCart(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr className='total-items'>
                <td className='total-quantity-in-cart' colSpan="3">
                  Total: {totalQuantity} items | {totalPrice}₪
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <div className='cart-buttons-container'>
          <button className="Payment" onClick = {proceedToPayment}>
            Proceed to payment
          </button>
          <button className="empty-cart" onClick={onEmptyCart}>
            Empty Cart
          </button>
        </div>
        {!totalQuantity && (
          <div className="Error-message">
              {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;