// api/endpoints.ts

export const ENDPOINTS = {
  LOCATION: '/location',
  CATEGORIES: '/assetCtg',
  TYPES: '/assetTypes',
  ASSETS: '/asset',
  USER: '/user', //karyawan 
  RENTAL_CUSTOMER: '/rentalCustomer', // done and dusted
  ASSET_STOCK:'/assetStock',
  ASSET_USE:"/assetBorrow",
  ASSET_MAINTENANCE:"/assetMaintenance",
  ASSET_RENTAL:"/assetRental",
  AUTH_LOGIN:"/auth/login",
  AUTH_LOGOUT:"/auth/logout",
  ASSET_LOGS:"/assetLogs",
  DIVISI:"/divisi", // new
  STATISTIC:'/statistic/getDashboardSummary',
  CTGRANK:'/statistic/rankCtgByStock',
  GET5LOGS:'/statistic/get5LatestLogs',
  RENTAL_SUMMARY:'/statistic/rentalSummary',
  BORROW_SUMMARY:'/statistic/BorrowSummary',
  
};

