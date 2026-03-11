/**
 * Formats a price in USD to Kenyan Shillings (KES)
 * @param {number|string} price - The price in USD
 * @param {boolean} convert - Whether to convert from USD to KES (default: true)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, convert = true) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Using an exchange rate of 1 USD = 130 KES
    const KES_RATE = 130;
    const finalPrice = convert ? numericPrice * KES_RATE : numericPrice;

    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(finalPrice);
};
