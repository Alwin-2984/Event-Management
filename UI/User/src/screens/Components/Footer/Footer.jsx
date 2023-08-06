/* eslint-disable react/prop-types */
import "./Footer.css";
const Footer = ({ isOrganizer }) => {
  return (
    <footer className={!isOrganizer ? "footerGreen" : "footer"}>
      <div className="footer__addr">
        <div className="logo2">
          <a href="index.html">
            Event<span className={!isOrganizer && "Wire"}>Wire</span>
          </a>
        </div>
        <h2>Contact</h2>

        <address>
          5534 Somewhere In. The World 22193-10212
          <br />
          <a className="footer__btn" href="akcakpl2001@gmail.com">
            Email Us
          </a>
        </address>
      </div>

      <ul className="footer__nav">
        <li className="nav__item">
          <h2 className="nav__title">Media</h2>

          <ul className="nav__ul">
            <li>
              <a href="#">Online</a>
            </li>

            <li>
              <a href="#">Print</a>
            </li>

            <li>
              <a href="#">Alternative Ads</a>
            </li>
          </ul>
        </li>


        <li className="nav__item">
          <h2 className="nav__title">Legal</h2>

          <ul className="nav__ul">
            <li>
              <a href="#">Privacy Policy</a>
            </li>

            <li>
              <a href="#">Terms of Use</a>
            </li>

            <li>
              <a href="#">Sitemap</a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="legal">
        <p>&copy; 2019 Event Wire. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
