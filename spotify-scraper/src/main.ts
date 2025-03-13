import SpotifyWebApi from 'spotify-web-api-node';
import { parsePlaylist } from './model/playlist';

const main = async () => {
  const parseResult = parsePlaylist({
    title: 'タイトル',
    descrition: '説明',
    tracks: {
      title: 'トラックタイトル',
      album: {
        name: '',
        releaseDate: '',
      },
      artist: [{ name: '', kana: '' }],
      duration: 0,
      artwork: '',
    },
    meta: {
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      owner: '',
    },
  });
  console.log(parseResult);
};

main();
