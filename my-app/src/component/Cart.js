import React from 'react';
import './Cart.css';

const Cart = ({ items, onClose, onEmptyCart  }) => {
  // Calculate total quantity and total price 
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="close-modal" onClick={onClose}>
          &times; {/* Close icon */}
        </button>
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <p>No items in the cart.</p>
        ) : (
          <table>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className='cart-row'>
                  <td className="cart-item-image">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </td>
                  <td className="cart-item-name">{item.name}</td>
                  <td className="cart-item-quantity">{item.quantity}</td>
                </tr>
              ))}
            <tr className='total-items'>
                <td className='total-quantity-in-cart' colSpan="3">
                    The cart contains {totalQuantity} items | {totalPrice}₪ 
                </td>
            </tr>
            </tbody>
          </table>
        )}
        <div className='cart-buttons-container'>
          <button className="Payment" onClick={onClose}>
            Payment
          </button>
          <button className="empty-cart" onClick={onEmptyCart}>
            Empty Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
