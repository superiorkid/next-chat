import React from "react";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

const LandingPageLayout = ({ children }: LandingPageLayoutProps) => {
  return <div>{children}</div>;
};

export default LandingPageLayout;
