"use client";

import { PlusCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder";
import { useTracks } from "@/hooks/useTracks";
import { Track } from "./components/Track";
import { Sidebar } from "./components/Sidebar";

export default function MusicPage() {
  const { data: tracks } = useTracks({ page: 1, limit: 20 });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-t">
        <div className="grid lg:grid-cols-5">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="bg-white fixed bottom-4 right-2 transform -translate-x-1/2 z-20 lg:hidden shadow-lg rounded-full p-3"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <Sidebar className="pb-0" />
            </SheetContent>
          </Sheet>

          <aside className="hidden lg:block">
            <Sidebar />
          </aside>

          {/* Main content */}
          <main className="col-span-5 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="music">Music</TabsTrigger>
                    <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                    <TabsTrigger value="live" disabled>Live</TabsTrigger>
                  </TabsList>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add music
                  </Button>
                </div>

                <TabsContent value="music" className="border-none p-0 outline-none">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">Listen Now</h2>
                      <p className="text-sm text-muted-foreground">Top picks for you. Updated daily.</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tracks?.data?.map((track) => (
                      <Track key={track.id} track={track} aspectRatio="portrait" />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="podcasts" className="h-full flex-col border-none p-0 data-[state=active]:flex">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">New Episodes</h2>
                      <p className="text-sm text-muted-foreground">Your favorite podcasts. Updated daily.</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <PodcastEmptyPlaceholder />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
