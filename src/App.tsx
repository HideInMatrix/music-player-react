import { useEffect } from 'react';
import { AudioPlayer } from '@/components/audio-player';
import { usePlayerStore } from '@/lib/store/player-store';
import { getExampleSongs } from '@/lib/utils';

export function App() {
  const { playlist, setPlaylist } = usePlayerStore();

  // 初始化播放列表
  useEffect(() => {
    if (playlist.length === 0) {
      const exampleSongs = getExampleSongs();
      setPlaylist(exampleSongs);
    }
  }, [playlist.length, setPlaylist]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">音乐播放器</h1>
      </header>
      
      <main className="flex-1 p-4 pb-32">
        <div className="text-center text-muted-foreground">
          选择右下角播放列表图标查看歌曲
        </div>
      </main>
      
      <AudioPlayer />
    </div>
  );
}