import BackgroundMusic from "@/components/background-music/BackgroundMusic";
import Gallery from "@/components/gallery/Gallery";
import Hero from "@/components/hero/Hero";
import Location from "@/components/location/Location";
import RSVP from "@/components/rsvp/RSVP";

export default function App() {
  return (
    <>
      <BackgroundMusic />
      <Hero />
      <Location />
      <RSVP />
      <Gallery />
    </>
  );
}