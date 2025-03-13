import SpotifyWebApi from 'spotify-web-api-node';
import { parsePlaylist } from './model/playlist';

const main = async () => {
  const parseResult = parsePlaylist({
    title: 'タイトル',
    descrition: '説明',
    tracks: {
      title: 'トラックタイトル',
      album: {
        name: 'アルバム名',
        releaseDate: '2025-02-14',
      },
      artist: [{ name: '名前', kana: 'かな' }],
      duration: 1000234,
      artwork: 'http://localhost',
    },
    meta: {
      createdAt: '2025-03-14T12:00:00.123Z',
      updatedAt: '2025-03-14T12:00:00.123Z',
      owner: 'オーナー名',
    },
  });
  console.log(parseResult);
};

main();
