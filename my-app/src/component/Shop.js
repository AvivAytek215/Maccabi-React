import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Shop.css';
import Cart from './Cart';
import ProductSquare from './ShopProducts';
import HamburgerBar from './HamburgerBar';

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
                subItems: ['MEN T-SHIRTS', 'WOMEN T-SHIRTS', 'KIDS T-SHIRTS']},
            { name: 'PANTS AND SHORTS', 
                subItems: ['MEN PANTS AND SHORTS', 'WOMEN PANTS AND SHORTS', 'KIDS PANTS AND SHORTS']},
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
        ]
    },
];

const Shop = () => {
    const dropdownRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the hamburger menu
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [itemsInStore, setItemsInStore] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [cartItems, setCartItems] = useState([]); // State for cart items
    const [isCartOpen, setIsCartOpen] = useState(false); // State for cart modal
    const [cartCount, setCartCount] = useState(0); // State for cart item count

      // Toggle the hamburger menu's visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);  // Toggle the state between true and false for the menu
    };

      // Close the menu when clicking outside of it
    const closeMenuOnClickOutside = (e) => {
        if (e.target.className === 'menu-overlay') {
            setIsMenuOpen(false);
        }
    };

    const handleCategoryHover = (categoryId) => {
        setHoveredCategory(categoryId);
    };

    const handleSubCategoryClick = (categoryName, subCategoryName) => {
        console.log("Category:"+categoryName+" subCategory:"+subCategoryName);
        const filteredItems = itemsInStore.filter(
            (item) => item.category === categoryName && item.subcategory === subCategoryName
        );
        if (filteredItems.length === 0) {
            setErrorMessage('Sorry, products in this category are not available...');
            setDisplayedItems([]); // Clear the displayed items if nothing is found
        } else {
            setDisplayedItems(filteredItems);
            setErrorMessage(''); // Clear the error message if items are found
        }
        setHoveredCategory(null);
    };    

    const handleAddToCart = (item, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i._id === item._id);
            if (existingItem) {
                // Update the quantity of the existing item
                return prevItems.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            // Add new item to cart
            return [...prevItems, { ...item, quantity }];
        });

        setCartCount((prevCount) => prevCount + quantity); // Update the cart count
    };

    // Function to handle emptying the cart
    const handleEmptyCart = () => {
        setCartItems([]); // Clear all cart items
        setCartCount(0); // Reset the cart count
    };

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    }

    const closeCartModal = () => {
        setIsCartOpen(false);
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/items/getAllItems');
                setItemsInStore(response.data);
                setLoading(false);
            }
            catch(err) {
                console.error("failed to fetch items");
                setLoading(false);
            }
        }
        fetchItems();
    },[]);
    
    useEffect(() => {
        console.log('Items in Store:', itemsInStore); // Check fetched items
    }, [itemsInStore]);
        

    // Use effect to handle mouse leave event
    useEffect(() => {
        const handleMouseLeave = (e) => {
            const header = document.querySelector('.shop header');
            const dropdown = dropdownRef.current;

            // Check if the mouse is not in the header or the dropdown
            if (header && dropdown && !header.contains(e.target) && !dropdown.contains(e.target)) {
                setHoveredCategory(null);
            }
        };

        // Add mouse move event listener
        document.addEventListener('mousemove', handleMouseLeave);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousemove', handleMouseLeave);
        };
    }, [dropdownRef]);

    if (loading) {
        return <div>Loading...</div>;  // Display loading text while fetching data
    }

    return (
        <div className="shop">
            <header>
                <div className="left-side">
                    <HamburgerBar/>
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
                <div className="cart">
                    <img className="img3"
                     src={"/Photos/Cart.png"} 
                     alt="Cart Logo"
                     onClick={handleCartClick}
                     style={{ cursor: 'pointer' }} />
                     <div className="cart-counter">
                        {cartCount}
                    </div>
                </div>
            </header>
            {isCartOpen && (
                <Cart items={cartItems} onClose={closeCartModal} onEmptyCart={handleEmptyCart} />
            )}
            {/* Sliding Menu Overlay */}
            {isMenuOpen && (
                <div className="menu-overlay" onClick={closeMenuOnClickOutside}>
                <div className="slide-menu">
                    <button className="close-menu" onClick={toggleMenu}>
                    &times;  {/* Unicode for the close 'X' icon */}
                    </button>
                    <nav className="menu-links">
                    <Link to="/tickets" onClick={toggleMenu}>Tickets</Link>
                    <Link to="/Shop" onClick={toggleMenu}>Shop</Link>
                    </nav>
                </div>
                </div>
            )}

            <span>
                {hoveredCategory && (
                    <div className="dropdown-menu" ref={dropdownRef}>
                        {categories.find((cat) => cat.id === hoveredCategory)?.items.map((item, index) => (
                            <div key={index} className="subcategory">
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
            </span>
            <div>
            {errorMessage ? (
                <div className="error-container">
                    <img className="error-image" src={"/Photos/error.png"} alt="Error"/>
                    <h1 className="error">{errorMessage}</h1>
                </div>
                    ) : (
                <div>
                    {/* Render displayed items here */}
                    {displayedItems.map((item) => (
                        <div key={item.id}>
                            {/* Render item details */}
                        </div>
                    ))}
                </div>
                )}

            </div>
            {/* Display filtered items */}
            <div className="products-grid">
                {displayedItems.map((item) => (
                    <ProductSquare key={item._id} item={item} onAddToCart={handleAddToCart} />
                ))}
            </div>
        </div>
    );
};


export default Shop;
