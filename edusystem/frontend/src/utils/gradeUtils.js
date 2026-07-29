export const clampGrade = (value) => Math.min(10, Math.max(0, Number(value) || 0));
export const formatGrade = (value) => Number(value || 0).toFixed(1);
export const calculateWeightedGrade = (items = []) => items.reduce((sum, item) => sum + clampGrade(item.score) * ((Number(item.weight) || 0) / 100), 0);
