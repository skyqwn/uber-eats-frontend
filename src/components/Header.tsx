import React from "react";
import logo from "../images/ubereats.svg";
import useMe from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-sm text-white">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex items-center justify-between">
          <img src={logo} className="w-24 " alt="Uber Eats" />
          <span className="text-sm">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
