import { usePlayerStore, type Song } from '@/lib/store/player-store';
import { Button } from "@/components/ui/button";
import { formatTime } from '@/lib/utils';
import { Play, Music } from 'lucide-react';

export function Playlist() {
  const { playlist, currentSong, isPlaying, playSpecific } = usePlayerStore();

  if (playlist.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        播放列表为空
      </div>
    );
  }

  return (
      <div className="space-y-2">
        {playlist.map((song) => (
          <SongItem 
            key={song.id} 
            song={song} 
            isActive={currentSong?.id === song.id}
            isPlaying={isPlaying && currentSong?.id === song.id}
            onPlay={() => playSpecific(song.id)}
          />
        ))}
      </div>
  );
}

interface SongItemProps {
  song: Song;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}

function SongItem({ song, isActive, isPlaying, onPlay }: SongItemProps) {
  return (
    <div 
      className={`flex items-center p-2 rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}
    >
      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center mr-3">
        {song.cover ? (
          <img src={song.cover} alt={song.title} className="h-full w-full object-cover" />
        ) : (
          <Music className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{song.title}</div>
        <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
      </div>
      <div className="text-sm text-muted-foreground mr-3">
        {song.duration ? formatTime(song.duration) : '--:--'}
      </div>
      <Button variant="ghost" size="icon" onClick={onPlay}>
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
}