import React from "react";

const Button = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
