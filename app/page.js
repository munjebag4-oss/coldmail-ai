"use client";
import { useState, useEffect } from "react";

/* ───────── LANDING SECTION ───────── */
function Landing({ onTryNow }) {
  return (
    <section className="max-w-3xl mx-auto text-center pt-20 pb-16 px-6">
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        AI-Powered Cold Outreach
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
        Write cold emails that
        <br />
        <span className="text-indigo-400">actually get replies</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
        Paste your prospect info, get a hyper-personalized cold email in 5
        seconds. Now with follow-up sequences and saved history.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onTryNow}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
        >
          Try Free — No Signup
        </button>
        <span className="text-gray-500 text-sm">5 free emails / day</span>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
        <div><span className="text-white font-bold text-lg">5 sec</span><br />per email</div>
        <div className="w-px h-8 bg-gray-800" />
        <div><span className="text-white font-bold text-lg">3x</span><br />reply rate</div>
        <div className="w-px h-8 bg-gray-800" />
        <div><span className="text-white font-bold text-lg">$0</span><br />to start</div>
      </div>
    </section>
  );
}

/* ───────── GENERATOR SECTION ───────── */
function Generator() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    product: "",
    tone: "professional",
    customTone: "",
  });
  const [result, setResult] = useState("");
  const [followUps, setFollowUps] = useState([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const [uses, setUses] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const MAX_FREE = 5;

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("coldmail_history");
      if (saved) setHistory(JSON.parse(saved));
      const savedUses = localStorage.getItem("coldmail_uses");
      const savedDate = localStorage.getItem("coldmail_uses_date");
      const today = new Date().toDateString();
      if (savedDate === today && savedUses) {
        setUses(parseInt(savedUses));
      } else {
        localStorage.setItem("coldmail_uses_date", today);
        localStorage.setItem("coldmail_uses", "0");
      }
    } catch {}
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveToHistory = (email, company, role) => {
    const entry = { email, company, role, date: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    try { localStorage.setItem("coldmail_history", JSON.stringify(updated)); } catch {}
  };

  const generate = async () => {
    if (!form.company || !form.role || !form.product) return;
    if (uses >= MAX_FREE) return;

    setLoading(true);
    setResult("");
    setFollowUps([]);
    setShowFollowUp(false);
    setCopied(false);

    try {
      const toneValue = form.tone === "custom" ? form.customTone : form.tone;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tone: toneValue }),
      });
      const data = await res.json();
      if (data.email) {
        setResult(data.email);
        const newUses = uses + 1;
        setUses(newUses);
        try {
          localStorage.setItem("coldmail_uses", String(newUses));
          localStorage.setItem("coldmail_uses_date", new Date().toDateString());
        } catch {}
        saveToHistory(data.email, form.company, form.role);
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateFollowUp = async (sequenceNum) => {
    setFollowUpLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          followUp: true,
          sequenceNum,
          previousEmail: result,
        }),
      });
      const data = await res.json();
      if (data.email) {
        setFollowUps((prev) => [...prev, data.email]);
      }
    } catch {} finally {
      setFollowUpLoading(false);
    }
  };

  const copy = (text, idx = -1) => {
    navigator.clipboard.writeText(text);
    if (idx === -1) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    else { setCopiedIdx(idx); setTimeout(() => setCopiedIdx(-1), 2000); }
  };

  return (
    <section id="generator" className="max-w-2xl mx-auto px-6 pb-12 fade-in">
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Generate Your Email</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showHistory ? "Close History" : `History (${history.length})`}
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-6 max-h-60 overflow-y-auto space-y-2 fade-in">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">No saved emails yet.</p>
            ) : (
              history.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 cursor-pointer hover:border-indigo-500/30 transition-colors"
                  onClick={() => { setResult(item.email); setShowHistory(false); }}
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{item.company} — {item.role}</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{item.email.substring(0, 80)}...</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
              Prospect&apos;s Company
            </label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Stripe, Shopify, a local bakery..."
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
              Recipient&apos;s Role
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Head of Sales, Marketing Manager, CEO..."
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
              What You&apos;re Offering
            </label>
            <textarea
              name="product"
              value={form.product}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. AI chatbot that handles customer support 24/7..."
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
              Tone
            </label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual & Friendly</option>
              <option value="bold">Bold & Direct</option>
              <option value="curious">Curious & Intriguing</option>
              <option value="custom">Custom Tone...</option>
            </select>
          </div>
          {form.tone === "custom" && (
            <div className="fade-in">
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                Describe Your Tone
              </label>
              <input
                name="customTone"
                value={form.customTone}
                onChange={handleChange}
                placeholder="e.g. Witty and humorous, like talking to a friend..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading || !form.company || !form.role || !form.product || uses >= MAX_FREE}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="loading-dot w-1.5 h-1.5 bg-white rounded-full" /><span className="loading-dot w-1.5 h-1.5 bg-white rounded-full" /><span className="loading-dot w-1.5 h-1.5 bg-white rounded-full" /></>
            ) : uses >= MAX_FREE ? (
              "Free limit reached — Upgrade to Pro"
            ) : (
              `Generate Email (${MAX_FREE - uses} free left)`
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Your Email</span>
              <button onClick={() => copy(result)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                {copied ? "✓ Copied!" : "Copy to clipboard"}
              </button>
            </div>
            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
              {result}
            </div>

            {/* Follow-up Sequence */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => { setShowFollowUp(true); if (followUps.length === 0) generateFollowUp(2); }}
                disabled={followUpLoading}
                className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
              >
                {followUpLoading ? "Generating..." : "Generate Follow-up Sequence"}
              </button>
            </div>

            {/* Follow-ups */}
            {showFollowUp && followUps.map((fu, i) => (
              <div key={i} className="mt-4 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Follow-up #{i + 1} ({i === 0 ? "3 days later" : "7 days later"})
                  </span>
                  <button onClick={() => copy(fu, i)} className="text-xs text-indigo-400 hover:text-indigo-300">
                    {copiedIdx === i ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {fu}
                </div>
              </div>
            ))}
            {showFollowUp && followUps.length < 2 && followUps.length > 0 && (
              <button
                onClick={() => generateFollowUp(3)}
                disabled={followUpLoading}
                className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                {followUpLoading ? "Generating..." : "+ Generate 2nd Follow-up"}
              </button>
            )}
          </div>
        )}

        {/* Upgrade CTA */}
        {uses >= MAX_FREE && (
          <div className="mt-6 text-center fade-in">
            <p className="text-gray-500 text-sm mb-3">Unlock unlimited emails + follow-up sequences for just $9/month</p>
            <a href={process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIBE_URL || "#"} className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
              Upgrade to Pro — $9/mo
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── PRICING SECTION ───────── */
function Pricing() {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-20">
      <h2 className="text-2xl font-bold text-center mb-8">Simple Pricing</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <div className="text-sm text-gray-500 mb-1">Free</div>
          <div className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-gray-500">/mo</span></div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> 5 emails per day</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> All tones & styles</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> No signup required</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Email history (local)</li>
          </ul>
        </div>
        <div className="bg-[#12121a] border-2 border-indigo-500/50 rounded-xl p-6 relative">
          <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">POPULAR</div>
          <div className="text-sm text-gray-500 mb-1">Pro</div>
          <div className="text-3xl font-bold mb-4">$9<span className="text-base font-normal text-gray-500">/mo</span></div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Unlimited emails</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Follow-up sequences (2-3 emails)</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Custom tone settings</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Full email history</li>
            <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Priority support</li>
          </ul>
          <a href={process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIBE_URL || "#"} className="block mt-6 bg-indigo-500 hover:bg-indigo-600 text-white text-center font-semibold py-2.5 rounded-lg transition-colors text-sm">
            Start Pro — $9/mo
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ SECTION ───────── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "How does ColdMailAI work?", a: "Enter the prospect's company name, their role, and what you're offering. Choose a tone, click Generate, and get a personalized cold email in seconds. The AI analyzes the context and crafts a compelling message tailored to your prospect." },
    { q: "Is it really free?", a: "Yes! You get 5 free email generations per day with no signup required. If you need unlimited emails and follow-up sequences, upgrade to Pro for $9/month." },
    { q: "What are follow-up sequences?", a: "After generating your initial email, you can generate 2 follow-up emails that reference the original. Perfect for when prospects don't reply to your first email." },
    { q: "Can I customize the tone?", a: "Yes! Choose from Professional, Casual, Bold, or Curious. You can also select 'Custom Tone' and describe exactly how you want the email to sound." },
    { q: "How do I upgrade to Pro?", a: "Click any 'Upgrade to Pro' button on the site. You'll be redirected to PayPal to set up a $9/month subscription." },
    { q: "Are the generated emails saved?", a: "Yes, your emails are saved locally in your browser. Click 'History' in the generator to view and reuse previous emails." },
    { q: "Is my data stored on your servers?", a: "No. We don't store your inputs or generated emails on our servers. History is saved only in your browser's local storage." },
  ];
  return (
    <section className="max-w-2xl mx-auto px-6 pb-20">
      <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:text-indigo-300 transition-colors">
              {faq.q}
              <span className="text-gray-500 ml-2">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (<div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed fade-in">{faq.a}</div>)}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] py-8 text-center text-xs text-gray-600">
      © {new Date().getFullYear()} ColdMailAI. Built with AI, for humans who sell.
    </footer>
  );
}

/* ───────── MAIN PAGE ───────── */
export default function Home() {
  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="font-bold text-lg"><span className="text-indigo-400">Cold</span>MailAI</div>
        <a href={process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIBE_URL || "#"} className="text-sm text-gray-400 hover:text-white transition-colors">Upgrade to Pro</a>
      </nav>
      <Landing onTryNow={scrollToGenerator} />
      <Generator />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
