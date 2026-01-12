// Email validation using regex
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Check if fields are not empty
const validateRequiredFields = (...fields) => {
  return fields.every(field => field && field.trim() !== '');
};

// Validate custom text (alphanumeric with optional - or _)
const validateCustomText = (customText) => {
  if (!customText) return true; // Optional field
  const customTextRegex = /^[a-zA-Z0-9_-]+$/;
  return customTextRegex.test(customText);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequiredFields,
  validateCustomText
};
