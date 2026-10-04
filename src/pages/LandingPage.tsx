import { useEffect } from "react";
import BackgroundMusic from "@/components/background-music/BackgroundMusic";
import Hero from "@/components/hero/Hero";
import Location from "@/components/location/Location";
import RSVP from "@/components/rsvp/RSVP";
import Gallery from "@/components/gallery/Gallery";
import Countdown from "@/components/countdown/Countdown";

export default function LandingPage() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    sections.forEach((el) => el.setAttribute("data-reveal", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
