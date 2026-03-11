import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Try to load cart from local storage on initial render
        const savedCart = localStorage.getItem("rona_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("rona_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, size = "M", color = "Default") => {
        setCartItems((prevItems) => {
            // Check if item with exact same id, size, and color exists
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && item.size === size && item.color === color
            );

            if (existingItemIndex > -1) {
                // Item exists, increment quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                // Item does not exist, add it
                // Convert price string like "$29.99" to number if necessary, or just rely on product.price being a number
                const priceNum = typeof product.price === 'string'
                    ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
                    : product.price;

                return [...prevItems, { ...product, price: priceNum, quantity: 1, size, color }];
            }
        });

        toast.success(`Added to Cart: ${product.name}`, {
            style: {
                borderRadius: '100px',
                background: '#111827', // text-gray-900
                color: '#fff',
                fontWeight: 'bold',
                padding: '16px 24px',
                fontSize: '14px',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#111827',
            },
        });
    };

    const updateQuantity = (id, delta, size, color) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id && item.size === size && item.color === color) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id, size, color) => {
        setCartItems(cartItems.filter(item => !(item.id === id && item.size === size && item.color === color)));
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
