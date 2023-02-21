import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import ShareModal from "@components/modal/shareModal/ShareModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectDetails/v1/PageHeader";
import ProjectDetails from "@sections/ProjectPages/ProjectDetails/v1";
import Footer from "@sections/Footer/v1";

export default function ProjectsDetailsOne() {
  const { 
          walletModalvisibility, 
          shareModalVisibility, 
          metamaskModal 
        } = useModal();

  return (
    <Fragment>
      <SEO title="project details" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {shareModalVisibility && <ShareModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="PROJECT DETAILS " />
        <ProjectDetails />
        <Footer />
      </Layout>
    </Fragment>
  );
}
