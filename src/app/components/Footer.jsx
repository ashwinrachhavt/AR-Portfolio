import React from "react";

const Footer = () => {
  return (
    <footer className="footer z-10 border border-l-transparent border-r-transparent border-t-border bg-background text-foreground">
      <div className="container flex justify-between p-12">
        <span>AR</span>
        <p className="text-muted-foreground">
          Built by Ashwin Rachha.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
