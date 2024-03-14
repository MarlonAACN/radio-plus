import '@/styles/globals.css';
import { LazyMotion } from 'framer-motion';
import { useRouter } from 'next/router';

import type { AppProps } from 'next/app';

const loadFeatures = () =>
  import('@/util/lazy-framer-animations').then((res) => res.default);

function MyApp({ Component, pageProps }: AppProps) {
  // Fix for stale data on dynamic page swap via next Link: https://github.com/vercel/next.js/discussions/22512
  const router = useRouter();

  return (
    <LazyMotion strict features={loadFeatures}>
      <Component {...pageProps} key={router.asPath} />
    </LazyMotion>
  );
}

export default MyApp;
