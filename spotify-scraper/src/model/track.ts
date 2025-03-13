export type Track = {
  title: string;
  album: { name: string; releaseDate: string };
  artist: { name: string; kana: string }[];
  duration: number;
  artwork: string;
};
