import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Urbanist } from "next/font/google";
import Head from "next/head";

const urbanist = Urbanist({ subsets: ["latin"] });

type AppPropsWithLayout = AppProps & {
  Component: AppProps["Component"] & {
    getLayout?: (page: React.ReactNode) => React.ReactNode;
  };
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Logiciel de gestion de suivi de mémoire EAA</title>
      </Head>
      <main className={urbanist.className}>
        {getLayout(<Component {...pageProps} />)}
      </main>
    </>
  );
}
