// pages/index.tsx
import {EmotionCard} from "@/components /EmotionCard";
import {PhotoCard} from "@/components /PhotoCard";
import {StatsCard} from "@/components /StatsCard";

export default function Dashboard() {
  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Panel Główny</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmotionCard />
          <PhotoCard />
          <StatsCard />
        </div>
      </div>
  );
}
