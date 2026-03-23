import { useEffect, useRef, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import "./App.css";
import heroPhoto from "./assets/hero.png";

/* ============================================================
   DATA
   ============================================================ */
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Competitive", href: "#competitive" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const ROLES = [
  "Full Stack Developer",
  "Problem Solver",
];

const SKILL_GROUPS = [
  {
    icon: "⚡",
    color: "cyan" as const,
    title: "Languages",
    items: ["C", "C++", "JavaScript", "TypeScript", "SQL"],
  },
  {
    icon: "🖥️",
    color: "emerald" as const,
    title: "Frontend",
    items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "MUI", "DaisyUI", "HeroUI"],
  },
  {
    icon: "🔧",
    color: "purple" as const,
    title: "Backend & Databases",
    items: ["Node.js", "Express.js", "RESTful APIs", "PHP (Laravel)", "MongoDB", "PostgreSQL"],
  },
  {
    icon: "🛠️",
    color: "orange" as const,
    title: "Tools & Concepts",
    items: ["Redux", "Zustand", "TanStack Query", "Context API", "Git", "GitHub", "Figma", "Vercel", "Firebase", "OOP", "SOLID"],
  },
];

const CP_HANDLES = [
  { platform: "Codeforces", id: "K_A_Akhi_", url: "https://codeforces.com/profile/K_A_Akhi_", color: "#ff6b6b" },
  { platform: "UVA", id: "Akhi55", url: "#", color: "#ffd93d" },
  { platform: "AtCoder", id: "K_A_Akhi_", url: "https://atcoder.jp/users/K_A_Akhi_", color: "#6bcb77" },
  { platform: "CodeChef", id: "k_a_akhi", url: "https://www.codechef.com/users/k_a_akhi", color: "#ff9f52" },
  { platform: "LeetCode", id: "kohinooraktherakhi5539", url: "https://leetcode.com/kohinooraktherakhi5539", color: "#b57bff" },
];

const AWARDS = [
  {
    icon: "🥈",
    title: "Runner-Up, Learnathon 3.0",
    sub: "Brain Station 23 PLC · May 2025 · Team: Elite Programmers",
    glow: "rgba(36,209,255,0.2)",
  },
  {
    icon: "🚀",
    title: "NASA Space App Challenge 2024",
    sub: "Hackathon Participant · Team: Team_CosmoQuest",
    glow: "rgba(181,123,255,0.2)",
  },
  {
    icon: "🏆",
    title: "Champion, IIUC Intra University Contest",
    sub: "Autumn 2023 · Team: IIUC_RackedTrio",
    glow: "rgba(255,159,82,0.2)",
  },
  {
    icon: "👩‍💻",
    title: "6th National Girls Programming Contest 2022",
    sub: "Team: IIUC_Racked Trio",
    glow: "rgba(31,245,160,0.2)",
  },
  {
    icon: "🥇",
    title: "Top Performer, IIUC Competitive Programming Bootcamp",
    sub: "Spring 2021",
    glow: "rgba(255,217,61,0.2)",
  },
  {
    icon: "✍️",
    title: "5th Place, 15th August IIUC Essay Competition",
    sub: "2021",
    glow: "rgba(255,109,174,0.2)",
  },
];

const EXTRAS = [
  { role: "Teaching Assistant", org: "IIUC", period: "2022 – 2023", note: "Course: C, C++, Computer Graphics", icon: "📚" },
  { role: "Asst. General Secretary", org: "IIUC Computer Club", period: "2023 – 2024", note: "Organized events and workshops", icon: "🎯" },
  { role: "Asst. Sports Secretary", org: "IIUC Computer Club", period: "2022 – 2023", note: "Led sports events for club members", icon: "🏅" },
];

/* ============================================================
   CANVAS PARTICLE HOOK
   ============================================================ */
function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf: number;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    interface Star { x: number; y: number; r: number; vx: number; vy: number; alpha: number; }
    const COUNT = Math.min(Math.floor((w * h) / 8000), 160);
    const stars: Star[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const CONNECT = 130;

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(100,200,255,${s.alpha})`;
        ctx!.fill();

        for (let j = i + 1; j < stars.length; j++) {
          const t = stars[j];
          const dx = s.x - t.x;
          const dy = s.y - t.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT) {
            const opacity = (1 - dist / CONNECT) * 0.22;
            ctx!.beginPath();
            ctx!.moveTo(s.x, s.y);
            ctx!.lineTo(t.x, t.y);
            ctx!.strokeStyle = `rgba(36,209,255,${opacity})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
}

/* ============================================================
   TYPEWRITER HOOK
   ============================================================ */
function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(current.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIdx((prev) => prev + 1);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIdx, words, speed, pause]);

  return text;
}

/* ============================================================
   ANIMATED COUNTER HOOK
   ============================================================ */
function useCounter(target: number, duration = 1600, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [cpVisible, setCpVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cpRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const typedRole = useTypewriter(ROLES);

  useParticleCanvas(canvasRef);

  const count1 = useCounter(1000, 1800, cpVisible);
  const count2 = useCounter(5, 1000, cpVisible);
  const count3 = useCounter(6, 1200, cpVisible);

  /* Scroll progress & navbar */
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0);
      setScrolled(scrolled > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right")
    );
    if (!targets.length) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observerRef.current?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
    );
    targets.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  /* CP section counter trigger */
  useEffect(() => {
    const el = cpRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCpVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Tilt card effect */
  const handleTilt = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  }, []);

  const handleTiltReset = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  return (
    <div className="portfolio-app">
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ "--pct": `${scrollPct}%` } as CSSProperties} />

      {/* Canvas particle background */}
      <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />

      {/* Animated background orbs */}
      <div className="bg-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      <div className="grid-overlay" aria-hidden="true" />

      {/* ── NAVBAR ── */}
      <header className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">
          <a href="#home" className="brand">
            <div className="brand-logo">
              <span>KA</span>
              <div className="brand-logo-ring" />
            </div>
            <div className="brand-text">
              <span className="brand-name">Kohinoor Akther Akhi</span>
            </div>
          </a>
          <nav className="navbar-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
       <section id="home" className="hero hero-centered">
          <div className="hero-bg-image" aria-hidden="true" />

          {/* Aurora beams */}
          <div className="aurora" aria-hidden="true">
            <div className="aurora-beam aurora-beam-1" />
            <div className="aurora-beam aurora-beam-2" />
            <div className="aurora-beam aurora-beam-3" />
          </div>

          <div className="hero-content hero-content-centered">
            <div className="hero-left">

              <h1 className="hero-name reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                <span className="name-line1">Kohinoor</span>
                <span className="name-line2">Akther Akhi</span>
              </h1>

              {/* Typewriter role */}
              <p className="hero-role-typed reveal" style={{ "--delay": "160ms" } as CSSProperties}>
                <span className="role-static">I am a </span>
                <span className="role-typed">{typedRole}</span>
              </p>

              <p className="hero-desc reveal" style={{ "--delay": "230ms" } as CSSProperties}>
                CSE graduate from IIUC · Junior Developer at BitApps·
                Solved 1000+ problems across Codeforces, UVA, AtCoder,
                CodeChef &amp; LeetCode · Building production-grade React + Laravel applications.
              </p>

              <div className="hero-actions reveal" style={{ "--delay": "300ms" } as CSSProperties}>
                <a className="btn btn-primary btn-glow float-badge-inner" href="#contact">
                  <span className="btn-shine" />
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* ── ABOUT ── */}
        <section id="about" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">About Me</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Let's talk about myself.
              </h2>
            </div>
            <div className="about-grid">
              <div className="about-image-wrap reveal-left">
                <div className="about-image-glow" />
                <div className="about-image-frame">
                  <img src={heroPhoto} alt="Kohinoor Akther Akhi" />
                  <div className="img-shimmer" />
                </div>
              </div>

              <div className="about-text reveal-right">
                <p>
                  I'm a CSE graduate from International Islamic University Chittagong (IIUC) with a deep passion
                  for competitive programming — having solved <strong className="highlight-text">1000+
                  problems</strong> across Codeforces, CodeChef, UVA, LeetCode, and AtCoder.
                </p>
                <p>
                  Currently working as a <strong className="highlight-text">Junior Developer at BitApps</strong>,
                  Chittagong, where I build high-performance payment form applications with React (TypeScript)
                  and PHP (Laravel), owning end-to-end integration of secure payment workflows.
                </p>
                <p>
                  My contest background sharpens my reasoning under pressure and helps me optimize both logic and
                  performance in real-world products.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── SKILLS ── */}
        <section id="skills" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">Technical Skills</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Core Stack &amp; Tools
              </h2>
              <p className="section-desc reveal" style={{ "--delay": "150ms" } as CSSProperties}>
                Full-stack capabilities from competitive algorithms to production-grade web applications.
              </p>
            </div>

            <div className="skills-grid">
              {SKILL_GROUPS.map((group, i) => (
                <article
                  key={group.title}
                  className={`glass skill-card reveal skill-card--${group.color}`}
                  style={{ "--delay": `${i * 90}ms` } as CSSProperties}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltReset}
                >
                  <div className="skill-card-shimmer" />
                  <div className="skill-card-header">
                    <div className={`skill-icon ${group.color}`}>{group.icon}</div>
                    <h3 className="skill-card-title">{group.title}</h3>
                  </div>
                  <ul className="chip-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">Experience</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Where I've Built
              </h2>
            </div>

            <div className="experience-grid">
              <article
                className="glass exp-card reveal"
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltReset}
              >
                <div className="exp-card-shimmer" />
                <div className="exp-header">
                  <div>
                    <div className="exp-company">BitApps</div>
                    <div className="exp-role">Junior Developer · Chittagong, Bangladesh</div>
                  </div>
                  <span className="exp-badge">
                    <span className="live-dot" />
                    Current
                  </span>
                </div>
                <div className="exp-date">📅 August 2025 – Present</div>
                <ul className="exp-list">
                  <li>
                    Developing and maintaining a high-performance <strong>Payment Form</strong> application
                    using <strong>React (TypeScript)</strong> and <strong>PHP (Laravel)</strong>.
                  </li>
                  <li>
                    Collaborating on the end-to-end integration of secure payment workflows, ensuring seamless
                    data flow between the frontend UI and backend API.
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── PROJECTS ── */}
        <section id="projects" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">Projects</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Featured Work
              </h2>
            </div>

            <div className="projects-grid">
              <article
                className="glass project-card reveal"
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltReset}
              >
                <div className="project-card-shimmer" />
                <div className="project-card-glow" />
                <div className="project-top">
                  <div>
                    <div className="project-name">TrueTest</div>
                    <div className="project-platform">Online Technical Assessment Platform</div>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/K_A_Akhi_" target="_blank" rel="noreferrer" className="project-link">↗ GitHub</a>
                    <a href="#contact" className="project-link">↗ Live</a>
                    <a href="#contact" className="project-link">↗ Figma</a>
                    <a href="#contact" className="project-link">↗ Docs</a>
                  </div>
                </div>
                <p className="project-desc">
                  TrueTest is a secure online platform designed for technical assessments. It features
                  coding challenges, real-time proctoring, and robust anti-cheating measures such as
                  screen monitoring and plagiarism detection.
                </p>
                <div className="project-team-note">
                  🏅 Team project for <strong>Learnathon 3.0</strong> organized by GeekySolutions — contributing
                  to Frontend Development. <strong className="highlight-text">Runner-Up award.</strong>
                </div>
                <ul className="chip-list">
                  {["Next.js", "TypeScript", "HeroUI", "ASP.NET"].map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── AWARDS ── */}
        <section id="awards" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">Awards &amp; Recognition</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Achievement Gallery
              </h2>
            </div>

            <div className="awards-grid">
              {AWARDS.map((award, i) => (
                <article
                  key={award.title}
                  className="award-card reveal"
                  style={{ "--delay": `${i * 100}ms`, "--glow": award.glow } as CSSProperties}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltReset}
                >
                  <div className="award-card-bg" />
                  <span className="award-icon">{award.icon}</span>
                  <div className="award-title">{award.title}</div>
                  <div className="award-sub">{award.sub}</div>
                </article>
              ))}
            </div>

          </div>
        </section>

        <div className="section-divider" />

        {/* ── COMPETITIVE PROGRAMMING ── */}
        <section id="competitive" className="section">
          <div className="container" ref={cpRef}>
            <div className="section-header">
              <div className="section-label reveal">Competitive Programming</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                The Problem Solver
              </h2>
              <p className="section-desc reveal" style={{ "--delay": "150ms" } as CSSProperties}>
                1000+ problems solved across top competitive programming platforms worldwide.
              </p>
            </div>

            {/* Animated stats */}
            <div className="cp-snapshot-row">
              {[
                { value: count1, suffix: "+", label: "Problems Solved", cls: "c", delay: 0 },
                { value: count2, suffix: "", label: "Online Judges", cls: "p", delay: 100 },
                { value: count3, suffix: "+", label: "Awards & Recognitions", cls: "o", delay: 200 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="cp-snap-item reveal"
                  style={{ "--delay": `${s.delay}ms` } as CSSProperties}
                >
                  <div className={`cp-snap-value ${s.cls}`}>
                    {typeof s.value === "number" ? s.value.toLocaleString() : s.value}{s.suffix}
                  </div>
                  <div className="cp-snap-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="cp-section-grid">
              <div className="cp-left">

                {/* Handles Table */}
                <div className="cp-handles-table reveal-left" style={{ "--delay": "120ms" } as CSSProperties}>
                  <div className="cp-handles-header">
                    <span>Platform</span>
                    <span>Handle / ID</span>
                    <span>Link</span>
                  </div>
                  {CP_HANDLES.map((h) => (
                    <div key={h.platform} className="cp-handles-row" style={{ "--hue": h.color } as CSSProperties}>
                      <span className="cp-handle-platform">{h.platform}</span>
                      <span className="cp-handle-id">{h.id}</span>
                      <a href={h.url} target="_blank" rel="noreferrer" className="cp-handle-link">↗ Visit</a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cp-right reveal-right">
                <div className="cp-desc">
                  <h3>Algorithmically Driven</h3>
                  <p>
                    I've been grinding competitive programming since university, solving 1000+ problems
                    on platforms like Codeforces, UVA, AtCoder, CodeChef, and LeetCode.
                  </p>
                  <p style={{ marginTop: "1rem" }}>
                    This discipline sharpens my problem decomposition, time complexity awareness, and
                    the ability to write correct code under pressure — skills that constantly transfer
                    to real-world engineering.
                  </p>
                  <p style={{ marginTop: "1rem" }}>
                    Highlights include national contest appearances, university championship titles etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── EDUCATION ── */}
        <section id="education" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">Education</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Academic Background
              </h2>
            </div>

            <article className="glass edu-card reveal" onMouseMove={handleTilt} onMouseLeave={handleTiltReset}>
              <div className="edu-card-shimmer" />
              <div className="edu-icon-wrap">🎓</div>
              <div>
                <div className="edu-degree">Bachelor of Science in Computer Science &amp; Engineering (BSc CSE)</div>
                <div className="edu-uni">International Islamic University Chittagong (IIUC)</div>
                <div className="edu-meta">
                  <span className="edu-meta-item">📅 2019 – 2023</span>
                  <span className="edu-cgpa">⭐ CGPA: 3.77 / 4.00</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── EXTRACURRICULAR ── */}
        <section id="extra" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label reveal">Extracurricular</div>
              <h2 className="section-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Beyond the Code
              </h2>
            </div>

            <div className="extra-grid">
              {EXTRAS.map((e, i) => (
                <article
                  key={e.role}
                  className="extra-card reveal"
                  style={{ "--delay": `${i * 90}ms` } as CSSProperties}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltReset}
                >
                  <div className="extra-card-icon">{e.icon}</div>
                  <div className="extra-card-role">{e.role}</div>
                  <div className="extra-card-org">{e.org}</div>
                  <div className="extra-card-period">{e.period}</div>
                  <div className="extra-card-note">{e.note}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── CONTACT ── */}
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="contact-inner">
              <div className="section-label reveal" style={{ justifyContent: "center" }}>Contact</div>
              <h2 className="contact-title reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                Let's Build Something Impactful
              </h2>
              <p className="contact-desc reveal" style={{ "--delay": "150ms" } as CSSProperties}>
                Whether you have a project in mind, an opportunity, or just want to talk code — I'm
                always open for a conversation.
              </p>

              <div className="contact-cards reveal" style={{ "--delay": "200ms" } as CSSProperties}>
                <a href="mailto:kohinooraktherakhi5539@gmail.com" className="contact-card">
                  <div className="contact-card-icon">✉</div>
                  <div className="contact-card-label">Email</div>
                  <div className="contact-card-value">kohinooraktherakhi5539@gmail.com</div>
                </a>
                <a href="tel:+8801871388789" className="contact-card">
                  <div className="contact-card-icon">📱</div>
                  <div className="contact-card-label">Phone</div>
                  <div className="contact-card-value">+880 1871-388789</div>
                </a>
              </div>

              <div className="contact-btn-row reveal" style={{ "--delay": "280ms" } as CSSProperties}>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="btn btn-outline btn-magnetic">
                  LinkedIn Profile
                </a>
                <a href="https://github.com/K_A_Akhi_" target="_blank" rel="noreferrer" className="btn btn-outline btn-magnetic">
                  GitHub Profile
                </a>
                <a href="/Kohinoor-Akther-Akhi_Resume.pdf" target="_blank" rel="noreferrer" className="btn btn-glow btn-primary">
                  ↓ View Resume
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
