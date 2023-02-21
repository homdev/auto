import Head from "next/head";
import Config from "src/settings/config";

export default function SEO({ title }) {
  return (
    <Head>
      <title>{`${title} | ${Config.siteTitle}`}</title>
      <meta name="description" content={Config.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={Config.description} />
      <meta property="og:site_name" content={Config.siteTitle} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={Config.social.twitter} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={Config.description} />
    </Head>
  );
}
