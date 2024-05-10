// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
//
// import Cookies from 'js-cookie';
//
// import { SupportedCookies } from '@/constants/SupportedCookies';
// import { AuthRepo } from '@/repos/AuthRepo';
// import { QueryStatus } from '@/types/misc/QueryStatusEnum';
// import { logger } from '@/util/Logger';
// import { AuthTokenManager } from '@/util/manager/AuthTokenManager';
//
// type AuthSessionContextProps = {
//   accessToken: string | undefined;
//   refreshToken: string | undefined;
//   logout: () => void;
// };
//
// type AuthSessionProps = {
//   children: ReactNode;
// };
//
// const authSessionDefaultValues: AuthSessionContextProps = {
//   accessToken: undefined,
//   refreshToken: undefined,
//   logout: () => {
//     return;
//   },
// };
//
// const AuthSessionContext = createContext<AuthSessionContextProps>(
//   authSessionDefaultValues
// );
//
// function useAuth() {
//   return useContext(AuthSessionContext);
// }
//
// function AuthSessionProvider({ children }: AuthSessionProps) {
//   const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
//   const accessTokenExp = useRef<Date | undefined>(undefined);
//   const refreshToken = useRef<string | undefined>(undefined);
//
//   // On mount try to fetch auth tokens from cookies.
//   useEffect(() => {
//     setAccessToken(Cookies.get(SupportedCookies.accessToken));
//     refreshToken.current = Cookies.get(SupportedCookies.refreshToken);
//
//     const atExp = Cookies.get(SupportedCookies.accessTokenExpiration);
//     if (atExp) {
//       accessTokenExp.current = new Date(atExp);
//     }
//   }, []);
//
//   // When the current access token is updated,
//   // determine time until it's expiration and launch a delayed refresh token function, close before expiration.
//   useEffect(() => {
//     if (accessToken) {
//     }
//
//     if (accessToken.state === QueryStatus.Found && accessToken.value !== null) {
//       const secUntilExp = dateFormatter.secondsUntil(
//         dateFormatter.stringToDate(accessToken.value.expiresAt)
//       );
//       logger.log(
//         `Current access token will expire in ${Math.round(
//           secUntilExp / 60 / 60
//         )} hours`
//       );
//
//       setTimeout(
//         () => {
//           renewAccessToken();
//           // 172800 equals 2 days in seconds, used as buffer before actual expiration.
//         },
//         dateFormatter.subtractSeconds(secUntilExp, 172800)
//       );
//     }
//   }, [accessToken]);
//
//   /**
//    * Issues a request to the shopify API to renew the currently cached access token.
//    */
//   function renewAccessToken() {
//     logger.log('Trying to renew access token...');
//
//     // check cookies if token still exists to prevent unnecessary server request.
//     const token = accessTokenManager.tokenCookieExists();
//     if (!token) return;
//
//     new AuthRepo(process.env.NEXT_PUBLIC_API_BASE_URL)
//       .accessTokenRenew()
//       .then((renewedToken: Auth.Token<TokenTypes.AccessToken>) => {
//         logger.log(
//           'Access token was renewed successfully, new expiry date:',
//           renewedToken.expiresAt
//         );
//
//         saveToken(renewedToken);
//       })
//       .catch((err: Shophub.Error) => {
//         logger.warn('Renewing access token failed:', err?.message);
//         return;
//       });
//   }
//
//   /**
//    * Internal function to update the currently stored access token data.
//    */
//   function saveAccessToken(token: string) {
//     // update cookies and context with new token
//     accessTokenManager.setTokenCookie(token);
//     setAccessToken({ state: QueryStatus.Found, value: token });
//   }
//
//   /**
//    * Deletes all cached data refering to the user.
//    * This includes deleting the access token cookie and reseting the context useState variable.
//    */
//   function logout() {
//     AuthTokenManager.deleteTokenCookie();
//     setAccessToken(undefined);
//     accessTokenExp.current = undefined;
//     refreshToken.current = undefined;
//   }
//
//   const value = {
//     accessToken: accessToken,
//     refreshToken: refreshToken.current,
//     logout,
//   };
//
//   return (
//     <AuthSessionContext.Provider value={value}>
//       {children}
//     </AuthSessionContext.Provider>
//   );
// }
//
// export { useAuth, AuthSessionProvider };
