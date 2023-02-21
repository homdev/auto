import Link from "next/link";
import { BiCalendar } from "react-icons/bi";
import Button from "@components/button";
import { CgMenuMotion } from "react-icons/cg";
import titleShape from "@assets/images/icons/steps.png";
import PageHeaderStyleWrapper from "./PageHeader.style";
const PageHeader = ({ currentPage, pageTitle }) => {
  return (
    <PageHeaderStyleWrapper>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="breadcrumb_area">
              <div className="breadcrumb_menu">
                <Link href="# ">
                  Home <span>.</span> {currentPage && currentPage}
                </Link>
                <img
                  className="heading_shape"
                  src={titleShape.src}
                  alt="bithu nft heading shape"
                />
              </div>
              <h2 className="breadcrumb_title text-uppercase">{pageTitle && pageTitle}</h2>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="breadcrumb_form">
              <Button sm variant="dark" href="/projects-list">
                <CgMenuMotion />
                List View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageHeaderStyleWrapper>
  );
};

export default PageHeader;
