import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
