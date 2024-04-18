import { GetServerSidePropsContext } from 'next';

import Head from 'next/head';

import { appRouter } from '@/router/app/AppRouter';
import { HttpRedirectResponse } from '@/types/http/HttpRedirectResponse';
import { HttpHandler } from '@/util/HttpHandler';
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
  function test() {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: '123',
      }),
    })
      .then((response: Response) => {
        return HttpHandler.response<HttpRedirectResponse>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<HttpRedirectResponse>(errResponse);
      });
  }

  return (
    <>
      <Head>
        <title>Radio⁺</title>
      </Head>
      <main>
        <h2 className="font-arizonia text-6xl">
          Radio<span className="font-dmsans text-secondary-700">⁺</span>
        </h2>
        <button onClick={test}>test</button>
      </main>
    </>
  );
}

export default Base;
