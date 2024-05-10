export const InternalEndpointURLs = {
  frontend: {
    InternalServerErrorPage: (message: string) =>
      `${process.env.APP_ORIGIN_URL}/500?message=${message}`,
  },
  backend: {
    OAuthCallback: `${process.env.BACKEND_ORIGIN_URL}/v1/auth/callback`,
  },
};
