import BackgroundMusic from "@/components/background-music/BackgroundMusic";
import Hero from "@/components/hero/Hero";
import Location from "@/components/location/Location";
import RSVP from "@/components/rsvp/RSVP";
import Gallery from "@/components/gallery/Gallery";
import Countdown from "@/components/countdown/Countdown";

export default function LandingPage() {
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
