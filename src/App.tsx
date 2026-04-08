import BackgroundMusic from "@/components/background-music/BackgroundMusic";
import Gallery from "@/components/gallery/Gallery";
import Hero from "@/components/hero/Hero";
import Location from "@/components/location/Location";
import RSVP from "@/components/rsvp/RSVP";
import Countdown from "@/components/countdown/Countdown";

export default function App() {
  return (
    <>
      <BackgroundMusic />
      <Hero />
      <Location />
      <RSVP />
      <Gallery />
      <Countdown />
    </>
  );
}