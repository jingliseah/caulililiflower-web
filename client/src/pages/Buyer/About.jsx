import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faImage } from "@fortawesome/free-solid-svg-icons";

const CHARACTERS = [
  {
    name: "Cauliger",
    desc: "The gentle, curious cauliflower at the heart of it all — inspired by Lili.",
    bg: "bg-cat-terra",
    text: "text-cream",
  },
  {
    name: "Coco",
    desc: "Cauliger's leafy best friend, always tending the garden.",
    bg: "bg-cat-moss",
    text: "text-cream",
  },
  {
    name: "Lili",
    desc: "The third of the trio — soft, thoughtful, and full of wonder.",
    bg: "bg-cream",
    text: "text-walnut",
  },
];

function PlaceholderImg({ label }) {
  return (
    <div className="w-full h-full bg-paper-200 border border-dashed border-(--border-default) rounded-xl flex flex-col items-center justify-center gap-2">
      <FontAwesomeIcon
        icon={faImage}
        className="text-muted text-2xl"
        aria-hidden="true"
      />
      <span className="font-body text-xs text-muted">{label}</span>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-page page-enter">
      {/* ── STORY + HERO ── */}
      <section className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <span className="eyebrow text-terracotta mb-4">Our story</span>
            <h1 className="font-display text-[44px] md:text-[56px] lg:text-[72px] font-normal text-walnut mt-4 mb-7 leading-[1.0] tracking-tight">
              Illustration,
              <br />
              <em className="text-terracotta not-italic">made tangible.</em>
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed text-ink max-w-[44ch] mb-4">
              Caulililiflower began as a small daily illustration practice —
              little drawings of Cauliger, a gentle, curious character inspired
              by Lili. What started on paper slowly grew into a quiet universe
              of friends, gardens, and everyday moments.
            </p>
            <p className="font-body text-base md:text-lg leading-relaxed text-ink max-w-[44ch] m-0">
              Today, each piece still begins the same way — with a photograph, a
              memory, and a needle. Every portrait is redrawn by hand into
              Cauliger's storybook style before being brought to life in cotton
              thread and framed in a wooden hoop.
            </p>
          </div>
          <div className="h-[320px] md:h-[480px]">
            <PlaceholderImg label="Drop a hero embroidery photo" />
          </div>
        </div>
      </section>

      {/* ── STATS + GALLERY ── */}
      <section className="page-container pb-14 md:pb-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="border-t border-(--border-soft) pt-7 flex gap-10 flex-wrap">
            {[
              { n: "500+", label: "Keepsakes stitched" },
              { n: "2–3 wks", label: "Made to order" },
              { n: "100%", label: "Hand-stitched" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-display text-[44px] font-normal text-terracotta leading-none">
                  {s.n}
                </span>
                <span className="font-body text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-50 md:h-60">
              <PlaceholderImg label="Process photo" />
            </div>
            <div className="h-50 md:h-60">
              <PlaceholderImg label="Illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CHARACTERS ── */}
      <section className="page-container pb-14 md:pb-18">
        <div className="text-center mb-8">
          <span className="eyebrow text-moss mb-2">Meet the characters</span>
          <h2 className="font-display text-[28px] md:text-[40px] font-normal text-walnut mt-2">
            Cauliger's little world
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CHARACTERS.map((c) => (
            <div key={c.name} className={`cat-card p-8 pb-7 hairline ${c.bg}`}>
              <h3
                className={`font-display text-2xl font-normal ${c.text} m-0 mb-2`}
              >
                {c.name}
              </h3>
              <p
                className={`font-body text-sm leading-relaxed ${c.text} opacity-88 m-0`}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="page-container pb-20">
        <div className="bg-cream hairline rounded-xl lg:rounded-3xl py-14 px-8 md:py-22 md:px-10 text-center">
          <h2 className="font-display text-[36px] md:text-[52px] lg:text-[60px] font-normal text-walnut m-0 mx-auto mb-7 max-w-[18ch] leading-[1.08]">
            Every piece is made once, for one person.
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-ink m-0 mx-auto mb-9 max-w-[56ch]">
            We don't mass produce. Each portrait is redrawn from your memory and
            stitched by hand — a celebration of connection, preserved in cotton
            canvas and framed in wood.
          </p>
          <button
            onClick={() => navigate("/custom-order")}
            className="button-primary"
          >
            Commission your piece
            <FontAwesomeIcon
              icon={faArrowRight}
              className="ml-1"
              aria-hidden="true"
            />
          </button>
        </div>
      </section>
    </div>
  );
}
