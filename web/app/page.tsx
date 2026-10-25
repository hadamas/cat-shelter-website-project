import type { Metadata } from "next";
import Hero from "@/app/components/home/Hero";
import { hero } from "@/app/content/home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero content={hero} />
    </>
  );
}
