import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { usePlayerStore } from "@/lib/store/player-store";
import { List } from "lucide-react";
import { Playlist } from "./playlist";

export function PlaylistDrawer() {
  const { playlist } = usePlayerStore();
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <List className="h-5 w-5" />
          {playlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {playlist.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>播放列表</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <Playlist />
        </div>
      </DrawerContent>
    </Drawer>
  );
} 