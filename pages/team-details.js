import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/TeamDetails/PageHeader";
import TeamDetails from "@sections/TeamDetails";
import Footer from "@sections/Footer/v1";

export default function TeamDetailsPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="team details page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="team details" pageTitle="team details" />
        <TeamDetails />
        <Footer />
      </Layout>
    </Fragment>
  );
}
