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
    tracks: playlist.body.tracks.items.map((item) => {
      if (!item.track) {
        throw new Error();
      }
      const artists = item.track.artists.map((artist) => {
        return { name: artist.name, kana: artist.name };
      });
      return {
        title: item.track.name,
        album: {
          name: item.track.album.name,
          releaseDate: item.track.album.release_date,
        },
        artist: artists as any,
        artwork: item.track.album.images[0].url,
      };
    }),
    meta: {
      createdAt: '2025-03-14T12:00:00.123Z',
      updatedAt: '2025-03-14T12:00:00.123Z',
      owner: 'オーナー名',
    },
  });
  console.log(parseResult);
};

main();
