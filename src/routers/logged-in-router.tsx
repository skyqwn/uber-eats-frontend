import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Restaurant from "../pages/client/Restaurant";
import NotFound from "../pages/NotFound";
import Header from "../components/Header";
import useMe from "../hooks/useMe";
import ConfirmEmail from "../pages/user/ConfirmEmail";
import EditProfile from "../pages/user/EditProfile";
import Search from "../pages/client/Search";
import Category from "../pages/client/Category";
import DetailRestaurant from "../pages/client/DetailRestaurant";
import MyRestaurants from "../pages/owner/MyRestaurants";
import CreateRestaurant from "../pages/owner/CreateRestaurant";
import MyRestaurant from "../pages/owner/MyRestaurant";
import CreateDish from "../pages/owner/CreateDish";
import Order from "../pages/Order";
import DashBoard from "../pages/driver/DashBoard";
import { UserRole } from "../__generated__/graphql";

const clientRoutes = [
  {
    path: "/",
    component: <Restaurant />,
  },
  {
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/restaurant/:id",
    component: <DetailRestaurant />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
  {
    path: "/orders/:id",
    component: <Order />,
  },
];

const restaurantRoutes = [
  {
    path: "/",
    component: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    component: <CreateRestaurant />,
  },
  {
    path: "/restaurant/:id",
    component: <MyRestaurant />,
  },
  {
    path: "/restaurant/:id/add-dish",
    component: <CreateDish />,
  },
];

const driverRoutes = [
  {
    path: "/",
    component: <DashBoard />,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="font-medium text-xl">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
