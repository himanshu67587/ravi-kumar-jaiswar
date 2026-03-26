import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Briefcase,
  ChevronDown,
  Instagram,
  Loader2,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  Phone,
  Star,
  Sun,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  name: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const skills: Skill[] = [
  {
    name: "Sales & Marketing",
    percentage: 95,
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-teal to-teal-light",
  },
  {
    name: "Business Development",
    percentage: 90,
    icon: <Briefcase className="w-5 h-5" />,
    color: "from-teal to-teal-light",
  },
  {
    name: "Client Relationship Management",
    percentage: 92,
    icon: <Users className="w-5 h-5" />,
    color: "from-gold to-amber-400",
  },
  {
    name: "Communication Skills",
    percentage: 88,
    icon: <MessageCircle className="w-5 h-5" />,
    color: "from-teal to-teal-light",
  },
  {
    name: "Computer Operator Skills",
    percentage: 80,
    icon: <Monitor className="w-5 h-5" />,
    color: "from-gold to-amber-400",
  },
];

const stats = [
  {
    value: "10+",
    label: "Years Experience",
    icon: <Award className="w-6 h-6" />,
  },
  {
    value: "500+",
    label: "Clients Served",
    icon: <Users className="w-6 h-6" />,
  },
  { value: "100%", label: "Dedication", icon: <Target className="w-6 h-6" /> },
];

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIntersectionObserver(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function useCountUp(target: number, isVisible: boolean, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isVisible, target, duration]);

  return count;
}

// ─── Components ───────────────────────────────────────────────────────────────

function AnimatedStat({
  value,
  label,
  icon,
  isVisible,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  isVisible: boolean;
}) {
  const numericPart = Number.parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/\d/g, "");
  const count = useCountUp(numericPart, isVisible);

  return (
    <div className="stat-card bg-card rounded-2xl p-6 text-center border border-border shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-3 text-teal">{icon}</div>
      <div className="font-display text-3xl font-bold text-foreground mb-1">
        {isVisible ? `${count}${suffix}` : value}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function SkillBar({
  skill,
  isVisible,
  delay,
}: { skill: Skill; isVisible: boolean; delay: number }) {
  return (
    <div
      className="group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <span className="text-teal">{skill.icon}</span>
          <span className="font-body text-sm md:text-base">{skill.name}</span>
        </div>
        <span className="font-display font-bold text-teal text-sm">
          {skill.percentage}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${skill.color} progress-bar-fill`}
          style={{ width: isVisible ? `${skill.percentage}%` : "0%" }}
        />
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { actor } = useActor();
  const skillsObserver = useIntersectionObserver(0.15);
  const aboutObserver = useIntersectionObserver(0.2);

  // Dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Scroll detection for nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connection not ready. Please try again.");
      return;
    }
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await actor.submitContact(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.message,
        BigInt(Date.now()),
      );
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Toaster position="top-right" richColors />

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => scrollTo("#home")}
              className="font-display font-bold text-lg text-foreground hover:text-teal transition-colors"
            >
              <span className="text-gradient-teal">RK</span>
              <span className="hidden sm:inline"> Jaiswar</span>
            </button>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="nav-link-hover text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-1"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <Button
                onClick={() => scrollTo("#contact")}
                size="sm"
                className="hidden md:flex bg-teal hover:bg-teal/90 text-white border-0"
              >
                Hire Me
              </Button>
              {/* Hamburger */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md pb-4">
              <ul className="flex flex-col gap-1 pt-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li className="px-4 pt-2">
                  <Button
                    onClick={() => scrollTo("#contact")}
                    className="w-full bg-teal hover:bg-teal/90 text-white border-0"
                  >
                    Hire Me
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center hero-bg overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-1/4 right-[-5%] w-[40vw] h-[40vw] max-w-md rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-[-5%] w-[30vw] h-[30vw] max-w-sm rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
            {/* Grid pattern */}
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="grid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#grid)"
                className="text-white dark:text-white"
              />
            </svg>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-32 lg:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text content */}
            <div className="space-y-6">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card"
                style={{ animation: "fade-up 0.6s ease-out forwards" }}
              >
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="text-xs font-medium text-white/80 tracking-wide uppercase">
                  Available for Opportunities
                </span>
              </div>

              {/* Name */}
              <div style={{ animation: "fade-up 0.7s ease-out 0.1s both" }}>
                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight">
                  Ravi Kumar
                  <br />
                  <span className="text-gradient-gold">Jaiswar</span>
                </h1>
              </div>

              {/* Title */}
              <div
                className="flex items-center gap-3"
                style={{ animation: "fade-up 0.7s ease-out 0.2s both" }}
              >
                <div className="w-8 h-0.5 bg-teal-light" />
                <span className="font-body text-lg text-white/70 font-medium tracking-wider">
                  Senior Sales Executive
                </span>
              </div>

              {/* Bio */}
              <p
                className="text-white/60 text-base leading-relaxed max-w-lg"
                style={{ animation: "fade-up 0.7s ease-out 0.3s both" }}
              >
                Senior Sales Executive with 10+ years of experience in sales,
                marketing, and business development.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-4"
                style={{ animation: "fade-up 0.7s ease-out 0.4s both" }}
              >
                <Button
                  onClick={() => scrollTo("#contact")}
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-white border-0 font-semibold px-8 shadow-lg shadow-teal/25 transition-all hover:scale-105"
                >
                  Contact Me
                </Button>
                <Button
                  onClick={() => scrollTo("#skills")}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 transition-all hover:scale-105"
                >
                  View My Work
                </Button>
              </div>
            </div>

            {/* Right — avatar card */}
            <div
              className="hidden lg:flex justify-center items-center"
              style={{ animation: "slide-in-right 0.8s ease-out 0.3s both" }}
            >
              <div className="relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-teal/30 scale-110 animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-gold/20 scale-125" />

                {/* Avatar */}
                <div className="w-72 h-72 rounded-full glass-card flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/assets/uploads/Screenshot-2026-02-27-211026-1.jpg"
                    alt="Ravi Kumar Jaiswar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 glass-card rounded-2xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-white">
                      Open to Work
                    </span>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 glass-card rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <span className="text-xs font-medium text-white">
                      10+ Years
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── About Section ────────────────────────────────────────────────── */}
      <section id="about" className="py-24 lg:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-0.5 bg-teal" />
            <span className="text-teal text-sm font-semibold tracking-widest uppercase">
              Who I Am
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-16">
            About <span className="text-gradient-teal">Me</span>
          </h2>

          <div
            ref={aboutObserver.ref}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left — avatar */}
            <div
              className="flex justify-center"
              style={{
                opacity: aboutObserver.isVisible ? 1 : 0,
                transform: aboutObserver.isVisible
                  ? "translateX(0)"
                  : "translateX(-30px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <div className="relative">
                {/* Background decorative shapes */}
                <div className="absolute -inset-4 bg-gradient-to-br from-teal/10 to-gold/10 rounded-3xl blur-xl" />
                <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                  {/* Main avatar circle */}
                  <div className="w-full h-full rounded-full border-4 border-teal/30 bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center overflow-hidden">
                    <img
                      src="/assets/uploads/Screenshot-2026-02-27-211026-1.jpg"
                      alt="Ravi Kumar Jaiswar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Corner badges */}
                  <div className="absolute -bottom-3 -right-3 bg-teal text-white rounded-2xl px-3 py-1.5 text-xs font-semibold shadow-lg">
                    Sales Pro
                  </div>
                </div>
              </div>
            </div>

            {/* Right — content */}
            <div
              className="space-y-6"
              style={{
                opacity: aboutObserver.isVisible ? 1 : 0,
                transform: aboutObserver.isVisible
                  ? "translateX(0)"
                  : "translateX(30px)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
            >
              <p className="text-muted-foreground text-lg leading-relaxed">
                Hi, I'm{" "}
                <span className="text-foreground font-semibold">
                  Ravi Kumar Jaiswar
                </span>
                . I work in sales and marketing and have more than 10 years of
                experience in business development and customer handling. I
                enjoy building strong relationships with clients and helping
                businesses grow.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I am hardworking, flexible, and always ready to learn new
                skills. My goal is to create lasting partnerships that drive
                mutual growth and success.
              </p>

              {/* Highlight tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Sales Strategy",
                  "Client Growth",
                  "B2B & B2C",
                  "Team Leadership",
                  "Market Expansion",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-medium border border-teal/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => scrollTo("#contact")}
                className="bg-teal hover:bg-teal/90 text-white border-0 font-semibold mt-2"
              >
                Let's Connect
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20"
            style={{
              opacity: aboutObserver.isVisible ? 1 : 0,
              transform: aboutObserver.isVisible
                ? "translateY(0)"
                : "translateY(20px)",
              transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
            }}
          >
            {stats.map((stat) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                isVisible={aboutObserver.isVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills Section ───────────────────────────────────────────────── */}
      <section id="skills" className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">
              Expertise
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-4">
            My <span className="text-gradient-gold">Skills</span>
          </h2>
          <p className="text-muted-foreground mb-16 max-w-xl">
            Years of hands-on experience have honed these core competencies into
            strengths that drive results.
          </p>

          <div
            ref={skillsObserver.ref}
            className="grid lg:grid-cols-2 gap-x-16 gap-y-8"
          >
            {skills.map((skill, i) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                isVisible={skillsObserver.isVisible}
                delay={i * 120}
              />
            ))}

            {/* Achievement highlight */}
            <div
              className="lg:col-span-2 mt-8"
              style={{
                opacity: skillsObserver.isVisible ? 1 : 0,
                transform: skillsObserver.isVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
              }}
            >
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Revenue Generated", value: "₹2Cr+", icon: "📈" },
                  { label: "Client Retention", value: "94%", icon: "🤝" },
                  { label: "Deals Closed", value: "300+", icon: "✅" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-teal/30 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-display font-bold text-xl text-foreground">
                        {item.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Section ──────────────────────────────────────────────── */}
      <section id="contact" className="py-24 lg:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-0.5 bg-teal" />
            <span className="text-teal text-sm font-semibold tracking-widest uppercase">
              Reach Out
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-4">
            Get In <span className="text-gradient-teal">Touch</span>
          </h2>
          <p className="text-muted-foreground mb-16 max-w-xl">
            Ready to discuss opportunities or just want to connect? I'd love to
            hear from you.
          </p>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left — form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Rahul"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                      required
                      className="border-border focus:border-teal focus:ring-teal/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Sharma"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, lastName: e.target.value }))
                      }
                      className="border-border focus:border-teal focus:ring-teal/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    className="border-border focus:border-teal focus:ring-teal/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground"
                  >
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="I'd love to discuss a business opportunity with you..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    required
                    rows={5}
                    className="border-border focus:border-teal focus:ring-teal/20 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal hover:bg-teal/90 text-white border-0 font-semibold h-11 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>

            {/* Right — social links & info */}
            <div className="space-y-8">
              {/* Contact info */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xl text-foreground">
                  Connect With Me
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Whether you have a business proposal, want to explore
                  partnerships, or just want to say hello — my inbox is always
                  open.
                </p>
              </div>

              {/* Social cards */}
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/ravi.jaiswar07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-teal/40 hover:bg-teal/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm group-hover:text-teal transition-colors">
                      Instagram
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @ravi.jaiswar07
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/918976701006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-teal/40 hover:bg-teal/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm group-hover:text-teal transition-colors">
                      WhatsApp
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +91 89767 01006
                    </div>
                  </div>
                </a>
              </div>

              {/* Quick response promise */}
              <div className="p-5 rounded-2xl border border-teal/20 bg-teal/5">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 animate-pulse shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-1">
                      Quick Response
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      I typically respond within 24 hours. For urgent matters,
                      feel free to reach me directly on WhatsApp.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-foreground">
                Ravi Kumar Jaiswar
              </span>
              <span className="text-border">—</span>
              <span>Senior Sales Executive</span>
            </div>
            <div className="text-center">
              © {new Date().getFullYear()} Ravi Kumar Jaiswar. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
