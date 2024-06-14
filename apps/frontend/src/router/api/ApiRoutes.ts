export const ApiRoutes = {
  Auth: { path: '/{v}/auth', vars: { v: 'v1' }, query: {} },
  RefreshToken: { path: '/{v}/auth/refresh', vars: { v: 'v1' }, query: {} },
  PlayerPlayback: { path: '/{v}/player', vars: { v: 'v1' }, query: {} },
  SeekPosition: { path: '/{v}/player/seek', vars: { v: 'v1' }, query: {} },
  getDetailedTrack: {
    path: '/{v}/track/{trackId}',
    vars: { v: 'v1', trackId: '' },
    query: {},
  },
  initAlgorithm: {
    path: '/{v}/algorithm',
    vars: { v: 'v1' },
    query: {},
  },
  updateQueue: {
    path: '/{v}/algorithm/queue',
    vars: { v: 'v1' },
    query: {},
  },
  getUser: {
    path: '/{v}/user',
    vars: { v: 'v1' },
    query: {},
  },
};
