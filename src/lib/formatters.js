/**
 * Formats a price in Kenyan Shillings (KES)
 * @param {number|string} price - The price
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericPrice);
};
