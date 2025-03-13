import SpotifyWebApi from 'spotify-web-api-node';
import { parsePlaylist } from './model/playlist';

const main = async () => {
  const parseResult = parsePlaylist({
    title: 'タイトル',
    descrition: '説明',
    tracks: {},
    meta: {},
  });
  console.log(parseResult);
};

main();
