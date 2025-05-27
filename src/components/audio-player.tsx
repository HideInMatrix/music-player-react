import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from '@/lib/store/player-store';
import { formatTime } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music
} from 'lucide-react';
import { PlaylistDrawer } from './playlist-drawer';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 从状态管理获取播放器状态
  const {
    isPlaying,
    currentSong,
    currentTime,
    duration,
    volume,
    muted,
    playMode,
    playlist,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    play,
    pause,
    togglePlay,
    playNext,
    playPrev,
    setVolume,
    setMuted,
    setPlayMode
  } = usePlayerStore();

  // 处理音频元素事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 设置音量
    audio.volume = muted ? 0 : volume;
    
    // 播放/暂停控制
    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    // 事件监听器
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, currentSong, volume, muted, setCurrentTime, setDuration, playNext, setIsPlaying]);

  // 当歌曲改变时重置播放器
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      audio.currentTime = 0;
      audio.src = currentSong.url;
      if (isPlaying) {
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong, isPlaying, setIsPlaying]);

  // 处理进度条变化
  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // 处理音量变化
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (muted) setMuted(false);
  };

  // 切换播放模式
  const togglePlayMode = () => {
    if (playMode === 'loop') setPlayMode('single');
    else if (playMode === 'single') setPlayMode('random');
    else setPlayMode('loop');
  };

  // 渲染播放模式图标
  const renderPlayModeIcon = () => {
    switch (playMode) {
      case 'single':
        return <Repeat className="h-5 w-5" />;
      case 'random':
        return <Shuffle className="h-5 w-5" />;
      default:
        return <Repeat className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      {/* 音频元素 */}
      <audio ref={audioRef} />
      
      {/* 移动端布局 */}
      <div className="flex flex-col md:hidden space-y-2">
        {/* 第一行：歌曲信息 */}
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center mr-3">
            {currentSong?.cover ? (
              <img src={currentSong.cover} alt={currentSong.title} className="h-full w-full object-cover" />
            ) : (
              <Music className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-base truncate">
              {currentSong?.title || "未选择歌曲"}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {currentSong?.artist || ""}
            </div>
          </div>
        </div>

        {/* 第二行：进度条 */}
        <div className="w-full">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 第三行：控制按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center justify-start">
            <Button variant="ghost" size="icon" onClick={togglePlayMode}>
              {renderPlayModeIcon()}
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center space-x-2">
            <Button variant="ghost" size="icon" onClick={playPrev} disabled={!currentSong || playlist.length <= 1}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={togglePlay} disabled={!currentSong}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} disabled={!currentSong || playlist.length <= 1}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <PlaylistDrawer />
          </div>
        </div>
      </div>

      {/* PC端布局 */}
      <div className="hidden md:flex flex-col">
        {/* 进度条 */}
        <div className="w-full mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentSong ? (
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {currentSong.cover ? (
                    <img src={currentSong.cover} alt={currentSong.title} className="h-full w-full object-cover" />
                  ) : (
                    <Music className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[150px]">{currentSong.title}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">{currentSong.artist}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">未选择歌曲</div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={playPrev} disabled={!currentSong || playlist.length <= 1}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={togglePlay} disabled={!currentSong}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} disabled={!currentSong || playlist.length <= 1}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)}>
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[muted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
            <Button variant="ghost" size="icon" onClick={togglePlayMode}>
              {renderPlayModeIcon()}
            </Button>
            <PlaylistDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}