import { GetServerSidePropsContext } from 'next';

import { SupportedCookies } from '@/constants/SupportedCookies';
import { AuthRepo } from '@/repos/AuthRepo';
import { appRouter } from '@/router/app/AppRouter';
import { logger } from '@/util/Logger';
import { ContextManager } from '@/util/manager/ContextManager';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const accessTokenCookie = context.req.cookies[SupportedCookies.accessToken];

  ContextManager.setNoStoreCacheHeader(context);

  if (accessTokenCookie) {
    logger.error('[LoginPage] User already authenticated');
    return {
      redirect: {
        destination: appRouter.get('Base').build(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

function Login() {
  return (
    <main>
      <h2>Login</h2>
      <a
        href={new AuthRepo(
          process.env.NEXT_PUBLIC_API_BASE_URL
        ).getSpotifyOAuthUrl()}
      >
        Auth
      </a>
    </main>
  );
}

export default Login;
