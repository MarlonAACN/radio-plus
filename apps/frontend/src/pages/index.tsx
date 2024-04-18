import { GetServerSidePropsContext } from 'next';

import Head from 'next/head';
import { parse } from 'set-cookie-parser';

import { SupportedCookies } from '@/constants/SupportedCookies';
import { ApiRouter } from '@/router/api/ApiRouter';
import { appRouter } from '@/router/app/AppRouter';
import { HttpRedirectResponse } from '@/types/http/HttpRedirectResponse';
import { HttpHandler } from '@/util/HttpHandler';
import { logger } from '@/util/Logger';
import { ContextManager } from '@/util/manager/ContextManager';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const accessTokenCookie = context.req.cookies[SupportedCookies.accessToken];
  const refreshTokenCookie = context.req.cookies[SupportedCookies.refreshToken];

  // Prevent access to auth pages, caused by stale cashed auth data.
  ContextManager.setNoStoreCacheHeader(context);

  if (!accessTokenCookie) {
    // If no access token exists, but a refresh token -> refresh access token.
    if (refreshTokenCookie) {
      logger.log(
        '[BasePage] Access token is expired, use refresh token to refresh token set...'
      );

      try {
        // Use the raw response object to extract set-cookie header.
        const setAuthCookieResponse = await fetch(
          new ApiRouter(process.env.API_BASE_URL).get('RefreshToken').build({
            v: 'v1',
          }),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: refreshTokenCookie,
            }),
          }
        );

        // Parse set-cookie header for validation
        const cookies = parse(setAuthCookieResponse.headers.getSetCookie(), {
          decodeValues: true, // default: true
        });

        // Check if set-cookie payload includes access token
        if (
          cookies.find(
            (cookie) => cookie.name === SupportedCookies.accessToken
          ) === undefined
        ) {
          logger.error(
            "[BasePage] Request for token refresh, didn't return a new access token."
          );
          return {
            redirect: {
              destination: appRouter.get('Login').build(),
              permanent: false,
            },
          };
        }

        // Update contexts set-Cookie header.
        logger.log('[BasePage] Tokens were refreshed successfully.');

        context.res.setHeader(
          'Set-Cookie',
          setAuthCookieResponse.headers.getSetCookie()
        );
      } catch (err) {
        logger.error("[BasePage] Couldn't refresh token:", err);

        return {
          redirect: {
            destination: appRouter.get('Login').build(),
            permanent: false,
          },
        };
      }
    } else {
      // Neither access nor refresh token exists.
      logger.error('[BasePage] No valid auth token found');
      return {
        redirect: {
          destination: appRouter.get('Login').build(),
          permanent: false,
        },
      };
    }
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
