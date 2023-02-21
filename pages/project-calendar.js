import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectCalendar/PageHeader";
import ProjectCalendar from "@sections/ProjectPages/ProjectCalendar";
import Footer from "@sections/Footer/v1";

export default function ProjectCalendarPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="igo calendar" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="CALENDAR VIEW" pageTitle="IGO CALENDAR" />
        <ProjectCalendar />
        <Footer />
      </Layout>
    </Fragment>
  );
}
