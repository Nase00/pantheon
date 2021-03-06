export const DEVICE_TYPES = ['hue', 'photons', 'httpRequests', 'unified'];

export const WEBSOCKET_PROTOCOL = 'protocolOne';
export const WEBSOCKET_RECONNECT_INTERVAL = 2000; // 2 seconds
export const WEBSOCKET_EXPIRATION_COUNTDOWN_INTERVAL = 300000; // 5 minutes

export const UNIFIED_REMOTE_PORT = 9510;
export const UNIFIED_KEEP_ALIVE_INTERVAL = 60000;

export const SPOTIFY_HOST = 'api.spotify.com';
export const SPOTIFY_API = '/v1/';
export const SPOTIFY_PERMISSION_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-playback-state',
  'user-read-email',
  'streaming',
  'user-top-read'
];

export const SPOTIFY_TOKEN_REFRESH_INVERVAL = 3300000; // 55 minutes
export const SPOTIFY_SYNC_STATE_TIMEOUT = 250;
export const SPOTIFY_FORCE_KILL_TIMEOUT = 7500;
export const SPOTIFY_CONFIG_DEFAULTS = {
  DISPLAY: '0',
  BROWSER: 'chromium'
};

export const SCRYPT_SETTINGS = { N: 16, r: 17, p: 18 };
export const GUEST_ACCESS_REVOKE_INTERVAL = 300000; // 5 minutes
