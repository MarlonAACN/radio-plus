export const ApiRoutes = {
  Auth: { path: '/{v}/auth', vars: { v: 'v1' }, query: {} },
  RefreshToken: { path: '/{v}/auth/refresh', vars: { v: 'v1' }, query: {} },
  PlayerPlayback: { path: '/{v}/player', vars: { v: 'v1' }, query: {} },
  SeekPosition: { path: '/{v}/player/seek', vars: { v: 'v1' }, query: {} },
};
