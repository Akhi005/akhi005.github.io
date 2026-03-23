import { useEffect, useRef, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import "./App.css";
import heroPhoto from "./assets/hero.png";
import { SKILL_GROUPS } from "./constants/skills";
import { ROLES } from "./constants/roles";
import { AWARDS } from "./constants/awards";
import { CP_HANDLES } from "./constants/cp-handles";
import { EXTRAS } from "./constants/extra-curricular";
import { useTypewriter } from "./features/hooks/useTypeWrite";
import { useCounter } from "./features/hooks/useCounter";

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

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [cpVisible, setCpVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cpRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const typedRole = useTypewriter(ROLES);

  const count1 = useCounter(1000, 1800, cpVisible);
  const count2 = useCounter(5, 1000, cpVisible);
  const count3 = useCounter(6, 1200, cpVisible);

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
      <div className="scroll-progress" style={{ "--pct": `${scrollPct}%` } as CSSProperties} />

      {/* Animated background orbs */}
      <div className="bg-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      <div className="grid-overlay" aria-hidden="true" />

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
        <section id="home" className="hero hero-centered">
          <div className="hero-bg-image" aria-hidden="true" />

          <div className="hero-content hero-content-centered">
            <div className="hero-left">

              <h1 className="hero-name reveal" style={{ "--delay": "80ms" } as CSSProperties}>
                <span className="name-line1">Kohinoor</span>
                <span className="name-line2">Akther Akhi</span>
              </h1>

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
