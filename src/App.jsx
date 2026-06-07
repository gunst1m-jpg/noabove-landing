import { useEffect, useRef, useState } from "react";

/* ============================================================
   NOABOVE — Landingsside
   Digital grunnmur for servicebedrifter
   Estetikk: filmatisk mørk, varmt kinolys, seriff-display,
   monospace-etiketter. AI i maskinrommet, mennesker foran kamera.
   ============================================================ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Schibsted+Grotesk:wght@400;500;600&family=DM+Mono:wght@400;500&family=Syne:wght@800&display=swap');

:root {
  --bg: #0E0E0D;
  --bg-raise: #151513;
  --bg-card: #181816;
  --line: rgba(242, 240, 235, 0.12);
  --line-soft: rgba(242, 240, 235, 0.07);
  --ink: #F2F0EB;
  --ink-dim: rgba(242, 240, 235, 0.62);
  --ink-faint: rgba(242, 240, 235, 0.42);
  --amber: #B89968;
  --amber-deep: #8a7148;
  --amber-lift: #D4B896;
  --serif: 'Fraunces', Georgia, serif;
  --sans: 'Schibsted Grotesk', sans-serif;
  --mono: 'DM Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::selection { background: var(--amber); color: #0E0E0D; }

.na-root { position: relative; }

/* ============ ATMOSFÆRE ============
   Lagdelt bakgrunn, bakerst → fremst:
   1. base    — dyp varm tonegradering (mørkerom-følelse)
   2. light   — to myke lyskilder (gull + kjølig motlys) som driver
                nesten umerkelig over 90 s
   3. organic — jevnt mikroteksturlag (fotopapir-følelse),
                blendet soft-light, uten synlige flekker
   4. vignette— trekker blikket inn mot innholdet
   5. grain   — statisk, fint filmkorn øverst (3.5 %), uten animasjon */

.na-atmos { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

.na-atmos-base {
  position: absolute; inset: 0;
  background:
    linear-gradient(178deg,
      #131311 0%,
      #0F0F0E 26%,
      #0E0E0D 55%,
      #0C0C0B 82%,
      #0A0A09 100%);
}

.na-atmos-light {
  position: absolute; inset: -12%;
  background:
    radial-gradient(ellipse 58% 44% at 76% 6%, rgba(184,153,104,0.09), transparent 68%),
    radial-gradient(ellipse 70% 52% at 14% 88%, rgba(184,153,104,0.05), transparent 62%),
    radial-gradient(ellipse 44% 34% at 38% 30%, rgba(242,240,235,0.025), transparent 70%);
  animation: na-drift 90s ease-in-out infinite;
  will-change: transform;
}
@keyframes na-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50%      { transform: translate3d(-1.8%, 1.2%, 0) scale(1.05); }
}

.na-atmos-organic {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='o'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.22 0.26' numOctaves='3' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23o)'/%3E%3C/svg%3E");
  background-size: 300px 300px;
  mix-blend-mode: soft-light;
  opacity: 0.12;
}

.na-atmos-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 120% 90% at 50% 38%,
    transparent 52%, rgba(7,7,6,0.42) 100%);
}

/* Statisk filmkorn — øverste lag, over innholdet, som på film */
.na-grain {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 60;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}

@media (prefers-reduced-motion: reduce) {
  .na-atmos-light { animation: none; }
}

.na-wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }

/* ---------- Hamburgermeny ---------- */
.na-burger {
  position: fixed; top: 26px; right: 26px; z-index: 80;
  width: 46px; height: 46px; border-radius: 50%;
  background: rgba(14,14,13,0.55); backdrop-filter: blur(10px);
  border: 1px solid var(--line); cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  opacity: 0; animation: na-fade 0.8s 4.1s ease forwards;
  transition: border-color .25s, background .25s;
}
.na-burger:hover { border-color: rgba(242,240,235,0.3); }
.na-burger span {
  display: block; width: 18px; height: 1.5px; background: var(--ink);
  transition: transform .35s cubic-bezier(.16,.84,.32,1), opacity .25s;
}
.na-burger.is-open span:first-child { transform: translateY(3.75px) rotate(45deg); }
.na-burger.is-open span:last-child { transform: translateY(-3.75px) rotate(-45deg); }

.na-menu {
  position: fixed; inset: 0; z-index: 70;
  background: rgba(10,10,9,0.94); backdrop-filter: blur(18px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity .4s ease;
}
.na-menu.is-open { opacity: 1; pointer-events: auto; }
.na-menu-inner { text-align: center; }
.na-menu-links { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.na-menu-links a {
  font-family: var(--serif); font-weight: 300; font-style: italic;
  font-size: clamp(26px, 4.4vw, 42px); line-height: 1.5;
  color: var(--ink-dim); text-decoration: none; transition: color .25s;
  opacity: 0; transform: translateY(14px);
}
.na-menu.is-open .na-menu-links a {
  animation: na-up 0.7s cubic-bezier(.16,.84,.32,1) forwards;
}
.na-menu-links a:hover { color: var(--amber-lift); }
.na-menu-links a.is-cta { color: var(--amber); font-style: normal; }
.na-menu-links a.is-cta:hover { color: var(--amber-lift); }
.na-menu-foot {
  margin-top: 46px; font-family: var(--mono); font-size: 11.5px;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint);
  opacity: 0;
}
.na-menu.is-open .na-menu-foot { animation: na-fade 0.8s 0.5s ease forwards; }
.na-logo { display: flex; align-items: center; gap: 11px; text-decoration: none; color: var(--ink); }
.na-logo svg { display: block; flex: none; }
.na-menu-brand { display: flex; justify-content: center; margin-bottom: 40px; opacity: 0; }
.na-menu.is-open .na-menu-brand { animation: na-fade 0.7s 0.1s ease forwards; }
.na-wordmark {
  font-family: 'Syne', sans-serif; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0; font-kerning: none;
  white-space: nowrap; line-height: 0.95; font-size: 16px;
}
.na-wordmark span { display: inline-block; white-space: pre; }

/* ---------- Generelle byggesteiner ---------- */
.na-eyebrow {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--amber);
  display: flex; align-items: center; gap: 14px;
}
.na-eyebrow::before {
  content: ""; width: 34px; height: 1px; background: var(--amber-deep);
}
.na-h2 {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(32px, 4.6vw, 52px);
  line-height: 1.12; letter-spacing: -0.01em;
  margin-top: 22px;
}
.na-h2 em { font-style: italic; color: var(--amber); }
.na-lede {
  color: var(--ink-dim); font-size: 17px; line-height: 1.75;
  max-width: 560px; margin-top: 22px;
}
section { padding: 110px 0; position: relative; }
@media (max-width: 760px) { section { padding: 76px 0; } }

/* Scroll-reveal */
.na-reveal {
  opacity: 0; transform: translateY(26px);
  transition: opacity .9s cubic-bezier(.16,.84,.32,1), transform .9s cubic-bezier(.16,.84,.32,1);
}
.na-reveal.is-in { opacity: 1; transform: translateY(0); }

/* ---------- Hero: logoen eier hele flaten ---------- */
.na-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 60px 0; position: relative;
  border-bottom: 1px solid var(--line-soft);
}
.na-hero-stage { display: flex; flex-direction: column; align-items: center; }

/* Lockup: NOABOVE med ringen som opphøyd null (x⁰ = 1 → alt blir én, ingen over)
   Ringen ligger i tekstflyten rett etter ordet — ikke absolutt posisjonert —
   så den følger alltid E-en uansett font, bredde og nettleser. */
.na-lockup {
  display: inline-flex; align-items: flex-start;
  font-size: clamp(36px, 7.6vw, 132px); line-height: 0.95;
  white-space: nowrap;
}
.na-lockup-word {
  font-family: 'Syne', sans-serif; font-weight: 800;
  text-transform: uppercase; color: var(--ink);
  letter-spacing: 0; font-kerning: none; white-space: nowrap;
  display: inline-block; filter: blur(2.5px); opacity: 0;
}
.na-lockup-word span { display: inline-block; opacity: 0; white-space: pre; }
.na-lockup-sup {
  display: inline-block; flex: none;
  margin-left: 0.06em; transform: translateY(-0.04em);
}
.na-lockup-sup svg { width: 0.6em; height: 0.6em; display: block; opacity: 0; overflow: visible; }

.na-hero-eyebrow {
  font-family: var(--mono); font-size: clamp(10px, 1.4vw, 13px);
  letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-dim);
  margin-top: clamp(26px, 4vw, 44px);
  padding-left: 0.3em; /* kompenserer for siste bokstavs letter-spacing */
  opacity: 0; animation: na-up 1s 3.4s cubic-bezier(.16,.84,.32,1) forwards;
}

/* Korte, subtile CTA-er i hero */
.na-hero-ctas {
  margin-top: clamp(34px, 5.5vw, 60px);
  display: flex; align-items: center; gap: 26px; flex-wrap: wrap;
  justify-content: center;
  opacity: 0; animation: na-up 1s 3.9s cubic-bezier(.16,.84,.32,1) forwards;
}
.na-hero-ctas a {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em;
  text-transform: uppercase; text-decoration: none;
  color: var(--ink-dim); padding: 8px 2px 8px calc(2px + 0.12em);
  border-bottom: 1px solid transparent;
  transition: color .25s, border-color .25s;
}
.na-hero-ctas a:hover { color: var(--ink); border-color: rgba(242,240,235,0.35); }
.na-hero-ctas a.is-amber { color: var(--amber); }
.na-hero-ctas a.is-amber:hover { color: var(--amber-lift); border-color: rgba(184,153,104,0.5); }
.na-hero-ctas .sep { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-faint); }

.na-scrollhint {
  position: absolute; bottom: 58px; left: 50%; transform: translateX(-50%);
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--ink-faint); text-decoration: none;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  opacity: 0; animation: na-fade 1s 4.5s ease forwards;
  transition: color .25s;
}
.na-scrollhint:hover { color: var(--ink-dim); }
.na-scrollhint .arrow { animation: na-bob 2.6s ease-in-out 5.5s infinite; }
@keyframes na-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.na-hero-bar {
  position: absolute; bottom: 30px; left: 42px; right: 42px;
  display: flex; justify-content: space-between;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--ink-faint);
  opacity: 0; animation: na-fade 1s 4.3s ease forwards;
}
@media (max-width: 600px) { .na-hero-bar { left: 22px; right: 22px; } }
@media (prefers-reduced-motion: reduce) { .na-scrollhint .arrow { animation: none; } }

/* ---------- Intro: budskapet, rett under folden ---------- */
.na-intro { border-bottom: 1px solid var(--line-soft); }
.na-intro h1 {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(36px, 5.6vw, 70px);
  line-height: 1.06; letter-spacing: -0.015em;
  margin-top: 22px; max-width: 14ch;
}
.na-intro h1 em { font-style: italic; color: var(--amber); }
.na-intro-lede {
  margin-top: 30px; max-width: 520px;
  color: var(--ink-dim); font-size: 18px; line-height: 1.75;
}
.na-intro-cta { margin-top: 40px; display: flex; gap: 18px; flex-wrap: wrap; }
.na-intro-facts {
  margin-top: 44px; display: flex; gap: 28px; flex-wrap: wrap;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--ink-faint);
}
.na-intro-facts strong { color: var(--ink-dim); font-weight: 500; }
@keyframes na-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes na-fade { from { opacity: 0; } to { opacity: 1; } }
.na-btn {
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.08em;
  text-decoration: none; padding: 15px 28px; border-radius: 2px;
  transition: all .25s; display: inline-block;
}
.na-btn-solid { background: var(--amber); color: #0E0E0D; }
.na-btn-solid:hover { background: var(--amber-lift); transform: translateY(-2px); }
.na-btn-ghost { border: 1px solid var(--line); color: var(--ink); }
.na-btn-ghost:hover { border-color: var(--amber); color: var(--amber); }


/* ---------- Manifest ---------- */
.na-manifest { border-bottom: 1px solid var(--line-soft); }
.na-manifest-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: start;
}
@media (max-width: 860px) { .na-manifest-grid { grid-template-columns: 1fr; gap: 40px; } }
.na-manifest-state {
  font-family: var(--serif); font-size: clamp(26px, 3.2vw, 38px);
  font-weight: 300; line-height: 1.3;
}
.na-manifest-state em { font-style: italic; color: var(--amber); }
.na-manifest-body p { color: var(--ink-dim); line-height: 1.8; font-size: 16px; }
.na-manifest-body p + p { margin-top: 20px; }
.na-manifest-body strong { color: var(--ink); font-weight: 500; }

/* ---------- Moduler ---------- */
.na-modules-head { display: flex; justify-content: space-between; align-items: end; gap: 40px; flex-wrap: wrap; }
.na-modules-grid {
  margin-top: 64px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--line-soft);
  border: 1px solid var(--line-soft);
}
@media (max-width: 860px) { .na-modules-grid { grid-template-columns: 1fr; } }
.na-module {
  background: rgba(14,14,13,0.55); padding: 46px 42px 50px;
  position: relative; transition: background .35s;
}
.na-module:hover { background: rgba(242,240,235,0.035); }
.na-module-num {
  font-family: var(--mono); font-size: 12px; color: var(--amber);
  letter-spacing: 0.18em;
}
.na-module h3 {
  font-family: var(--serif); font-weight: 400; font-size: 27px;
  margin-top: 18px; letter-spacing: -0.01em;
}
.na-module p { color: var(--ink-dim); line-height: 1.75; font-size: 15px; margin-top: 14px; }
.na-module-for {
  margin-top: 24px; font-family: var(--mono); font-size: 11.5px;
  letter-spacing: 0.06em; color: var(--ink-faint); line-height: 1.9;
}
.na-module-for b { color: var(--ink-dim); font-weight: 500; }
.na-module::after {
  content: "→"; position: absolute; top: 44px; right: 40px;
  color: var(--line); font-size: 20px; transition: all .35s;
}
.na-module:hover::after { color: var(--amber); transform: translateX(5px); }

/* ---------- Signatur (foto/film) ---------- */
.na-signature {
  background:
    radial-gradient(ellipse 60% 70% at 50% 0%, rgba(184,153,104,0.09), transparent 65%),
    rgba(242,240,235,0.022);
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
}
.na-signature-inner { max-width: 820px; margin: 0 auto; text-align: center; }
.na-signature .na-eyebrow { justify-content: center; }
.na-signature .na-eyebrow::after {
  content: ""; width: 34px; height: 1px; background: var(--amber-deep);
}
.na-signature h2 {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(34px, 5vw, 58px); line-height: 1.15;
  margin-top: 26px;
}
.na-signature h2 em { font-style: italic; color: var(--amber); }
.na-signature p {
  color: var(--ink-dim); font-size: 17px; line-height: 1.8;
  margin: 28px auto 0; max-width: 600px;
}
.na-signature-points {
  margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px;
  text-align: left;
}
@media (max-width: 760px) { .na-signature-points { grid-template-columns: 1fr; } }
.na-sigpoint { border-top: 1px solid var(--line); padding-top: 20px; }
.na-sigpoint h4 { font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; font-weight: 500; }
.na-sigpoint p { font-size: 14px; margin-top: 10px; line-height: 1.7; text-align: left; }

/* ---------- Prosess ---------- */
.na-process-list { margin-top: 64px; border-top: 1px solid var(--line); }
.na-step {
  display: grid; grid-template-columns: 110px 1fr 1.4fr; gap: 36px;
  padding: 38px 0; border-bottom: 1px solid var(--line);
  align-items: baseline;
}
@media (max-width: 860px) { .na-step { grid-template-columns: 1fr; gap: 10px; padding: 30px 0; } }
.na-step-week { font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; color: var(--amber); }
.na-step h3 { font-family: var(--serif); font-weight: 400; font-size: 24px; }
.na-step p { color: var(--ink-dim); line-height: 1.75; font-size: 15px; }

/* ---------- Modell / pris ---------- */
.na-model-grid {
  margin-top: 64px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
  align-items: stretch;
}
@media (max-width: 860px) { .na-model-grid { grid-template-columns: 1fr; } }
.na-partner-band {
  margin-top: 26px; padding: 30px 36px; border-radius: 4px;
  border: 1px solid var(--line); background: rgba(20,20,18,0.5);
}
.na-partner-band-tag {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--amber);
}
.na-partner-band p {
  color: var(--ink-dim); line-height: 1.7; font-size: 15px;
  margin-top: 12px; max-width: 760px;
}

/* Basis-banner i modulseksjonen */
.na-base-banner {
  margin-top: 56px; padding: 38px 40px; border-radius: 4px;
  border: 1px solid rgba(184,153,104,0.35);
  background:
    radial-gradient(ellipse 80% 120% at 0% 0%, rgba(184,153,104,0.07), transparent 70%),
    rgba(20,20,18,0.5);
}
@media (max-width: 600px) { .na-base-banner { padding: 28px 24px; } }
.na-base-banner-tag {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--amber);
}
.na-base-banner h3 {
  font-family: var(--serif); font-weight: 400; font-size: clamp(22px, 3vw, 30px);
  margin-top: 14px; letter-spacing: -0.01em;
}
.na-base-banner p {
  color: var(--ink-dim); line-height: 1.7; font-size: 15px;
  margin-top: 14px; max-width: 720px;
}
.na-modules-label {
  margin-top: 52px; font-family: var(--mono); font-size: 12px;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint);
}
.na-modules-grid { margin-top: 22px; }
.na-model-card {
  border: 1px solid var(--line); background: rgba(20,20,18,0.62);
  backdrop-filter: blur(2px);
  padding: 46px 42px; border-radius: 3px; position: relative;
  display: flex; flex-direction: column;
}
.na-model-card.is-amber { border-color: rgba(184,153,104,0.45); }
.na-model-tag {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--ink-faint);
}
.na-model-card.is-amber .na-model-tag { color: var(--amber); }
.na-model-card h3 { font-family: var(--serif); font-weight: 400; font-size: 30px; margin-top: 16px; }
.na-model-price {
  font-family: var(--serif); font-size: 22px; color: var(--ink-dim);
  margin-top: 8px; font-style: italic;
}
.na-model-card > p { color: var(--ink-dim); font-size: 15px; line-height: 1.75; margin-top: 20px; }
.na-model-list { list-style: none; margin-top: 28px; flex: 1; }
.na-model-list li {
  display: flex; gap: 14px; padding: 11px 0;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-dim); font-size: 14.5px; line-height: 1.6;
}
.na-model-list li::before { content: "—"; color: var(--amber); flex-shrink: 0; }
.na-model-note {
  margin-top: 28px; font-family: var(--mono); font-size: 11.5px;
  color: var(--ink-faint); letter-spacing: 0.04em; line-height: 1.8;
}

/* ---------- Bransjer ---------- */
.na-industries { border-top: 1px solid var(--line-soft); }
.na-industry-cloud {
  margin-top: 56px; display: flex; flex-wrap: wrap; gap: 12px;
}
.na-chip {
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.05em;
  border: 1px solid var(--line); border-radius: 100px;
  padding: 11px 22px; color: var(--ink-dim);
  transition: all .3s; cursor: default;
}
.na-chip:hover { border-color: var(--amber); color: var(--amber); transform: translateY(-2px); }
.na-industry-note { margin-top: 36px; color: var(--ink-faint); font-size: 14px; max-width: 540px; line-height: 1.75; }

/* ---------- Tre sirkler / om ---------- */
.na-circles {
  background: rgba(242,240,235,0.022);
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
}
.na-circles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
@media (max-width: 860px) { .na-circles-grid { grid-template-columns: 1fr; gap: 50px; } }
.na-circles-fig { display: flex; justify-content: center; }
.na-circles-fig svg { width: min(360px, 80vw); height: auto; }

/* Scroll-skrubbet ring-samling */
.na-ringasm { display: flex; justify-content: center; }
.na-ringasm svg { width: min(320px, 70vw); height: auto; overflow: visible; }
.na-ringasm g, .na-ringasm text { transform-box: view-box; transform-origin: 50% 50%; }
.na-rlabel {
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.12em;
  text-transform: uppercase; fill: var(--ink-dim); opacity: 0;
}
.na-rlabel.is-amber { fill: var(--amber-lift); }
.na-circle-labels { list-style: none; margin-top: 36px; }
.na-circle-labels li {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 16px 0; border-top: 1px solid var(--line);
}
.na-circle-labels h4 { font-family: var(--mono); font-size: 13px; letter-spacing: 0.1em; font-weight: 500; }
.na-circle-labels p { color: var(--ink-dim); font-size: 14.5px; line-height: 1.7; margin-top: 6px; }

/* ---------- Booking ---------- */
.na-booking { border-top: 1px solid var(--line-soft); }
.na-booking-embed {
  margin-top: 50px; min-height: 640px;
  border: 1px solid var(--line); border-radius: 4px;
  background: rgba(20,20,18,0.5); overflow: hidden;
}
.na-booking-note {
  margin-top: 18px; font-family: var(--mono); font-size: 11px;
  letter-spacing: 0.08em; color: var(--ink-faint);
}

/* ---------- Kontakt ---------- */
.na-contact { text-align: center; padding-bottom: 130px; }
.na-contact h2 {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(38px, 6vw, 70px); line-height: 1.1; letter-spacing: -0.01em;
  max-width: 16ch; margin: 26px auto 0;
}
.na-contact h2 em { font-style: italic; color: var(--amber); }
.na-contact p { color: var(--ink-dim); margin: 26px auto 0; max-width: 480px; line-height: 1.8; font-size: 16px; }
.na-contact .na-eyebrow { justify-content: center; }
.na-contact .na-eyebrow::after { content: ""; width: 34px; height: 1px; background: var(--amber-deep); }
.na-contact-cta { margin-top: 44px; display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; }

/* ---------- Lavterskel startflyt ---------- */
.na-start-card {
  margin: 54px auto 0; max-width: 620px; text-align: left;
  border: 1px solid var(--line); background: rgba(20,20,18,0.62);
  backdrop-filter: blur(2px);
  border-radius: 4px; padding: 42px 40px;
}
@media (max-width: 600px) { .na-start-card { padding: 30px 22px; } }
.na-start-q {
  font-family: var(--serif); font-size: 21px; font-weight: 400;
}
.na-start-chips { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; }
.na-start-chip {
  font-family: var(--mono); font-size: 12.5px; letter-spacing: 0.04em;
  border: 1px solid var(--line); border-radius: 100px;
  padding: 11px 20px; color: var(--ink-dim); background: none;
  cursor: pointer; transition: all .25s;
}
.na-start-chip:hover { border-color: var(--amber); color: var(--amber); }
.na-start-chip.is-on {
  border-color: var(--amber); background: rgba(184,153,104,0.14); color: var(--amber);
}
.na-start-row { margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap; }
.na-start-input {
  flex: 1; min-width: 220px;
  background: rgba(10,10,9,0.6); border: 1px solid var(--line); border-radius: 2px;
  color: var(--ink); font-family: var(--mono); font-size: 14px;
  padding: 15px 18px; outline: none; transition: border-color .25s;
}
.na-start-input::placeholder { color: var(--ink-faint); }
.na-start-input:focus { border-color: var(--amber); }
.na-start-btn {
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.08em;
  background: var(--amber); color: #0E0E0D; border: none; border-radius: 2px;
  padding: 15px 26px; cursor: pointer; transition: background .25s, transform .25s;
}
.na-start-btn:hover { background: var(--amber-lift); transform: translateY(-1px); }
.na-start-btn:disabled { opacity: 0.45; cursor: default; transform: none; }
.na-start-trust {
  margin-top: 22px; display: flex; gap: 20px; flex-wrap: wrap;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.na-start-trust span { display: flex; align-items: center; gap: 7px; }
.na-start-trust span::before { content: ""; width: 4px; height: 4px; border-radius: 50%; background: var(--amber); }
.na-start-done { text-align: center; padding: 26px 0 10px; }
.na-start-done h3 { font-family: var(--serif); font-weight: 400; font-size: 26px; }
.na-start-done p { font-size: 15px !important; margin-top: 14px !important; }
.na-start-alt {
  margin-top: 30px; text-align: center;
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.05em;
  color: var(--ink-faint);
}
.na-start-alt a { color: var(--ink-dim); text-decoration: underline; text-underline-offset: 4px; transition: color .25s; }
.na-start-alt a:hover { color: var(--amber); }
.na-intro-trust {
  margin-top: 20px; font-family: var(--mono); font-size: 11.5px;
  letter-spacing: 0.08em; color: var(--ink-faint);
}

/* ---------- Footer ---------- */
.na-footer { border-top: 1px solid var(--line-soft); padding: 38px 0; }
.na-footer-inner {
  display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;
}
.na-footer span { font-family: var(--mono); font-size: 11.5px; color: var(--ink-faint); letter-spacing: 0.08em; }
`;

/* ---------- Merkevare: tredelt ring + ordmerke (fra Logo_HANDOVER-spek) ----------
   Geometri: viewBox 240, sentrum 120, r=76, 30° åpninger, strek 26, runde ender.
   Segmenter: 15–105°, 135–225°, 255–345°. Ordmerke: Syne 800, uppercase,
   optisk kerning per bokstav (letter-spacing 0, font-kerning none). */

const RING_SEGMENTS = [
  "M139.67 46.59 A76 76 0 0 1 193.41 139.67",
  "M173.74 173.74 A76 76 0 0 1 66.26 173.74",
  "M46.59 139.67 A76 76 0 0 1 100.33 46.59",
];

function RingIcon({ size = 22, color = "var(--ink)", accentIndex = -1, accent = "var(--amber)", style }) {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} aria-hidden="true" style={style}>
      {RING_SEGMENTS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i === accentIndex ? accent : color}
          strokeWidth={26}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

const NOABOVE_KERNING = [0, 0, 0.015, 0.08, 0.04, 0.02, 0.04];

function Wordmark({ text = "Noabove", style, className = "" }) {
  return (
    <span className={`na-wordmark ${className}`} role="img" aria-label={text} style={style}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={NOABOVE_KERNING[i] ? { marginLeft: `${NOABOVE_KERNING[i]}em` } : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ---------- Lavterskel første steg ----------
   To-stegs flyt: kunden trykker på det som stjeler tid, legger igjen
   nummer eller e-post, ferdig. NB for utvikler: handleSubmit må kobles
   til et endepunkt (API-rute, Formspree e.l.) — se TODO under. */

const PAINS = [
  "Telefonen ringer hele dagen",
  "Bestillinger på lapper og SMS",
  "Tilbud tar for lang tid",
  "Kundene maser om status",
  "Nettsiden er pinlig gammel",
  "Vet ikke helt — bare nysgjerrig",
];

function MiniStart() {
  const [pains, setPains] = useState([]);
  const [contact, setContact] = useState("");
  const [done, setDone] = useState(false);

  const toggle = (p) =>
    setPains((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const handleSubmit = () => {
    if (!contact.trim()) return;
    // TODO (utvikler): send { pains, contact } til API-rute / Formspree / e-post.
    // fetch("/api/lead", { method: "POST", body: JSON.stringify({ pains, contact }) });
    setDone(true);
  };

  if (done) {
    return (
      <div className="na-start-card na-start-done">
        <RingIcon size={34} color="#B89968" style={{ margin: "0 auto 18px" }} />
        <h3>Takk! Vi tar kontakt.</h3>
        <p style={{ color: "var(--ink-dim)", lineHeight: 1.75 }}>
          Du hører fra oss innen én arbeidsdag — én kort, hyggelig prat om
          hva som er mulig. Ikke noe mer enn det.
        </p>
      </div>
    );
  }

  return (
    <div className="na-start-card">
      <div className="na-start-q">Hva stjeler mest tid hos dere i dag?</div>
      <div className="na-start-chips">
        {PAINS.map((p) => (
          <button
            key={p}
            type="button"
            className={`na-start-chip ${pains.includes(p) ? "is-on" : ""}`}
            onClick={() => toggle(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="na-start-row">
        <input
          className="na-start-input"
          type="text"
          inputMode="email"
          placeholder="Telefon eller e-post"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          aria-label="Telefon eller e-post"
        />
        <button
          type="button"
          className="na-start-btn"
          onClick={handleSubmit}
          disabled={!contact.trim()}
        >
          Ta kontakt med meg
        </button>
      </div>
      <div className="na-start-trust">
        <span>Tar 20 sekunder</span>
        <span>Helt uforpliktende</span>
        <span>Ingen nyhetsbrev, ingen mas</span>
      </div>
    </div>
  );
}

/* ---------- Logo-intro (fra original landingsside, låst spek) ----------
   Ordet samler seg: bokstaver glir inn fra hver side (spread 30, 2300 ms,
   ease-in cubic-bezier(0.42,0,1,1), blur 2.5 → 0, delay 350). Deretter
   blomstrer ringen som OPPHØYD NULL: delay 2650, 1100 ms, kvartisk t⁴,
   rotasjon −50° → 0°. x⁰ = 1 → alt blir én. Ingen over. */

const LOCKUP_EASE = "cubic-bezier(0.42, 0, 1, 1)";

function HeroLockup() {
  const wordRef = useRef(null);
  const svgRef = useRef(null);
  const groupRef = useRef(null);
  const pathRefs = useRef([]);

  useEffect(() => {
    const word = wordRef.current, svg = svgRef.current, g = groupRef.current;
    if (!word || !svg) return;
    const spans = [...word.children];

    const cx = 120, cy = 120, rRing = 76, gapRing = 30, rDot = 1.5;
    const bases = [0, 120, 240];
    const pt = (r, a) => { const ar = (a * Math.PI) / 180; return [cx + r * Math.sin(ar), cy - r * Math.cos(ar)]; };
    const drawBloom = (v) => {
      const r = rDot + (rRing - rDot) * v, gap = gapRing * v;
      pathRefs.current.forEach((el, i) => {
        if (!el) return;
        const a0 = bases[i] + gap / 2, a1 = bases[i] + 120 - gap / 2;
        const s = pt(r, a0), e = pt(r, a1);
        el.setAttribute("d", `M${s[0].toFixed(2)} ${s[1].toFixed(2)} A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${e[0].toFixed(2)} ${e[1].toFixed(2)}`);
      });
      if (g) g.setAttribute("transform", `rotate(${(-50 + 50 * v).toFixed(2)} ${cx} ${cy})`);
    };

    const reduce = typeof window !== "undefined" && window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !word.animate) {
      word.style.filter = "none"; word.style.opacity = 1;
      spans.forEach((s) => (s.style.opacity = 1));
      drawBloom(1); svg.style.opacity = 1;
      return;
    }

    const mid = (spans.length - 1) / 2;
    spans.forEach((sp, i) => {
      sp.animate(
        [
          { opacity: 0, transform: `translate3d(${(i - mid) * 30}px,0,0) scale3d(0.99,0.99,1)` },
          { opacity: 1, transform: "translate3d(0,0,0) scale3d(1,1,1)" },
        ],
        { duration: 2300, delay: 350, easing: LOCKUP_EASE, fill: "forwards" }
      );
    });
    word.animate([{ filter: "blur(2.5px)" }, { filter: "blur(0px)" }],
      { duration: 2300, delay: 350, easing: LOCKUP_EASE, fill: "forwards" });
    word.animate([{ opacity: 0 }, { opacity: 1 }],
      { duration: 1840, delay: 350, easing: LOCKUP_EASE, fill: "forwards" });

    drawBloom(0); svg.style.opacity = 0;
    const easeQ = (t) => t * t * t * t;
    const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    /* Idle: hvert 10. sekund dreier ringen ett segment (120°) — med
       tredelt symmetri lander den identisk, som et stille pust. */
    let idleTimer = null, idleRaf = null, idleAngle = 0;
    const rotateTo = (a) => { if (g) g.setAttribute("transform", `rotate(${a.toFixed(2)} ${cx} ${cy})`); };
    const idleStep = () => {
      const from = idleAngle, to = idleAngle + 120, t0 = performance.now();
      const dur = 1300;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        rotateTo(from + (to - from) * easeIO(p));
        if (p < 1) idleRaf = requestAnimationFrame(step);
        else idleAngle = to % 360;
      };
      idleRaf = requestAnimationFrame(step);
    };
    const startIdle = () => { idleTimer = setInterval(idleStep, 10000); };

    let raf, start = null, on = false;
    const tick = (now) => {
      if (start === null) start = now;
      const t = now - start;
      if (t < 2650) { raf = requestAnimationFrame(tick); return; }
      if (!on) { on = true; svg.style.opacity = 1; }
      const p = Math.min((t - 2650) / 1100, 1);
      drawBloom(easeQ(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else startIdle();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(idleRaf);
      clearInterval(idleTimer);
      spans.forEach((s) => s.getAnimations().forEach((a) => a.cancel()));
      word.getAnimations().forEach((a) => a.cancel());
    };
  }, []);

  return (
    <span className="na-lockup">
      <span className="na-lockup-word" ref={wordRef} role="img" aria-label="Noabove">
        {"Noabove".split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={NOABOVE_KERNING[i] ? { marginLeft: `${NOABOVE_KERNING[i]}em` } : undefined}
          >
            {ch}
          </span>
        ))}
      </span>
      <span className="na-lockup-sup" aria-hidden="true">
        <svg ref={svgRef} viewBox="0 0 240 240">
          <g ref={groupRef}>
            {[0, 1, 2].map((i) => (
              <path key={i} ref={(el) => (pathRefs.current[i] = el)}
                fill="none" stroke="#B89968" strokeWidth={26} strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </span>
    </span>
  );
}

/* ---------- Ringen som samles (scroll-skrubbet, fra original side) ----------
   Tre fragmenter spredt utover samles til én ring mens man scroller:
   zoom 2.6 → 1, sekvens DEG → NOABOVE → AI, låst når fullført. */

function RingAssembly() {
  const wrapRef = useRef(null);
  const zoomRef = useRef(null);
  const fragRefs = useRef([]);
  const labelRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current, zoomg = zoomRef.current;
    if (!wrap || !zoomg) return;
    const frags = fragRefs.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    const scatter = [
      { dx: 210, dy: -120, rot: -78 },  // seg 0 → øvre høyre (AI)
      { dx: 0, dy: 240, rot: 58 },      // seg 1 → bunn (NOABOVE)
      { dx: -210, dy: -120, rot: -62 }, // seg 2 → øvre venstre (DEG)
    ];
    const seq = [2, 1, 0];
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let landed = false, raf = 0;

    const apply = (p) => {
      const zoom = 2.6 - 1.6 * ease(p);
      zoomg.style.transition = "transform 0.18s ease-out";
      zoomg.style.transform = `scale(${zoom})`;
      frags.forEach((gEl, i) => {
        const f = ease(Math.max(0, Math.min(1, (p - seq[i] * 0.14) / 0.62)));
        gEl.style.transition = "transform 0.18s ease-out, opacity 0.18s ease-out";
        gEl.style.transform = `translate(${scatter[i].dx * (1 - f)}px, ${scatter[i].dy * (1 - f)}px) rotate(${scatter[i].rot * (1 - f)}deg)`;
        gEl.style.opacity = 0.1 + 0.9 * f;
      });
      const lo = Math.max(0, Math.min(1, (p - 0.84) / 0.16));
      labels.forEach((l) => { l.style.transition = "opacity 0.18s ease-out"; l.style.opacity = lo; });
    };

    const reduce = typeof window !== "undefined" && window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { apply(1); return; }

    const measure = () => {
      raf = 0;
      if (landed) { apply(1); return; }
      const vh = window.innerHeight || 800;
      const rect = wrap.getBoundingClientRect();
      const startLine = vh * 1.0, endLine = vh * 0.4;
      const center = rect.top + rect.height / 2;
      const p = Math.max(0, Math.min(1, (startLine - center) / (startLine - endLine)));
      if (p >= 1) landed = true;
      apply(p);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="na-ringasm" ref={wrapRef}>
      <svg viewBox="-60 -60 360 360" aria-label="Tre fragmenter samles til én ring">
        <g ref={zoomRef} className="na-ringasm-zoom">
          {RING_SEGMENTS.map((d, i) => (
            <g key={i} ref={(el) => (fragRefs.current[i] = el)} className="na-ringasm-frag">
              <path d={d} fill="none" stroke="#F2F0EB" strokeWidth={26} strokeLinecap="round" />
            </g>
          ))}
        </g>
        <text ref={(el) => (labelRefs.current[0] = el)} x="216" y="58" textAnchor="start" className="na-rlabel">AI</text>
        <text ref={(el) => (labelRefs.current[1] = el)} x="120" y="246" textAnchor="middle" className="na-rlabel">NOABOVE</text>
        <text ref={(el) => (labelRefs.current[2] = el)} x="24" y="58" textAnchor="end" className="na-rlabel">DEG</text>
      </svg>
    </div>
  );
}

/* ---------- Hamburgermeny ---------- */

const MENU_LINKS = [
  { href: "#moduler", label: "Hva vi bygger" },
  { href: "#signatur", label: "Foto & film" },
  { href: "#prosess", label: "Slik jobber vi" },
  { href: "#modell", label: "Hva det koster" },
  { href: "#befaring", label: "Book befaring" },
  { href: "#start", label: "Kom i gang — 20 sek", cta: true },
];

function BurgerMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`na-burger ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Lukk meny" : "Åpne meny"}
        aria-expanded={open}
      >
        <span /><span />
      </button>
      <div className={`na-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Meny">
        <div className="na-menu-inner">
          <div className="na-menu-brand" aria-hidden="true">
            <RingIcon size={30} color="#B89968" />
          </div>
          <ul className="na-menu-links">
            {MENU_LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={l.cta ? "is-cta" : ""}
                  style={open ? { animationDelay: `${0.12 + i * 0.07}s` } : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="na-menu-foot">
            post@noabove.no · Kristiansand
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Booking: Pro-modul 01, i bruk på denne siden ----------
   Cal.com inline-embed i mørkt tema med merkets gullfarge.
   VIKTIG: Opprett konto på cal.com, lag eventtypen «Befaring» (f.eks. 60 min),
   og sett CAL_LINK under til din egen lenke (brukernavn/eventnavn). */

const CAL_LINK = "team/gunstein-myre/befaring";

function BookingSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Offisiell Cal.com embed-snippet (lastes én gang)
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", "befaring", { origin: "https://app.cal.com" });
    window.Cal.ns.befaring("inline", {
      elementOrSelector: containerRef.current,
      calLink: CAL_LINK,
      config: { theme: "dark", layout: "month_view" },
    });
    window.Cal.ns.befaring("ui", {
      theme: "dark",
      styles: { branding: { brandColor: "#B89968" } },
      hideEventTypeDetails: false,
    });
  }, []);

  return (
    <section className="na-booking" id="befaring">
      <div className="na-wrap">
        <div className="na-eyebrow na-reveal">Pro-modul 01 · i bruk på denne siden</div>
        <h2 className="na-h2 na-reveal">
          Book befaringen <em>direkte.</em>
        </h2>
        <p className="na-lede na-reveal">
          Velg et tidspunkt som passer deg — ingen telefonkø, ingen
          e-poster frem og tilbake. Og legg merke til hva du nettopp brukte:
          dette er den samme booking-modulen kundene våre får. Vi bygger
          ingenting vi ikke bruker selv.
        </p>
        <div className="na-booking-embed na-reveal" ref={containerRef} />
        <p className="na-booking-note na-reveal">
          Helt uforpliktende · Vi møtes hos deg eller på video · Avbryt eller
          flytt når som helst
        </p>
      </div>
    </section>
  );
}

/* Scroll-reveal hook */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".na-reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Robust ankernavigasjon: fanger alle #-lenker og scroller med
   scrollIntoView. Fungerer også der hash-navigasjon er blokkert
   (f.eks. sandkasse-forhåndsvisning), og respekterer reduced motion. */
function useAnchorScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      try { history.replaceState(null, "", `#${id}`); } catch (_) { /* sandkasse */ }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

const MODULES = [
  {
    num: "01",
    title: "Booking & kalender",
    text:
      "Kundene dine bestiller selv — dag og natt. Timer, bord, utstyr eller opplevelser, med automatiske bekreftelser og SMS-påminnelser. Telefonen slutter å være flaskehalsen.",
    forWho: ["Frisør & velvære", "Restaurant", "Bilpleie", "Opplevelser"],
  },
  {
    num: "02",
    title: "Forespørsel & pristilbud",
    text:
      "En smart tilbudsflyt som stiller de riktige spørsmålene, beregner pris og leverer et ferdig strukturert tilbudsgrunnlag rett i innboksen din. «Ring oss for pris» pensjoneres.",
    forWho: ["Liftutleie", "Utleiefirma", "Eiendom", "Håndverk"],
  },
  {
    num: "03",
    title: "Kundeportal & status",
    text:
      "Kunden logger inn og ser status selv: hvilke dekk som er lagret, hvor bestillingen står, når neste service er. Varsler går automatisk — og telefonen din blir stille på den gode måten.",
    forWho: ["Dekkhotell", "Verksted", "Lager & utleie"],
  },
  {
    num: "04",
    title: "Presentasjon & visning",
    text:
      "Når produktet ditt må sees for å selges: gallerier, visningssider og filmatiske presentasjoner. Spiller spesielt godt sammen med foto- og film-tillegget, men fungerer også med dine egne bilder.",
    forWho: ["Eiendom", "Opplevelser", "Restaurant", "Merkevarer"],
  },
];

const STEPS = [
  {
    week: "Uke 0",
    title: "En prat, så en befaring",
    text:
      "Det starter med en kort telefonsamtale — fem minutter, helt uforpliktende. Vil du gå videre, kommer vi innom og ser hvordan dere faktisk jobber. Du får et konkret forslag med fast pris, og kan si ja eller nei i ro og mak.",
  },
  {
    week: "Uke 1",
    title: "Fundament — og fotodag i Pro",
    text:
      "Vi setter den visuelle retningen. I Pro gjennomfører vi også foto- og filmdag i lokalene dine: ansatte, håndverk, atmosfære. Materialet blir ryggraden i alt vi bygger — og det er ditt for alltid.",
  },
  {
    week: "Uke 1–3",
    title: "Bygging",
    text:
      "Nettside og eventuelle systemmoduler bygges, testes og finpusses. Du følger med underveis og gir tilbakemelding på ekte, fungerende versjoner — ikke skisser og PDF-er.",
  },
  {
    week: "Uke 2–4",
    title: "Lansering",
    text:
      "Domene, drift, sikkerhet og personvern på plass. Basis er gjerne live etter en uke eller to, Pro etter to til fire. Vi lærer opp dere som skal bruke det, og står ved siden av de første ukene til alt sitter.",
  },
  {
    week: "Videre",
    title: "Partnerskap",
    text:
      "Siden lever videre med drift, support og videreutvikling gjennom partneravtalen. Små endringer skjer fortløpende, og en årlig oppfriskning holder uttrykket levende.",
  },
];

const INDUSTRIES = [
  "Frisør & velvære",
  "Restaurant & kafé",
  "Dekkhotell & verksted",
  "Bilpleie",
  "Liftutleie",
  "Utleiefirma",
  "Opplevelser & turisme",
  "Eiendom",
  "Håndverk & bygg",
  "Treningssenter",
  "Klinikk & helse",
];

export default function App() {
  useReveal();
  useAnchorScroll();

  return (
    <div className="na-root">
      <style>{css}</style>
      <div className="na-atmos" aria-hidden="true">
        <div className="na-atmos-base" />
        <div className="na-atmos-light" />
        <div className="na-atmos-organic" />
        <div className="na-atmos-vignette" />
      </div>
      <div className="na-grain" aria-hidden="true" />

      {/* ---------- MENY ---------- */}
      <BurgerMenu />

      {/* ---------- HERO ---------- */}
      <header className="na-hero" id="topp">
        <div className="na-wrap na-hero-stage">
          <HeroLockup />
          <p className="na-hero-eyebrow">Digital grunnmur for servicebedrifter</p>
          <div className="na-hero-ctas">
            <a href="#intro">Se hva vi gjør</a>
            <span className="sep" aria-hidden="true" />
            <a className="is-amber" href="#start">Kom i gang — 20 sek</a>
          </div>
        </div>
        <a className="na-scrollhint" href="#intro">
          <span>Bla ned</span>
          <span className="arrow" aria-hidden="true">↓</span>
        </a>
        <div className="na-hero-bar" aria-hidden="true">
          <span>noabove.no</span>
          <span>Kristiansand · Norge</span>
        </div>
      </header>

      {/* ---------- INTRO ---------- */}
      <section className="na-intro" id="intro">
        <div className="na-wrap">
          <div className="na-eyebrow na-reveal">Hva vi gjør</div>
          <h1 className="na-reveal">
            Slutt på telefonkø,<br />
            <em>lapper og Excel.</em><br />
            Velkommen på nett.
          </h1>
          <p className="na-intro-lede na-reveal">
            Noabove bygger nettsider med systemene som driver hverdagen din —
            booking, tilbud, kundeportal — og dokumenterer bedriften din med
            ekte foto og film. Bygget raskt med AI i maskinrommet.
            Aldri kunstig der kundene dine ser.
          </p>
          <div className="na-intro-cta na-reveal">
            <a className="na-btn na-btn-solid" href="#start">Fortell oss hva som stjeler tid</a>
            <a className="na-btn na-btn-ghost" href="#moduler">Se hva vi bygger</a>
          </div>
          <div className="na-intro-trust na-reveal">
            Tar 20 sekunder · Helt uforpliktende · Svar innen én arbeidsdag
          </div>
          <div className="na-intro-facts na-reveal">
            <span><strong>Base</strong> · Kristiansand</span>
            <span><strong>Levering</strong> · 1–4 uker</span>
            <span><strong>Modell</strong> · Fast pris + partneravtale</span>
          </div>
        </div>
      </section>

      {/* ---------- MANIFEST ---------- */}
      <section className="na-manifest">
        <div className="na-wrap">
          <div className="na-eyebrow na-reveal">Hvorfor Noabove</div>
          <div className="na-manifest-grid" style={{ marginTop: 40 }}>
            <p className="na-manifest-state na-reveal">
              Internett fylles av innhold laget av <em>ingen</em>, for{" "}
              <em>alle</em>. Vi går motsatt vei.
            </p>
            <div className="na-manifest-body na-reveal">
              <p>
                AI har gjort det billig å produsere — og derfor er produksjon
                ikke lenger verdt noe i seg selv. Det som er verdt noe, er det
                kundene dine kan <strong>stole på</strong>: et system som
                faktisk virker når de skal bestille, og bilder av ekte
                mennesker i ekte lokaler.
              </p>
              <p>
                Derfor jobber vi etter ett prinsipp:{" "}
                <strong>AI i maskinrommet, mennesker foran kamera.</strong> Vi
                bruker kunstig intelligens for fullt i kode og prosess — det er
                derfor vi leverer på uker, ikke måneder, til en brøkdel av
                tradisjonell byråpris. Men alt som møter kundene dine er
                håndverk: gjennomtenkt design, profesjonelt fotografi og film
                med femten års fartstid bak kameraet.
              </p>
              <p>
                Vi spyr ikke ut innlegg på autopilot. Vi bygger grunnmuren din.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MODULER ---------- */}
      <section id="moduler">
        <div className="na-wrap">
          <div className="na-modules-head">
            <div>
              <div className="na-eyebrow na-reveal">Slik henger det sammen</div>
              <h2 className="na-h2 na-reveal">
                Basis er nettsiden.<br />
                <em>Pro</em> setter den i arbeid.
              </h2>
            </div>
            <p className="na-lede na-reveal" style={{ maxWidth: 380 }}>
              Alle starter med det samme elegante grunnlaget. Velger du Pro,
              legger vi på systemene og innholdet som driver hverdagen — nå
              eller når behovet melder seg.
            </p>
          </div>

          <div className="na-base-banner na-reveal">
            <div className="na-base-banner-tag">Basis · fra 14 900 kr</div>
            <h3>En elegant nettside, bygget rundt din identitet</h3>
            <p>
              Rask, mobilvennlig og søkbar, med din visuelle profil, tekst og et
              smart kontaktpunkt — henvendelser kommer ferdig strukturert, og du
              svarer alltid selv. Komplett i seg selv, levert på 1–2 uker — og
              klar til å vokse den dagen du vil ha mer.
            </p>
          </div>

          <div className="na-modules-label na-reveal">Pro: velg systemene dere trenger</div>
          <div className="na-modules-grid">
            {MODULES.map((m) => (
              <article className="na-module na-reveal" key={m.num}>
                <div className="na-module-num">Pro-modul {m.num}</div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <div className="na-module-for">
                  <b>Typisk for:</b> {m.forWho.join(" · ")}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SIGNATUR: FOTO & FILM ---------- */}
      <section className="na-signature" id="signatur">
        <div className="na-wrap na-signature-inner">
          <div className="na-eyebrow na-reveal">Inkludert i Pro · Signaturen vår</div>
          <h2 className="na-reveal">
            Ekte mennesker.<br />
            Ekte lys. <em>Ekte arbeid.</em>
          </h2>
          <p className="na-reveal">
            Hvert Pro-prosjekt starter med en foto- og filmdag hos deg. Ansiktene,
            hendene, lokalene, håndverket — fotografert og filmet av en som har
            levd av det i femten år. I en verden av generert glatthet er
            ekthet den sterkeste merkevaren du kan ha. Basis-kunder kan legge
            den til når som helst.
          </p>
          <div className="na-signature-points">
            <div className="na-sigpoint na-reveal">
              <h4>Ansattportretter</h4>
              <p>
                Kundene dine velger folk, ikke firmaer. Portretter med karakter
                gjør nettsiden din menneskelig fra første sekund.
              </p>
            </div>
            <div className="na-sigpoint na-reveal">
              <h4>Bedriftsfilm</h4>
              <p>
                En kort, filmatisk presentasjon av hvem dere er og hvordan dere
                jobber — laget for nettsiden, og klippet for sosiale flater.
              </p>
            </div>
            <div className="na-sigpoint na-reveal">
              <h4>Bildebank</h4>
              <p>
                Et bibliotek av ekte bilder fra din hverdag, klart til nettside,
                annonser og presentasjoner. Materialet er ditt — for alltid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROSESS ---------- */}
      <section id="prosess">
        <div className="na-wrap">
          <div className="na-eyebrow na-reveal">Slik jobber vi</div>
          <h2 className="na-h2 na-reveal">
            Fra befaring til lansering<br />på <em>én til fire uker</em>
          </h2>
          <div className="na-process-list">
            {STEPS.map((s) => (
              <div className="na-step na-reveal" key={s.week}>
                <div className="na-step-week">{s.week}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MODELL / PRIS ---------- */}
      <section id="modell">
        <div className="na-wrap">
          <div className="na-eyebrow na-reveal">Modellen</div>
          <h2 className="na-h2 na-reveal">
            To produkter.<br /><em>Ett enkelt valg.</em>
          </h2>
          <p className="na-lede na-reveal">
            Fast pris på begge, ingen timepriser som løper. Basis får deg
            skikkelig på nett. Pro legger på systemene og innholdet som driver
            hverdagen. Endelig pris avtales på befaringen.
          </p>
          <div className="na-model-grid">
            <div className="na-model-card na-reveal">
              <div className="na-model-tag">Basis · fast pris</div>
              <h3>På nett, på ordentlig</h3>
              <div className="na-model-price">Fra 14 900 kr · levert på 1–2 uker</div>
              <p>
                En elegant, komplett nettside med deres egen identitet — satt
                opp av et menneske med blikk for det. Alt en liten bedrift
                trenger for å være ordentlig til stede på nett.
              </p>
              <ul className="na-model-list">
                <li>Skreddersydd design med din visuelle profil</li>
                <li>Mobilvennlig, rask og søkbar (SEO-grunnlag)</li>
                <li>Smart kontaktpunkt: henvendelser kommer ferdig strukturert — du svarer alltid selv</li>
                <li>Domene, sikkerhet og personvern (GDPR) på plass</li>
                <li>Opplæring så du kan gjøre småendringer selv</li>
              </ul>
              <div className="na-model-note">
                Du eier alt: kode, innhold og bilder.
              </div>
            </div>
            <div className="na-model-card is-amber na-reveal">
              <div className="na-model-tag">Pro · fast pris</div>
              <h3>Hele grunnmuren</h3>
              <div className="na-model-price">Fra 49 000 kr · levert på 2–4 uker</div>
              <p>
                Alt i Basis, pluss det som setter siden i arbeid: systemene
                hverdagen din trenger, og ekte foto og film av folkene og
                lokalene dine.
              </p>
              <ul className="na-model-list">
                <li>Alt som er med i Basis</li>
                <li>1–2 systemmoduler: booking, tilbudsflyt eller kundeportal</li>
                <li>Foto- og filmdag med ansattportretter og bildebank</li>
                <li>Tekst og innhold spisset for salg</li>
                <li>Opplæring av hele teamet</li>
              </ul>
              <div className="na-model-note">
                Hvilke moduler? Det finner vi ut sammen på befaringen.
              </div>
            </div>
          </div>
          <div className="na-partner-band na-reveal">
            <div>
              <div className="na-partner-band-tag">Partneravtale · fra 690 kr/mnd</div>
              <p>
                Hvem passer på dette etterpå? Det gjør vi. Drift, sikkerhet,
                support og videreutvikling — på begge produktene, med ett
                menneske å ringe. Ingen bindingstid utover tre måneder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BOOKING ---------- */}
      <BookingSection />

      {/* ---------- BRANSJER ---------- */}
      <section className="na-industries">
        <div className="na-wrap">
          <div className="na-eyebrow na-reveal">Hvem vi bygger for</div>
          <h2 className="na-h2 na-reveal">
            Bedrifter der hverdagen<br />fortsatt går på <em>telefon og papir</em>
          </h2>
          <div className="na-industry-cloud na-reveal">
            {INDUSTRIES.map((i) => (
              <span className="na-chip" key={i}>{i}</span>
            ))}
          </div>
          <p className="na-industry-note na-reveal">
            Kjenner du deg ikke igjen i listen? Det viktigste er ikke bransjen,
            men situasjonen: hvis bestillinger, tilbud eller kundedialog i dag
            håndteres manuelt, finnes det sannsynligvis en modul som frigjør
            timene dine.
          </p>
        </div>
      </section>

      {/* ---------- RINGEN ---------- */}
      <section className="na-circles">
        <div className="na-wrap na-circles-grid">
          <div className="na-circles-fig na-reveal" aria-hidden="true">
            <RingAssembly />
          </div>
          <div>
            <div className="na-eyebrow na-reveal">Navnet & ringen</div>
            <h2 className="na-h2 na-reveal">
              <em>No above.</em><br />Ingen står over noen.
            </h2>
            <p className="na-lede na-reveal" style={{ fontSize: 15, marginTop: 18 }}>
              I logoen står ringen som en opphøyd null: alt opphøyd i null blir
              én. Tre likeverdige segmenter, én helhet.
            </p>
            <ul className="na-circle-labels">
              <li className="na-reveal">
                <RingIcon size={17} color="rgba(242,240,235,0.3)" accentIndex={2} accent="#F2F0EB" style={{ flexShrink: 0, position: "relative", top: 2 }} />
                <div>
                  <h4>DEG</h4>
                  <p>
                    Du kjenner bedriften, kundene og bransjen din bedre enn
                    noen. Uten den kunnskapen blir alt annet gjetning.
                  </p>
                </div>
              </li>
              <li className="na-reveal">
                <RingIcon size={17} color="rgba(242,240,235,0.3)" accentIndex={0} accent="#F2F0EB" style={{ flexShrink: 0, position: "relative", top: 2 }} />
                <div>
                  <h4>AI</h4>
                  <p>
                    Tempoet og kapasiteten. Den lar oss bygge på uker det som
                    før tok måneder — og holde prisen der den hører hjemme.
                  </p>
                </div>
              </li>
              <li className="na-reveal">
                <RingIcon size={17} color="rgba(242,240,235,0.3)" accentIndex={1} accent="#F2F0EB" style={{ flexShrink: 0, position: "relative", top: 2 }} />
                <div>
                  <h4>NOABOVE</h4>
                  <p>
                    Dømmekraften og håndverket. Femten år med foto og film, og
                    ansvaret for at alt som lanseres faktisk holder mål.
                  </p>
                </div>
              </li>
            </ul>
            <p className="na-lede na-reveal" style={{ marginTop: 30, fontSize: 15 }}>
              Ingen av delene lager noe stort alene. Sammen gjør vi det.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- KOM I GANG ---------- */}
      <section className="na-contact" id="start">
        <div className="na-wrap">
          <div className="na-eyebrow na-reveal">Første steg</div>
          <h2 className="na-reveal">
            Det starter med <em>20 sekunder</em>,<br />ikke et møte.
          </h2>
          <p className="na-reveal">
            Trykk på det du kjenner deg igjen i, legg igjen nummeret ditt, og
            vi tar én kort prat om hva som er mulig. Vil du gå videre etterpå,
            kommer vi gjerne innom på en uforpliktende befaring — men det
            bestemmer du da, ikke nå.
          </p>
          <div className="na-reveal" id="kontakt">
            <MiniStart />
          </div>
          <p className="na-start-alt na-reveal">
            Klar for neste steg? <a href="#befaring">Book befaringen direkte</a>.
            &nbsp;Eller ta det helt enkelt: &nbsp;
            <a href="mailto:post@noabove.no">post@noabove.no</a>
            &nbsp;·&nbsp;
            <a href="tel:+4700000000">Ring oss</a>
          </p>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="na-footer">
        <div className="na-wrap na-footer-inner">
          <a className="na-logo" href="#topp" aria-label="Til toppen">
            <RingIcon size={20} />
            <Wordmark style={{ fontSize: 14 }} />
          </a>
          <span>Kristiansand, Norge · © {new Date().getFullYear()} Noabove</span>
          <span>AI i maskinrommet. Mennesker foran kamera.</span>
        </div>
      </footer>
    </div>
  );
}
