import NextDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            media="(prefers-color-scheme:light)"
            href="https://github.com/useverto/design/raw/master/logo/logo_light.svg"
          />
          <link
            rel="icon"
            media="(prefers-color-scheme:dark)"
            href="https://github.com/useverto/design/raw/master/logo/logo_dark.svg"
          />
          <script
            src="https://unpkg.com/favicon-switcher@1.2.2/dist/index.js"
            crossOrigin="anonymous"
            type="application/javascript"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
