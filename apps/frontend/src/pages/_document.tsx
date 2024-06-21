import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#F70062" />
        <meta property="og:title" content="Radio⁺" />
        <meta property="og:site_name" content="Radio⁺" />
        <meta
          name="description"
          content="Less search, more discovery with the filtering tool for the spotify track recommendation algorithm."
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://radio-plus.eu" />
        <meta property="twitter:title" content="Radio⁺" />
        <meta
          property="twitter:description"
          content="Less search, more discovery with the filtering tool for the spotify track recommendation algorithm."
        />
      </Head>
      <body>
        <script id="FF_FOUC_FIX" type="text/javascript">
          {`let FF_FOUC_FIX;/*Firefox FOUC fix*/`}
        </script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
