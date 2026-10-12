import { dashboardApi } from '../api/dashboardApi';

export const analyticsService = {
  dashboard: dashboardApi.dashboard,
  classAnalytics: dashboardApi.classAnalytics,
  studentAnalytics: dashboardApi.studentAnalytics,
};
