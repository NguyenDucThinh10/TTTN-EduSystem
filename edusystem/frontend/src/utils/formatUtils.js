export const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);
export const initials = (name = "Edu LMS") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
