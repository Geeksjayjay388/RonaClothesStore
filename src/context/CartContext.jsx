import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "../lib/formatters";

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

    const addToCart = (product, size = "M") => {
        setCartItems((prevItems) => {
            // Check if item with exact same id and size exists
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && item.size === size
            );

            if (existingItemIndex > -1) {
                // Item exists, increment quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                // Item does not exist, add it
                return [...prevItems, { ...product, price: priceNum, quantity: 1, size }];
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

    const updateQuantity = (id, delta, size) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id && item.size === size) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id, size) => {
        setCartItems(cartItems.filter(item => !(item.id === id && item.size === size)));
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const whatsappNumber = "+254742424046";

    const orderOnWhatsApp = (product, size = "M") => {
        const message = encodeURIComponent(
            `Hello RONA 🛍️,\n\nI'd like to order this item:\n\n` +
            `✨ *Product:* ${product.name}\n` +
            `📏 *Size:* ${size}\n` +
            `💰 *Price:* ${formatPrice(product.price)}\n\n` +
            `Please let me know how to proceed with payment and delivery. Thank you! 🙏`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    };

    const checkoutToWhatsApp = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const total = subtotal;

        let itemsList = cartItems.map(item =>
            `🛍️ *${item.name}*\n   📏 Size: ${item.size}\n   🔢 Qty: ${item.quantity}\n   💰 Price: ${formatPrice(item.price * item.quantity)}`
        ).join('\n\n');

        const message = encodeURIComponent(
            `Hello Rona ✨,\n\nI'd like to place an order for the following items:\n\n` +
            `${itemsList}\n\n` +
            `⭐ *Total Amount:* ${formatPrice(total)}\n\n` +
            `Please confirm my order and share payment details. Thank you! 🙏`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, cartCount, orderOnWhatsApp, checkoutToWhatsApp }}>
            {children}
        </CartContext.Provider>
    );
};
