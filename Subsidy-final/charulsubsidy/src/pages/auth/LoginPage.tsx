import { useState, useRef } from "react";
import { Users, UserCog, Home, Search, Phone, Shield, Zap, Eye, MessageCircle, X, Send } from "lucide-react";
import { CitizenLogin } from "@/components/auth/CitizenLogin";
import { AdminLogin } from "@/components/auth/AdminLogin";

type RoleType = "citizen" | "admin" | null;

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Namaste! 🙏 I'm your Subsidy Portal assistant. How can I help you today?" }
  ]);

  const loginRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const chatbotRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToLogin = (role: RoleType) => {
    setSelectedRole(role);
    setTimeout(() => {
      loginRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleOpenChatbot = () => {
    setChatbotOpen(true);
    setTimeout(() => {
      chatbotRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    const botReply = { from: "bot", text: "Thank you for your query. Our team will assist you shortly. For urgent help, call 1800-XXX-XXXX." };
    setChatMessages(prev => [...prev, userMsg, botReply]);
    setChatInput("");
  };

  const AshokaCkakra = ({ size = 48, spokes = 24 }: { size?: number; spokes?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#FF9933" strokeWidth="3" />
      <circle cx="50" cy="50" r="8" fill="#000080" />
      <circle cx="50" cy="50" r="3.5" fill="#FF9933" />
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i * (360 / spokes) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={50 + 10 * Math.cos(a)} y1={50 + 10 * Math.sin(a)}
            x2={50 + 42 * Math.cos(a)} y2={50 + 42 * Math.sin(a)}
            stroke="#000080" strokeWidth="1.8"
          />
        );
      })}
    </svg>
  );

  const Tricolor = ({ w = "w-20", h = "h-1.5" }: { w?: string; h?: string }) => (
    <div className={`flex gap-0 rounded overflow-hidden ${w} ${h}`}>
      <div className="flex-1" style={{ background: "#FF9933" }} />
      <div className="flex-1 bg-white" />
      <div className="flex-1" style={{ background: "#138808" }} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Segoe UI', 'Noto Sans', sans-serif" }}>

      {/* ── TOP TRICOLOR STRIPE ── */}
      <div className="flex h-1.5">
        <div className="flex-1" style={{ background: "#FF9933" }} />
        <div className="flex-1 bg-white" />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>

      {/* ── BRANDING BAR ── */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ background: "linear-gradient(90deg,#061530 0%,#0f2d5e 50%,#061530 100%)" }}
      >
        <div className="flex items-center gap-4">
          <AshokaCkakra size={48} />
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs border-2"
            style={{ borderColor: "#FF9933", background: "#0f2d5e" }}
          >
            भारत
          </div>
          <div className="border-l border-white/20 pl-4">
            <div className="text-white font-bold text-base leading-tight tracking-wide">
              Subsidy Fraud Detection System
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#FF9933" }}>
              Government of India Portal · भारत सरकार
            </div>
          </div>
        </div>
        <a
          href="tel:1800XXXXXXX"
          className="flex items-center gap-2 text-xs px-4 py-2 rounded border transition-all"
          style={{ borderColor: "#FF9933", color: "#FF9933", background: "rgba(255,153,51,0.12)" }}
        >
          <Phone className="w-3.5 h-3.5" />
          Helpline: 1800-XXX-XXXX
        </a>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ background: "#1a3a6e" }}>
        <div className="flex items-center px-6 h-11 gap-1 text-sm text-white">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 px-4 py-2 rounded hover:bg-white/10 transition"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          <button onClick={() => handleScrollToLogin("citizen")} className="px-4 py-2 rounded hover:bg-white/10 transition">
            Apply for Subsidy
          </button>
          <button onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })} className="px-4 py-2 rounded hover:bg-white/10 transition">
            Track Application
          </button>
          <button onClick={() => handleScrollToLogin("admin")} className="px-4 py-2 rounded hover:bg-white/10 transition">
            Admin Login
          </button>
          {/* CHATBOT NAV — now properly opens chatbot */}
          <button onClick={handleOpenChatbot} className="px-4 py-2 rounded hover:bg-white/10 transition flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" /> Chatbot
          </button>
          <div className="ml-auto"><Search className="w-4 h-4 text-white/50" /></div>
        </div>
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,#FF9933,#FFD700,#138808)" }} />
      </nav>

      {/* ── HERO ── (no left strip) */}
      <section className="relative flex items-center text-white overflow-hidden" style={{ minHeight: 460 }}>
        <img
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070"
          alt="Parliament of India"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(105deg,rgba(6,21,48,0.94) 0%,rgba(6,21,48,0.78) 50%,rgba(19,136,8,0.20) 100%)" }}
        />

        <div className="relative z-10 px-14 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-6 font-semibold tracking-widest uppercase"
            style={{ background: "rgba(255,153,51,0.15)", border: "1px solid #FF9933", color: "#FF9933" }}
          >
            🇮🇳 &nbsp;Official Government Portal
          </div>

          <h1 className="text-4xl font-extrabold leading-snug mb-4 tracking-tight">
            Secure and Transparent<br />
            <span style={{ color: "#FF9933" }}>Subsidy Distribution</span>
          </h1>

          <p className="text-gray-300 mb-8 text-sm leading-relaxed max-w-lg">
            Apply for government welfare schemes with AI-powered fraud detection.
            Ensuring every rupee reaches the right citizen.
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleScrollToLogin("citizen")}
              className="flex items-center gap-2 px-7 py-3 rounded font-bold text-sm transition-all shadow-lg hover:scale-105"
              style={{ background: "linear-gradient(135deg,#138808,#0a5c04)", color: "#fff" }}
            >
              Apply Now &rarr;
            </button>
            <button
              onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 rounded font-semibold text-sm border transition-all hover:bg-white/10"
              style={{ borderColor: "#FF9933", color: "#FF9933" }}
            >
              Learn More
            </button>
          </div>

          <div className="mt-8">
            <Tricolor w="w-24" h="h-1.5" />
          </div>
        </div>
      </section>

      {/* ── SELECT YOUR ROLE ── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#fdf6ec 0%,#fff9f2 40%,#f0f5ff 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg,#FF9933 0,#FF9933 1px,transparent 0,transparent 50%)", backgroundSize: "18px 18px" }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg,#FF9933 33%,#fff 33%,#fff 66%,#138808 66%)" }} />

        <div className="relative z-10 text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF9933" }}>
            — Portal Access —
          </p>
          <h2 className="text-3xl font-extrabold" style={{ color: "#0a1f44" }}>
            Select Your Role
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#666" }}>
            Choose how you want to access the portal
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: "#FF9933" }} />
            <AshokaCkakra size={28} spokes={24} />
            <div className="h-px w-16" style={{ background: "#138808" }} />
          </div>
        </div>

        {/* Cards — gap-4 to move them closer */}
        <div className="relative z-10 flex flex-col md:flex-row justify-center gap-10 px-8">

          {/* Citizen Card */}
          <div
            onClick={() => handleScrollToLogin("citizen")}
            className="cursor-pointer w-64  rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: "linear-gradient(145deg,#0a4d2e,#1a7a4a,#0f5c36)",
              boxShadow: "0 10px 40px rgba(19,136,8,0.28), inset 0 1px 0 rgba(255,255,255,0.1)"
            }}
          >
            <div className="h-1" style={{ background: "linear-gradient(90deg,#FF9933,#FFD700)" }} />
            <div className="p-8 text-center text-white">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)" }}
              >
                <Users className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-xl font-extrabold mb-2 tracking-wide">Citizen</h3>
              <div className="h-px my-3 mx-8" style={{ background: "rgba(255,255,255,0.18)" }} />
              <p className="text-green-100 text-xs leading-relaxed">
                Apply for subsidies and track your applications with ease
              </p>
              <div
                className="mt-5 inline-block text-xs px-4 py-1.5 rounded-full font-semibold"
                style={{ background: "rgba(255,153,51,0.2)", color: "#FFD700", border: "1px solid rgba(255,153,51,0.35)" }}
              >
                Click to Login →
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => handleScrollToLogin("admin")}
            className="cursor-pointer w-64 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: "linear-gradient(145deg,#061530,#1a3a6e,#0f2857)",
              boxShadow: "0 10px 40px rgba(10,31,68,0.38), inset 0 1px 0 rgba(255,255,255,0.1)"
            }}
          >
            <div className="h-1" style={{ background: "linear-gradient(90deg,#FF9933,#FFD700)" }} />
            <div className="p-8 text-center text-white">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)" }}
              >
                <UserCog className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-xl font-extrabold mb-2 tracking-wide">Administrator</h3>
              <div className="h-px my-3 mx-8" style={{ background: "rgba(255,255,255,0.18)" }} />
              <p className="text-blue-100 text-xs leading-relaxed">
                Manage applications and detect fraud using AI tools
              </p>
              <div
                className="mt-5 inline-block text-xs px-4 py-1.5 rounded-full font-semibold"
                style={{ background: "rgba(255,153,51,0.2)", color: "#FFD700", border: "1px solid rgba(255,153,51,0.35)" }}
              >
                Click to Login →
              </div>
            </div>
          </div>
        </div>

        {/* LOGIN PANEL */}
        {selectedRole && (
          <div ref={loginRef} className="relative z-10 mt-16 px-6 max-w-5xl mx-auto">
            <button
              onClick={() => setSelectedRole(null)}
              className="mb-5 flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg transition-all"
              style={{ background: "#0a1f44", color: "#fff" }}
            >
              ← Back
            </button>

            <div
              className="flex flex-col md:flex-row rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(10,31,68,0.22)", border: "1.5px solid rgba(255,153,51,0.18)" }}
            >
              {/* Indian image side */}
              <div className="relative md:w-5/12 min-h-[400px] flex-shrink-0 overflow-hidden">
                <img
                  src={
                    selectedRole === "citizen"
                      ? "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=900"
                      : "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=900"
                  }
                  alt="India"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: selectedRole === "citizen"
                      ? "linear-gradient(155deg,rgba(10,77,46,0.90) 0%,rgba(19,136,8,0.72) 100%)"
                      : "linear-gradient(155deg,rgba(6,21,48,0.93) 0%,rgba(26,58,110,0.80) 100%)"
                  }}
                />
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "linear-gradient(180deg,#FF9933,#FFD700,#FF9933)" }} />

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-white text-center min-h-[400px]">
                  <AshokaCkakra size={68} spokes={24} />
                  <h3 className="text-2xl font-extrabold mt-5 mb-3 tracking-wide">
                    {selectedRole === "citizen" ? "Citizen Portal" : "Admin Portal"}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed max-w-xs">
                    {selectedRole === "citizen"
                      ? "Access government subsidies securely. Serving crores of Indians with dignity and transparency."
                      : "Protect public funds. Verify, monitor and secure subsidy distribution across India."}
                  </p>
                  <div className="mt-7">
                    <Tricolor w="w-20" h="h-1.5" />
                  </div>
                  <p className="mt-3 text-white/40 text-xs tracking-widest uppercase">भारत सरकार</p>
                </div>
              </div>

              {/* Form side */}
              <div className="flex-1 bg-white p-8 md:p-10">
                {selectedRole === "citizen" && <CitizenLogin />}
                {selectedRole === "admin" && <AdminLogin />}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg,#138808 33%,#fff 33%,#fff 66%,#FF9933 66%)" }} />
      </section>

      {/* ── CHATBOT SECTION ── */}
      {chatbotOpen && (
        <section ref={chatbotRef} className="py-16 px-6" style={{ background: "#f4f7ff" }}>
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1.5px solid rgba(255,153,51,0.25)" }}
            >
              {/* Chatbot header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ background: "linear-gradient(90deg,#0a1f44,#1a3a6e)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#FF9933" }}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Subsidy Portal Assistant</div>
                    <div className="text-xs" style={{ color: "#FF9933" }}>🟢 Online · भारत सरकार</div>
                  </div>
                </div>
                <button onClick={() => setChatbotOpen(false)} className="text-white/60 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tricolor strip */}
              <div className="flex h-1">
                <div className="flex-1" style={{ background: "#FF9933" }} />
                <div className="flex-1 bg-white" />
                <div className="flex-1" style={{ background: "#138808" }} />
              </div>

              {/* Messages */}
              <div className="bg-white px-6 py-5 space-y-4" style={{ minHeight: 280, maxHeight: 340, overflowY: "auto" }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="px-4 py-2.5 rounded-2xl text-sm max-w-xs leading-relaxed"
                      style={
                        msg.from === "user"
                          ? { background: "#1a3a6e", color: "#fff", borderBottomRightRadius: 4 }
                          : { background: "#f0f5ff", color: "#0a1f44", border: "1px solid rgba(26,58,110,0.12)", borderBottomLeftRadius: 4 }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleChatSend()}
                  placeholder="Type your question here…"
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl border outline-none focus:ring-2"
                  style={{ borderColor: "#d0d7e8", background: "#fff" }}
                />
                <button
                  onClick={handleChatSend}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: "#FF9933" }}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT ── */}
      <section
        ref={aboutRef}
        className="relative py-20 px-6 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg,#061530 0%,#1a3a6e 50%,#061530 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#FF9933 0,#FF9933 1px,transparent 0,transparent 50%)", backgroundSize: "18px 18px" }}
        />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg,#FF9933 33%,#fff 33%,#fff 66%,#138808 66%)" }} />

        <div className="relative z-10 text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF9933" }}>
            — Our Mission —
          </p>
          <h2 className="text-3xl font-extrabold">About This System</h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: "#FF9933" }} />
            <AshokaCkakra size={28} spokes={24} />
            <div className="h-px w-16" style={{ background: "#138808" }} />
          </div>
          <p className="max-w-2xl mx-auto text-gray-300 mt-6 text-sm leading-relaxed">
            This system ensures transparency in subsidy distribution using AI-based fraud detection.
            It identifies duplicate applications and ensures only eligible citizens receive benefits.
          </p>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <Shield className="w-7 h-7" />, color: "#138808", title: "Secure System", desc: "Government-grade encryption and multi-layer security protects every citizen's data." },
            { icon: <Eye className="w-7 h-7" />, color: "#FF9933", title: "Fraud Detection", desc: "AI and rule-based engines detect fake and duplicate subsidy claims in real time." },
            { icon: <Zap className="w-7 h-7" />, color: "#FFD700", title: "Fast Processing", desc: "Applications are verified quickly and results communicated transparently." },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${f.color}44`, boxShadow: `0 4px 24px ${f.color}14` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ background: `${f.color}20`, border: `2px solid ${f.color}` }}
              >
                <span style={{ color: f.color }}>{f.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="h-1" style={{ background: "linear-gradient(90deg,#FF9933 33%,#fff 33%,#fff 66%,#138808 66%)" }} />
      <footer style={{ background: "#061530" }} className="py-6 text-center">
        <p className="text-white/80 text-sm font-medium">© 2024 Government of India. All rights reserved. | भारत सरकार</p>
        <p className="text-white/45 text-xs mt-1">Helpline: 1800-XXX-XXXX &nbsp;|&nbsp; support@subsidyportal.gov.in</p>
      </footer>
    </div>
  );
}