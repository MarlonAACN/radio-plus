import { GetServerSidePropsContext } from 'next';

import Head from 'next/head';

import { ConfigLayout } from '@/components/config/layout';
import { PlayerLayout } from '@/components/player/layout';
import usePlayer from '@/hooks/usePlayer';
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
  const player = usePlayer();

  return (
    <>
      <Head>
        <title>Radio⁺</title>
      </Head>
      <main className="relative w-full min-h-screen flex flex-col justify-start items-center px-5 pt-10 pb-5 sm:px-7 sm:pb-5 md:px-10 md:pb-10">
        <ConfigLayout logout={player.logout} />
        <PlayerLayout player={player} />
      </main>
    </>
  );
}

export default Base;
