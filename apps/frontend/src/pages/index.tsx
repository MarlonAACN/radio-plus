import { GetServerSidePropsContext } from 'next';

import Head from 'next/head';

import { PlayerLayout } from '@/components/player/layout';
import { appRouter } from '@/router/app/AppRouter';
import { logger } from '@/util/Logger';
import { ContextManager } from '@/util/manager/ContextManager';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Prevent access to auth pages, caused by stale cashed auth data.
  ContextManager.setNoStoreCacheHeader(context);

  try {
    // Handle user authentication by checking existance of auth cookies and if necessary, refresh token.
    await ContextManager.handleCookieAuth(context);
  } catch (err) {
    logger.error('[BasePage] User unauthorized.');

    return {
      redirect: {
        destination: appRouter.get('Login').build(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

function Base() {
  return (
    <>
      <Head>
        <title>Radio⁺</title>
      </Head>
      <main className="w-full min-h-screen flex flex-col justify-start items-center p-5 sm:p-7 md:p-10">
        <PlayerLayout />
      </main>
    </>
  );
}

export default Base;
