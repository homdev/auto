import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/IGOApplyPage/PageHeader";
import IGOApply from "@sections/IGOApplyPage";
import Footer from "@sections/Footer/v1";

export default function IGOApplypage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="igo apply" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader pageTitle="APPLY FOR IGO" />
        <IGOApply />
        <Footer />
      </Layout>
    </Fragment>
  );
}
