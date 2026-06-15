import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import QuantityStepper from "../../components/QuantityStepper";
import { PROCESS_STEPS, HOOP_FINISHES } from "../../data/products";
import { SUBJECTS, SIZES, OCCASIONS } from "../../data/customOrder";

/* ── Shared field wrapper ── */
function Field({ label, required, hint, children }) {
  return (
    <div className="mb-6">
      <label className="font-body text-sm font-semibold text-strong block mb-2">
        {label}{required && <span className="text-terracotta ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && <p className="font-body text-xs leading-snug text-muted mt-1.5 mb-0">{hint}</p>}
    </div>
  );
}

function RadioChips({ options, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-sm font-medium cursor-pointer transition-all ${
            value === o.value
              ? "bg-walnut text-cream border-2 border-walnut"
              : "bg-card text-ink hairline"
          }`}
        >
          {o.bg && <span className={`w-3 h-3 rounded-full ${o.bg} flex-shrink-0`} aria-hidden="true" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function CustomOrder() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({
    name: "", email: "", whatsapp: "", subject: "person",
    description: "", count: 1, size: "medium", finish: "walnut",
    occasion: "", neededBy: "", notes: "",
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  const submit = (e) => { e.preventDefault(); setSent(true); window.scrollTo({ top: 0 }); };

  /* ── Success state ── */
  if (sent) return (
    <div className="bg-page">
      <section className="page-container py-24 text-center">
        <div className="w-18 h-18 rounded-full bg-terracotta flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faCircleCheck} className="text-cream text-3xl" aria-hidden="true" />
        </div>
        <h1 className="font-display text-[32px] md:text-[52px] font-normal text-walnut m-0 mx-auto mb-5 max-w-[18ch] leading-[1.05]">
          Thank you — your request is on its way.
        </h1>
        <p className="font-body text-base md:text-lg leading-relaxed text-ink m-0 mx-auto mb-8 max-w-[52ch]">
          We'll reply within 2–3 working days with a sketch preview and a quote.
          Keep an eye on your inbox{f.whatsapp ? " and WhatsApp" : ""}.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate("/home")}  className="button-primary">Back to home</button>
          <button onClick={() => navigate("/shop")}  className="button-secondary">Browse the shop</button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="bg-page">

      {/* ── Header ── */}
      <section className="page-container pt-14 pb-8">
        <span className="eyebrow text-terracotta mb-4">Custom order</span>
        <h1 className="font-display text-[36px] md:text-[52px] lg:text-[60px] font-normal text-walnut mt-4 mb-3.5 leading-[1.02] max-w-[20ch]">
          Commission your piece
        </h1>
        <p className="font-body text-base md:text-lg leading-relaxed text-ink max-w-[56ch] m-0">
          Tell us about the memory you'd like stitched. Every portrait is redrawn by hand — share a few details and we'll reply with a sketch and a quote.
        </p>
      </section>

      {/* ── Process strip ── */}
      <section className="page-container pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROCESS_STEPS.map(s => (
            <div key={s.n} className="flex gap-3.5 items-start p-5 bg-cream rounded-lg hairline">
              <span className="font-display text-2xl font-normal text-terracotta flex-shrink-0">{s.n}</span>
              <div>
                <h3 className="font-display text-[19px] font-normal text-walnut m-0 mb-1">{s.t}</h3>
                <p className="font-body text-sm leading-snug text-muted m-0">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + Aside ── */}
      <section className="page-container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5 lg:gap-10 items-start">

          {/* Form */}
          <form onSubmit={submit} className="card p-6 md:p-9">

            {/* About you */}
            <h2 className="font-display text-2xl font-normal text-walnut m-0 mb-6">About you</h2>

            <Field label="Full name" required>
              <input
                value={f.name} onChange={e => set("name", e.target.value)}
                placeholder="Your name" required
                className="input-primary"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" required>
                <input
                  type="email" value={f.email} onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com" required
                  className="input-primary"
                />
              </Field>
              <Field label="WhatsApp / phone">
                <input
                  type="tel" value={f.whatsapp} onChange={e => set("whatsapp", e.target.value)}
                  placeholder="+60 12 345 6789"
                  className="input-primary"
                />
              </Field>
            </div>

            <hr className="border-none hairline-b my-6" />

            {/* Your piece */}
            <h2 className="font-display text-2xl font-normal text-walnut m-0 mb-6">Your piece</h2>

            <Field label="What would you like stitched?" required>
              <RadioChips options={SUBJECTS} value={f.subject} onChange={v => set("subject", v)} />
            </Field>

            <Field label="Tell us about it" required hint="Who or what is in the photo? Any details, colours, or feelings you'd like us to capture.">
              <textarea
                value={f.description} onChange={e => set("description", e.target.value)}
                placeholder="It's a portrait of my grandmother in her garden…" required
                className="input-primary min-h-[110px] resize-y pt-3"
              />
            </Field>

            <Field label="How many subjects?" hint="People or pets to include — this helps us quote.">
              <QuantityStepper
                value={f.count}
                onChange={(v) => set("count", v)}
                min={1}
                max={8}
                className="w-fit"
              />
            </Field>

            <hr className="border-none hairline-b my-6" />

            {/* Make it yours */}
            <h2 className="font-display text-2xl font-normal text-walnut m-0 mb-6">Make it yours</h2>

            <Field label="Hoop size" required>
              <RadioChips options={SIZES} value={f.size} onChange={v => set("size", v)} />
            </Field>

            <Field label="Hoop finish">
              <RadioChips options={HOOP_FINISHES} value={f.finish} onChange={v => set("finish", v)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Occasion">
                <div className="relative">
                  <select
                    value={f.occasion} onChange={e => set("occasion", e.target.value)}
                    className="input-primary appearance-none pr-10 w-full"
                  >
                    <option value="" disabled>Choose one…</option>
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-xs"
                    aria-hidden="true"
                  />
                </div>
              </Field>
              <Field label="Needed by" hint="Made-to-order takes 2–3 weeks.">
                <input
                  type="date" value={f.neededBy} onChange={e => set("neededBy", e.target.value)}
                  className="input-primary"
                />
              </Field>
            </div>

            <Field label="Anything else?">
              <textarea
                value={f.notes} onChange={e => set("notes", e.target.value)}
                placeholder="Special requests, framing notes, budget…"
                className="input-primary min-h-[80px] resize-y pt-3"
              />
            </Field>

            <button type="submit" className="button-primary w-full">
              Send my request
            </button>
            <p className="font-body text-xs text-muted text-center mt-3.5 mb-0">
              No payment now — we'll reply with a sketch and a quote first.
            </p>
          </form>

          {/* Aside */}
          <aside className="lg:sticky lg:top-24 flex flex-col gap-4">
            <div className="bg-cream rounded-xl hairline p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#fde8df] text-terracotta-deep font-body text-xs font-semibold uppercase tracking-[0.08em] mb-3.5">
                Made to order
              </span>
              <h3 className="font-display text-2xl font-normal text-walnut m-0 mb-2">What to expect</h3>
              <ul className="m-0 p-0 list-none flex flex-col gap-3">
                {[
                  ["Sketch first",  "We share a hand-drawn preview before any stitching begins."],
                  ["2–3 weeks",     "Typical turnaround once your sketch is approved."],
                  ["From RM150",    "Final price depends on size and number of subjects."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden className="mt-1.5 w-2 h-2 flex-shrink-0 rounded-full bg-terracotta" />
                    <span className="font-body text-sm leading-snug text-ink">
                      <strong className="text-strong">{t}.</strong> {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#e4ead9] rounded-lg hairline p-[18px]">
              <p className="font-body text-sm font-semibold text-moss-deep m-0 mb-1">Prefer to chat?</p>
              <p className="font-body text-sm leading-snug text-moss-deep m-0 opacity-85">
                Message us on WhatsApp or Instagram <strong>@caulililiflower</strong> and we'll help you start.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
