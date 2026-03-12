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

    const whatsappNumber = "+25442424046";

    const orderOnWhatsApp = (product, size = "M", color = "Default") => {
        const message = encodeURIComponent(
            `Hello Rona Elementra, I'd like to order:\n\n` +
            `*Product:* ${product.name}\n` +
            `*Price:* ${formatPrice(product.price)}\n` +
            `*Size:* ${size}\n` +
            `*Color:* ${color}\n\n` +
            `Please let me know the next steps.`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    };

    const checkoutToWhatsApp = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = 5.00;
        const total = subtotal + shipping;

        let itemsList = cartItems.map(item =>
            `• ${item.name} (${item.size}/${item.color}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
        ).join('\n');

        const message = encodeURIComponent(
            `Hello Rona Elementra, I'd like to place an order:\n\n` +
            `${itemsList}\n\n` +
            `*Subtotal:* ${formatPrice(subtotal)}\n` +
            `*Shipping:* ${formatPrice(shipping)}\n` +
            `*Total:* ${formatPrice(total)}\n\n` +
            `Please confirm my order.`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, cartCount, orderOnWhatsApp, checkoutToWhatsApp }}>
            {children}
        </CartContext.Provider>
    );
};
