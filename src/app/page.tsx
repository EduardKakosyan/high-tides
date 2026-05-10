import { About } from "@/components/sections/About";
import { Amenities } from "@/components/sections/Amenities";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Gallery />
      <Amenities />
      <Location />
      <Contact />
    </main>
  );
}
