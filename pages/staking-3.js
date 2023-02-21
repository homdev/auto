import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/StakingPages/v3/PageHeader";
import Staking from "@sections/StakingPages/v3";
import Footer from "@sections/Footer/v1";

export default function StakingThree() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="staking three" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="stake" pageTitle="STAKING v3" />
        <Staking />
        <Footer />
      </Layout>
    </Fragment>
  );
}
