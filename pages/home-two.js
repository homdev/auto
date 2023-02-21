import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Banner from "@sections/Banner/v2";
import Header from "@sections/Header/v1";
import Count from "@sections/Count/v2";
import ExploreProjects from "@sections/Projects/v4";
import Features from "@sections/Features/v1";
import Allocations from "@sections/Allocations/v1";
import Statistics from "@sections/Statistics/v2";
import Integration from "@sections/Integration/v1";
import RoadMap from "@sections/RoadMap/v1";
import Team from "@sections/Team/v1";
import Mentor from "@sections/Mentor/v1";
import Partner from "@sections/Partner/v1";
import Faq from "@sections/Faq/v1";
import Footer from "@sections/Footer/v2";

export default function HomeTwo() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="home page two" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <Banner />
        <Count />
        <ExploreProjects />
        <Features />
        <Allocations />
        <Statistics />
        <Integration />
        <RoadMap />
        <Team />
        <Mentor />
        <Partner />
        <Faq />
        <Footer />
      </Layout>
    </Fragment>
  );
}
