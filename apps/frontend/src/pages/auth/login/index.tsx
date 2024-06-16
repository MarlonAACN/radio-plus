import { GetServerSidePropsContext } from 'next';

import { XMarkIcon } from '@heroicons/react/20/solid';
import Head from 'next/head';

import { SupportedCookies } from '@/constants/SupportedCookies';
import { RadioPlusIcon } from '@/icons/RadioPlusIcon';
import { SpotifyIcon } from '@/icons/SpotifyIcon';
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
  const spotifyOAuthUrl: string = new AuthRepo(
    process.env.NEXT_PUBLIC_API_BASE_URL
  ).getSpotifyOAuthUrl();

  return (
    <>
      <Head>
        <title>Radio⁺ | Login</title>
      </Head>
      <main className="w-full min-h-screen flex flex-col justify-start items-center p-5 sm:p-7 md:p-10">
        <div className="mb-6">
          <h2 className="pb-1.5 font-arizonia text-6xl border-b border-base-600">
            Radio<span className="font-dmsans text-secondary-700">⁺</span>
          </h2>
          <h3 className="mt-1 text-lg text-center text-font-400">Login</h3>
        </div>
        <div className="radio-plus-player-container w-full h-[600px] flex flex-col justify-start items-center gap-y-4 px-5 pt-10 pb-5 bg-base-800 rounded-md sm:px-6 md:px-7 max-w-xl">
          <h2 className="text-xl text-center">
            Connect{' '}
            <strong>
              Radio<span className="font-dmsans">⁺</span>
            </strong>{' '}
            to your Spotify account.
          </h2>
          <p className="font-light text-center text-font-400">
            Radio<span className="font-dmsans">⁺</span> requires Spotifys API to
            operate properly. Your data remains safe and is used solely to
            enhance your listening experience.
          </p>
          <div className="flex flex-row justify-center items-center gap-x-4 mt-8 mb-16">
            <div className="w-20 h-20 text-center rounded-full">
              <RadioPlusIcon className="w-full h-full" />
              <p className="mt-1.5">
                Radio<span className="font-dmsans">⁺</span>
              </p>
            </div>
            <XMarkIcon className="w-10 h-auto" />
            <div className="w-20 h-20 text-center rounded-full">
              <SpotifyIcon className="w-full fill-spotify-500" />
              <p className="mt-1.5">Spotify</p>
            </div>
          </div>
          <a
            className="flex flex-row justify-center items-center gap-x-2 px-10 py-2.5 text-white bg-spotify-500 rounded-full transition-colors hover:bg-spotify-400"
            href={spotifyOAuthUrl}
          >
            <SpotifyIcon className="w-5 h-auto fill-white" />
            Connect with Spotify
          </a>
        </div>
      </main>
    </>
  );
}

export default Login;
