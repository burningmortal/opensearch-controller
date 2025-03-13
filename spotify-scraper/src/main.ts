import SpotifyWebApi from 'spotify-web-api-node';

const main = async () => {
  const spotify = new SpotifyWebApi({
    clientId: process.env['SPOTIFY_CLIENT_ID'],
    clientSecret: process.env['SPOTIFY_CLIENT_SECRET'],
    redirectUri: process.env['SPOTIFY_REDIRECT_URI'],
  });

  const data = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(data.body['access_token']);
  const artists = await spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
  console.log(artists.body);
};

main();
