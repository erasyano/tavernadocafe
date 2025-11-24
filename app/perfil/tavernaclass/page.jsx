"use client";
import FuturisticHeader from "../../components/FuturisticHeader";
import DropdownCategorias from "./DropdownCategorias";
import VideoIntroBlock from "../../components/VideoIntroBlock";
import { useEffect, useState } from "react";
import BannerCarousel from "../../components/BannerCarousel";
import InfoBlockExtra from "../../components/InfoBlockExtra";
import CategoryMenu from "../../components/CategoryMenu";
import PlaylistPanel from "../../components/PlaylistPanel";
import VideoPlayer from "../../components/VideoPlayer";
import LessonDetails from "../../components/LessonDetails";
// ...existing code...


// ...existing code...

export default function TavernaClassPage() {
  const [categories, setCategories] = useState([]);
  const [videoId, setVideoId] = useState("");
  useEffect(() => {
    fetch("/taverna-categories.json?" + Date.now())
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
    fetch("/carousel-blocks.json?" + Date.now())
      .then(res => res.json())
      .then(data => setVideoId(data.videoId || ""));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white flex flex-col pt-16 md:pt-20">
      <div className="relative">
        <FuturisticHeader>
          <DropdownCategorias categories={categories} />
        </FuturisticHeader>
      </div>
      <main className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-2">
        <div className="flex-1 flex flex-col gap-10 p-0 mt-24 mb-12 justify-start" style={{background:'none', boxShadow:'none', border:'none', zIndex:10, position:'relative', overflow:'visible'}}>
          {videoId && <VideoIntroBlock youtubeId={videoId} />}
          <BannerCarousel visible={5} />
          <InfoBlockExtra />
        </div>
      </main>
    </div>
  );
}
