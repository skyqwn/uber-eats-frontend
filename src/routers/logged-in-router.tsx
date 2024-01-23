import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Restaurant from "../pages/client/Restaurant";
import NotFound from "../pages/NotFound";
import Header from "../components/Header";
import useMe from "../hooks/useMe";
import ConfirmEmail from "../pages/user/ConfirmEmail";

const ClinetRouter = [
  <Route path="/" element={<Restaurant />} />,
  <Route path="/confirm" element={<ConfirmEmail />} />,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  console.log(data);
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
        {data.me.role === "Client" && ClinetRouter}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
