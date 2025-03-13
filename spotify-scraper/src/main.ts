import SpotifyWebApi from 'spotify-web-api-node';

const main = async () => {
  console.log('look at me');
  new SpotifyWebApi({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
  });
};

main();
