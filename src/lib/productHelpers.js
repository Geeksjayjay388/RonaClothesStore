const CURTAIN_REGEX = /\bcurtains?\b/i;

export const isCurtainProduct = (product) => {
  if (!product) return false;

  const name = typeof product.name === "string" ? product.name : "";
  const category = typeof product.category === "string" ? product.category : "";

  return CURTAIN_REGEX.test(name) || CURTAIN_REGEX.test(category);
};
