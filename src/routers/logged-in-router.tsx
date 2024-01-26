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
        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {data.me.role === "Owner" &&
          restaurantRoutes.map((route) => (
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
