import Link from "next/link";
import { useModal } from "src/utils/ModalContext";
import { FiShare2 } from "react-icons/fi";
import titleShape from "@assets/images/icons/steps.png";
import PageHeaderStyleWrapper from "./PageHeader.style";
const PageHeader = ({ currentPage, pageTitle }) => {
  const { shareModalHandle } = useModal();
  return (
    <PageHeaderStyleWrapper className="page_header_wrapper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="breadcrumb_area">
              <div className="breadcrumb_menu">
                <Link href="# ">
                  Home <span>.</span>
                </Link>
                <Link href="# ">
                  Projects <span>.</span>
                </Link>
                <p>{currentPage && currentPage}</p>
                <img
                  className="heading_shape"
                  src={titleShape.src}
                  alt="bithu nft heading shape"
                />
              </div>
              <span className="share_icon" onClick={(e) => shareModalHandle(e)}>
                <FiShare2 /> Share
              </span>
            </div>
          </div>


        </div>
      </div>
    </PageHeaderStyleWrapper>
  );
};

export default PageHeader;
