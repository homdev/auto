import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/RoadMapDetails/PageHeader";
import RoadMapDetails from "@sections/RoadMapDetails";
import Footer from "@sections/Footer/v1";

export default function RoadMapDetailsPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="roadmap details page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="Roadmap details" pageTitle="Roadmap details" />
        <RoadMapDetails />
        <Footer />
      </Layout>
    </Fragment>
  );
}
