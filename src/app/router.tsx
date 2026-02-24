import { createBrowserRouter } from "react-router-dom";
import Login from "../features/login/pages/login";
import Borrowassets from "../features/borrowAssets/Page";

import ProtectedRoute from "./protectedRoute";
import Dashboardlayout from "../layouts/Dashboardlayout1";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LocationPage from "../features/locations/pages/locationPage";
import AssetTypePage from "../features/AssetType/pages/Page";
import AssetCategoryPage from "../features/assetCategories/pages/Page";
import User from "../features/user/pages/Page";
import Asset from "../features/Assets/pages/Page";
import AssetStock from "../features/AssetsStock/pages/Page";
import UseAssets from "../features/useAssets/Page";
import MaintenanceAssets from "../features/maintenanceAssets/Page";
import Rental from "../features/rental/pages/page";


export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },

  // public
  {
    path: "/borrow-assets",
    element: <Dashboardlayout />,
    children: [{ index: true, element: <Borrowassets /> }],
  },
    {
    path: "/rental",
    element: <Dashboardlayout />,
    children: [{ index: true, element: <Rental /> }],
  },
  // admin protected
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Dashboardlayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "maintenance-assets", element: <MaintenanceAssets /> },
          { path: "use-assets", element: <UseAssets /> },
          { path: "locations", element: <LocationPage /> },
          { path: "asset-categories", element: <AssetCategoryPage /> },
          { path: "asset-types", element: <AssetTypePage /> },
          { path: "user-karyawan", element: <User /> },
          { path: "asset", element: <Asset /> },
          { path: "asset-stock", element: <AssetStock /> },
        ],
      },
    ],
  },
]);