import Image from "next/image";
import BrowserFrame from "./BrowserFrame";

type FeatureSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  reverse?: boolean;
};

export default function FeatureSection({
  eyebrow,
  title,
  description,
  bullets,
  image,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className="bg-[#F8FAFC] px-6 py-20">
      <div className={`mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] ${reverse ? "" : ""}`}>

        <div className={reverse ? "lg:order-2" : ""}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A44D]">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[#0F172A]">
            {title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {description}
          </p>

          <ul className="mt-6 space-y-3 text-slate-700">
            {bullets.map((bullet) => (
              <li key={bullet}>• {bullet}</li>
            ))}
          </ul>
        </div>

        <div className={reverse ? "lg:order-1" : ""}>
          <BrowserFrame>
            <Image
              src={image}
              alt={title}
              width={1800}
              height={1100}
              className="h-auto w-full"
            />
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}