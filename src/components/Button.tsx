import React from "react";

interface IButtonProps {
  cnaClick: boolean;
  loading: boolean;
  actionText: string;
}

const Button: React.FC<IButtonProps> = ({ cnaClick, actionText, loading }) => {
  return (
    <button
      className={`text-lg mt-3 py-4 focus:outline-none text-white transition-colors ${
        cnaClick
          ? "bg-emerald-600 hover:bg-emerald-700 "
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};

export default Button;
