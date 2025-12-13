import { Artist } from '../../artists/interfaces/artist.interface';
import { Album } from '../../albums/interfaces/album.interface';
import { Track } from '../../tracks/interfaces/track.interface';

export interface Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

