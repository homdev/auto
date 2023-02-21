import Head from "next/head"; 
import favIcon from "@assets/images/fav.png";
const Layout = ({ children }) => { 
  return (
    <>
      <Head>
        {/* meta tag*/}
        <meta charSet="utf-8" /> 
        <meta name="description" content="" />
        <link rel="shortcut icon" type="image/x-icon" href={favIcon.src} />
        {/* responsive tag */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </Head> 
      <main>{children}</main>
    </>
  );
};

export default Layout;
