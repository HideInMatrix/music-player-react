import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export type PlayMode = 'single' | 'loop' | 'random';

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration?: number;
}

interface PlayerState {
  // 播放器状态
  isPlaying: boolean;
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playMode: PlayMode;
  playlist: Song[];
  
  // 操作方法
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentSong: (song: Song | null) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlayMode: (mode: PlayMode) => void;
  setPlaylist: (playlist: Song[]) => void;
  
  // 播放控制
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  playSpecific: (songId: string) => void;
}

type PlayerStorePersist = {
  volume: number;
  muted: boolean;
  playMode: PlayMode;
  playlist: Song[];
};

const persistConfig: PersistOptions<PlayerState, PlayerStorePersist> = {
  name: 'player-storage',
  partialize: (state) => ({
    volume: state.volume,
    muted: state.muted,
    playMode: state.playMode,
    playlist: state.playlist,
  }),
};

// 创建播放器状态管理
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isPlaying: false,
      currentSong: null,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      muted: false,
      playMode: 'loop',
      playlist: [],
      
      // 设置方法
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume }),
      setMuted: (muted) => set({ muted }),
      setPlayMode: (mode) => set({ playMode: mode }),
      setPlaylist: (playlist) => set({ playlist }),
      
      // 播放控制实现
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      // 下一首歌曲
      playNext: () => {
        const { currentSong, playlist, playMode } = get();
        if (!currentSong || playlist.length === 0) return;
        
        const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
        let nextIndex = 0;
        
        if (playMode === 'single') {
          // 单曲循环模式下仍然播放当前歌曲
          nextIndex = currentIndex;
        } else if (playMode === 'random') {
          // 随机模式下随机选择一首歌曲
          nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
          // 循环模式下播放下一首歌曲
          nextIndex = (currentIndex + 1) % playlist.length;
        }
        
        set({ currentSong: playlist[nextIndex], currentTime: 0 });
      },
      
      // 上一首歌曲
      playPrev: () => {
        const { currentSong, playlist, playMode } = get();
        if (!currentSong || playlist.length === 0) return;
        
        const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
        let prevIndex = 0;
        
        if (playMode === 'single') {
          // 单曲循环模式下仍然播放当前歌曲
          prevIndex = currentIndex;
        } else if (playMode === 'random') {
          // 随机模式下随机选择一首歌曲
          prevIndex = Math.floor(Math.random() * playlist.length);
        } else {
          // 循环模式下播放上一首歌曲
          prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        }
        
        set({ currentSong: playlist[prevIndex], currentTime: 0 });
      },
      
      // 播放指定歌曲
      playSpecific: (songId) => {
        const { playlist } = get();
        const song = playlist.find(song => song.id === songId);
        if (song) {
          set({ currentSong: song, currentTime: 0, isPlaying: true });
        }
      },
    }),
    persistConfig
  )
);