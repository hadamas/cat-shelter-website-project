import type { story as StoryData } from "@/app/content/quem-somos";
import StoryCarousel from "./StoryCarousel";

export default function Story({ content }: { content: typeof StoryData }) {
  return (
    <section
      id="historia"
      aria-labelledby="story-title"
      className="grid items-center gap-10 bg-main-orange/[0.07] px-6 py-16 md:grid-cols-2 md:gap-14 md:px-12 md:py-20"
    >
      <div className="order-2 md:order-1">
        <h2 id="story-title" className="text-3xl text-main-blue md:text-4xl">
          {content.title}
        </h2>
        <div className="mt-5 space-y-4 leading-relaxed text-main-brown/85">
          {content.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div className="order-1 mx-auto w-full max-w-sm md:order-2 md:max-w-none">
        <StoryCarousel images={content.images} intervalMs={content.intervalMs} />
      </div>
    </section>
  );
}
