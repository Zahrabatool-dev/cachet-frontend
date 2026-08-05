import { Navbar } from "@/components/shared/Navbar";
import { PageBackground } from "@/components/shared/PageBackground";
import { Hero } from "@/components/shared/Hero";
import { Features } from "@/components/shared/Features";
import { HowItWorks } from "@/components/shared/HowItWorks";
import { FAQ } from "@/components/shared/Faq";
import { CTA } from "@/components/shared/Cta";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="relative">
      <PageBackground />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks/>
      <FAQ/>
      <CTA/>
      <Footer/>
    </main>
  );
}