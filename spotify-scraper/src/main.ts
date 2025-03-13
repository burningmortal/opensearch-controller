import SpotifyWebApi from 'spotify-web-api-node';
import { parsePlaylist } from './model/playlist';

const main = async () => {
  const spotify = new SpotifyWebApi({
    clientId: process.env['SPOTIFY_CLIENT_ID'],
    clientSecret: process.env['SPOTIFY_CLIENT_SECRET'],
    redirectUri: process.env['SPOTIFY_REDIRECT_URI'],
  });
  const data = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(data.body.access_token);

  const playlist = await spotify.getPlaylist('4ip9lRuBLN8jJOXODt9BRU?si=24a23780c3474252');

  const parseResult = parsePlaylist({
    title: playlist.body.name,
    descrition: playlist.body.description ?? '',
    tracks: [
      {
        title: 'トラックタイトル',
        album: {
          name: 'アルバム名',
          releaseDate: '2025-02-14',
        },
        artist: [{ name: '名前', kana: 'かな' }],
        duration: 1000234,
        artwork: 'http://localhost',
      },
    ],
    meta: {
      createdAt: '2025-03-14T12:00:00.123Z',
      updatedAt: '2025-03-14T12:00:00.123Z',
      owner: 'オーナー名',
    },
  });
  console.log(parseResult);
};

main();
