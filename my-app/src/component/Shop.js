import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';
import './Shop.css';
import Cart from './Cart';
import ProductSquare from './ShopProducts';
import HamburgerBar from './HamburgerBar';
import Loading from './Loading';

const categories = [
    { id: 1, name: 'Kits' ,
         items:[
            { name: 'HOME KIT', 
                subItems: ['MEN KIT', 'WOMEN KIT', 'KIDS KIT']},
            { name: 'AWAY KIT', 
                subItems: ['MEN KIT', 'WOMEN KIT', 'KIDS KIT']},
            { name: 'GOALKEEPER KIT',
                subItems:['MEN KIT', 'WOMEN KIT', 'KIDS KIT']}
         ]
    },
    { id: 2, name: 'Training', 
        items:[
            { name: 'T-SHIRTS', 
                subItems: ['MEN TRAINING T-SHIRTS', 'WOMEN TRAINING T-SHIRTS', 'KIDS TRAINING T-SHIRTS']},
            { name: 'SHORTS', 
                subItems: ['MEN TRAINING SHORTS', 'WOMEN TRAINING SHORTS', 'KIDS TRAINING SHORTS']},
            { name:'JACKETS', 
                subItems: ['MEN JACKETS', 'WOMEN JACKETS', 'KIDS JACKETS']},
            { name: 'TRACKSUITS', 
                subItems: ['MEN TRACKSUITS', 'WOMEN TRACKSUITS', 'KIDS TRACKSUITS']},
          ]
    },
    { id: 3, name: 'Apparel', 
        items:[
            { name: 'HOODIES', 
                subItems: ['MEN HOODIES', 'WOMEN HOODIES', 'KIDS HOODIES']},
            { name: 'T-SHIRTS', 
                subItems: ['MEN T-SHIRTS', 'WOMEN T-SHIRTS', 'KIDS T-SHIRTS']},
            { name: 'TRACKSUITS', 
                subItems: ['MEN TRACKSUITS', 'WOMEN TRACKSUITS', 'KIDS TRACKSUITS']},
         ]
    },
    { id: 4, name: 'Gifts & Accessories' , 
        items:[
            { name: 'BACKPACKS',
                subItems: ['SCHOOL BACKPACKS', 'SACKBAG']},
            { name: 'SOCKS',
                subItems: ['GAME SOCKS','DESIGNED SOCKS']},
            { name: 'HATS',
                subItems: ['BEANIES', 'BASEBALL CAP']},
            { name: 'SCARVES',
                subItems: ['FAN SCARF', 'DESIGNED SCARF']},
            { name: 'SOCCER BALLS',
                subItems: ['SOCCER BALLS']},
        ]
    },
];

// Main shop component handling product display, cart management, and user interactions
const Shop = ({ isLoggedIn, user, onLogout }) => {
    // Refs and routing hooks
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract cart data from location state
    const { cartItems: initialCartItems, quantity, items: receivedCartItems } = location.state || {};

    // State management for UI elements
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hasCategorySelected, setHasCategorySelected] = useState(false);

    // State management for shop data
    const [itemsInStore, setItemsInStore] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Cart quantity calculation helper
    const calculateTotalQuantity = (items) => {
        return items ? items.reduce((total, item) => total + (item.quantity || 0), 0) : 0;
    };

    // Initialize cart state
    const [cartItemsState, setCartItemsState] = useState(() => {
        return initialCartItems || receivedCartItems;
    });
    const [cartCount, setCartCount] = useState(calculateTotalQuantity(cartItemsState));

    // Menu toggle handlers
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenuOnClickOutside = (e) => {
        if (e.target.className === 'menu-overlay') {
            setIsMenuOpen(false);
        }
    };

    // Category interaction handlers
    const handleCategoryHover = (categoryId) => {
        setHoveredCategory(categoryId);
    };

    // Navigation handlers
    const handleLogoClicked = () => navigate('/');
    const handleLoginClick = () => navigate('/Login');
    const handleSignUpClick = () => navigate('/signup');
    const handleAccountClick = () => navigate('/account', { state: { user } });
    
    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    // Product filtering by category
    const handleSubCategoryClick = (categoryName, subCategoryName) => {
        setHasCategorySelected(true);
        const filteredItems = itemsInStore.filter(
            (item) => item.category === categoryName && item.subcategory === subCategoryName
        );
        if (filteredItems.length === 0) {
            setErrorMessage('Sorry, products in this category are not available right now...');
            setDisplayedItems([]);
        } else {
            setDisplayedItems(filteredItems);
            setErrorMessage('');
        }
        setHoveredCategory(null);
    };

    // Cart management handlers
    const handleEmptyCart = () => {
        setCartItemsState([]);
        setCartCount(0);
    };

    const handleCartClick = () => {
        setIsCartOpen((prevState) => !prevState);
    };

    const closeCartModal = () => {
        setIsCartOpen(false);
    };

    // Update cart items and count
    const updateCartItems = (updatedItems) => {
        setCartItemsState(updatedItems);
        setCartCount(calculateTotalQuantity(updatedItems));
    };

    // Effect for handling cart updates from product page
    useEffect(() => {
        const handleAddToCartItems = () => {
            if (quantity) {
                setCartItemsState(initialCartItems);
                setIsCartOpen(true);
            }
        };
        handleAddToCartItems();
    }, []);

    // Effect for fetching shop items
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/items/getAllItems');
                setItemsInStore(response.data);
            } catch (err) {
                console.error('Failed to fetch items');
                setErrorMessage('Error fetching items. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    // Effect for handling category hover behavior
    useEffect(() => {
        const handleMouseLeave = (e) => {
            const header = document.querySelector('.shop header');
            const dropdown = dropdownRef.current;

            if (header && dropdown && !header.contains(e.target) && !dropdown.contains(e.target)) {
                setHoveredCategory(null);
            }
        };

        document.addEventListener('mousemove', handleMouseLeave);
        return () => {
            document.removeEventListener('mousemove', handleMouseLeave);
        };
    }, [dropdownRef]);

    // Loading state
    if (loading) {
        return <div><Loading/></div>;
    }
    
    return (
        <div className="shop">
            <header>
                <div className="left-side">
                    <HamburgerBar />
                </div>
                <div className="logos">
                    <img className="img1" src={"/Photos/sponsor.png"} alt="Sponsor Logo" />
                    <img className="img2" src={"/Photos/Maccabi React.png"} alt="Team Logo" />
                </div>
                <div className="categories-select">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="category-header"
                            onMouseEnter={() => handleCategoryHover(category.id)}
                        >
                            <button className="category-name">{category.name}</button>
                        </div>
                    ))}
                </div>
                {isLoggedIn ? (
                    <div className="user-icon-wrapper" ref={dropdownRef}>
                        <img 
                            src={`${process.env.PUBLIC_URL}/Photos/user-icon.png`} 
                            alt="User Icon" 
                            className="user-icon" 
                            onClick={toggleDropdown} 
                            title="User Profile"
                        />
                        {dropdownVisible && (
                            <div className="user-dropdown">
                                <p>Hello, {user.Username}</p>
                                <button onClick={handleAccountClick}>Account</button>
                                <button onClick={onLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <button className="login-button" onClick={handleLoginClick}>
                            Login
                        </button>
                        <button className="signup-button" onClick={handleSignUpClick}>
                            Sign Up
                        </button>
                    </div>
                )}
                <div className="cart">
                    <img
                        className="img3"
                        src={'/Photos/Cart.png'}
                        alt="Cart Logo"
                        onClick={handleCartClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <div className="cart-counter">{cartCount}</div>
                </div>
            </header>
    
            {isCartOpen && (
                <Cart 
                    items={cartItemsState} 
                    onClose={closeCartModal} 
                    onEmptyCart={handleEmptyCart} 
                    updateCartItems={updateCartItems} 
                />
            )}
    
            {isMenuOpen && (
                <div className="menu-overlay" onClick={closeMenuOnClickOutside}>
                    <div className="slide-menu">
                        <button className="close-menu" onClick={toggleMenu}>
                            &times;
                        </button>
                        <nav className="menu-links">
                            <Link to="/tickets" onClick={toggleMenu}>Tickets</Link>
                            <Link to="/Shop" onClick={toggleMenu}>Shop</Link>
                        </nav>
                    </div>
                </div>
            )}
    
            {hoveredCategory && (
                <div className="dropdown-menu" ref={dropdownRef}>
                    {categories.find((cat) => cat.id === hoveredCategory)?.items.map((item, index) => (
                        <div key={index} className="subcategory" style={{ cursor: 'default' }}>
                            {item.name}
                            <div className="sub-subcategories">
                                {item.subItems.map((subItem, subIndex) => (
                                    <div
                                        key={subIndex}
                                        className="sub-subcategory"
                                        onClick={() => handleSubCategoryClick(item.name, subItem)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {subItem}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
    
            {!hasCategorySelected && (
                <div className="shop-display-message">
                    <img className="shop-image" src={'/Photos/online-store.png'} alt="online shop" />
                    <h1 className="welcome-message">Hello and welcome to our shop, hope you will enjoy our staff!</h1>
                </div>
            )}
    
            {errorMessage ? (
                <div className="error-container">
                    <img className="error-image" src={'/Photos/error.png'} alt="Error" />
                    <h1 className="error">{errorMessage}</h1>
                </div>
            ) : (
                <div className="products-grid">
                    {displayedItems.map((item) => (
                        <ProductSquare key={item._id} item={item} cartItems={cartItemsState} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;