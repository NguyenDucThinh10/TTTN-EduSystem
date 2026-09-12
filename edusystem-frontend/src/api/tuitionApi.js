import axiosClient from './axiosClient';

export const getAdminTuitionSummaries = () => axiosClient.get('/api/admin/tuitions');

export const recordAdminPayment = (payload) => axiosClient.post('/api/admin/tuitions/payments', payload);

export const confirmTuitionPayment = (paymentId) => axiosClient.post(`/api/admin/tuitions/payments/${paymentId}/confirm`);

export const rejectTuitionPayment = (paymentId) => axiosClient.post(`/api/admin/tuitions/payments/${paymentId}/reject`);

export const deleteTuitionPayment = (paymentId) => axiosClient.delete(`/api/admin/tuitions/payments/${paymentId}`);

export const getMyTuitionSummary = () => axiosClient.get('/api/student/tuitions/my');

export const createTuitionPaymentRequest = (payload) => axiosClient.post('/api/student/tuitions/payments', payload);
