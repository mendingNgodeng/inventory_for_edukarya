import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import LocationPage from '../features/locations/pages/locationPage';
import AssetTypePage from '../features/AssetType/pages/Page';
import AssetCategoryPage from '../features/assetCategories/pages/Page';
import User from '../features/user/pages/Page';
import Asset from '../features/Assets/pages/Page';
import AssetStock from '../features/AssetsStock/pages/Page';
import Useassets from '../features/UseAssets/Page';




export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
       {
        path: '/BorrowUseAssets',
        element: <Useassets />,
      },
      {
        path: '/locations',
        element: <LocationPage />,
      },
      {
        path: '/asset-categories',
        element: <AssetCategoryPage />,
      },
       {
        path: '/asset-types',
        element: <AssetTypePage />,
      },
        {
        path: '/user-karyawan',
        element: <User />,
      },
       {
        path: '/asset',
        element: <Asset />,
      },
      {
        path: '/asset-stock',
        element: <AssetStock />,
      },
    ],
  },
]);