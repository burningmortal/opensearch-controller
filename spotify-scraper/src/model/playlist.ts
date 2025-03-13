import { Meta } from './meta';
import { Track } from './track';

type Playlist = {
  title: string;
  description: string;
  tracks: Track[];
  meta: Meta;
};
