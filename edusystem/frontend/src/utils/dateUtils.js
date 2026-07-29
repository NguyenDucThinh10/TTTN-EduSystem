export const formatDate = (value) => value ? new Intl.DateTimeFormat("vi-VN").format(new Date(value)) : "-";
export const formatDateTime = (value) => value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-";
