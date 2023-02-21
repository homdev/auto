import Link from "next/link";
import Social from "../../SocialProfile/SocialProfile";
import footerLogo from "@assets/images/logo.png";
import { VscChevronUp } from "react-icons/vsc";
import FooterBottomStyleWrapper from "./FooterBottom.style";

const FooterBottom = () => {
  return (
    <FooterBottomStyleWrapper className="footer_bottom_wrapper">
      <Social />
      <div className="container">
        <div className="footer-bottom-content">
          <Link href="#" className="footer-logo">
            <img src={footerLogo.src} alt="footer logo" />
          </Link>

          <ul className="footer-menu">
            <li>
              <Link href="#">
                Features
              </Link>
            </li>
            <li>
              <Link href="#">
                How it works
              </Link>
            </li>
            <li>
              <Link href="#">
                Token info
              </Link>
            </li>
            <li>
              <Link href="#">
                About us
              </Link>
            </li>
            <li>
              <Link href="#">
                Social media
              </Link>
            </li>
            <li>
              <Link href="#">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#">
                Privacy Policy
              </Link>
            </li>
          </ul>

          <div className="copyright-text">
            Copyright © 2022. All Rights Reserved by
            <Link href="#">
              GaFi
            </Link>
          </div>
          <div className="scrollup text-center">
            <Link href="#">
              <VscChevronUp />
            </Link>
          </div>
        </div>
      </div>
    </FooterBottomStyleWrapper>
  );
};

export default FooterBottom;
