import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/StakingPages/v5/PageHeader";
import Staking from "@sections/StakingPages/v5";
import Footer from "@sections/Footer/v1";

export default function StakingFive() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="staking five page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="stake" pageTitle="STAKING v5" />
        <Staking />
        <Footer />
      </Layout>
    </Fragment>
  );
}
