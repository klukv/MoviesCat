import React from "react";

import youtube from "../assets/img/footer/youtube.svg";
import instagram from "../assets/img/footer/inst.svg";
import twitter from "../assets/img/footer/twitter.svg";
import facebook from "../assets/img/footer/facebook.svg";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <footer>
        <div className="container">
          <div className="footer__inner">
            <div className="footer__approval">
              <a href="#1">
                Согласие на обработку
                <br /> персональных данных
              </a>
            </div>
            <div className="footer__privacy">
              <a href="#1">Политика конфиденциальности</a>
            </div>
            <div className="footer__social">
              <a href="#1" className="footer__social-instagram">
                <img src={instagram} alt="instagram" />
              </a>
              <a href="#1" className="footer__social-youtube">
                <img src={youtube} alt="youtube" />
              </a>
              <a href="#1" className="footer__social-facebook">
                <img src={facebook} alt="facebook" />
              </a>
              <a href="#1" className="footer__social-twitter">
                <img src={twitter} alt="twitter" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
