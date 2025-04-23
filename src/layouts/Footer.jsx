import React from "react";

const Footer = () => {
  const dat = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © Developed by{" "}
          <a href="https://codesoftlution.com" target="_blank"  rel="noreferrer">
            CodeSoftlution
          </a>{" "}
          {dat.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
