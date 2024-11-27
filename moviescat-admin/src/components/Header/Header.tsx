import React from "react";
import logo from "../../assets/img/logo.svg";
import "./styles.css";

const Header: React.FC = () => {
    
  return (
    <div className="header">
      <header>
        <div className="container">
          <div className="header__inner">
            <div className="header__logo">
              <img src={logo} alt="logo" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
