export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isStrongPassword = (value) => String(value).length >= 8;
export const isRequired = (value) => value !== undefined && value !== null && String(value).trim() !== "";
