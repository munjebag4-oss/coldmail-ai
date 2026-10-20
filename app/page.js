"use client";
import { useState } from "react";

/* ───────── LANDING SECTION ───────── */
function Landing({ onTryNow }) {
  return (
    <section className="max-w-3xl mx-auto text-center pt-20 pb-16 px-6">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        AI-Powered Cold Outreach
      </div>

      {/* Hero */}
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
        Write cold emails that
        <br />
        <span className="text-indigo-400">actually get replies</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
        Paste your prospect info, get a hyper-personalized cold email in 5
        seconds. No templates. No cringe. Just emails people want to read.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onTryNow}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
        >
          Try Free — No Signup
        </button>
        <span className="text-gray-500 text-sm">3 free emails / day</span>
      </div>

      {/* Social proof */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
        <div>
          <span className="text-white font-bold text-lg">5 sec</span>
          <br />
          per email
        </div>
        <div className="w-px h-8 bg-gray-800" />
        <div>
          <span className="text-white font-bold text-lg">3x</span>
          <br />
          reply rate
        </div>
        <div className="w-px h-8 bg-gray-800" />
        <div>
          <span className="text-white font-bold text-lg">$0</span>
          <br />
          to start
        </div>
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
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uses, setUses] = useState(0);
  const MAX_FREE = 3;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    if (!form.company || !form.role || !form.product) return;
    if (uses >= MAX_FREE) return;

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.email) {
        setResult(data.email);
        setUses((u) => u + 1);
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="generator"
      className="max-w-2xl mx-auto px-6 pb-20 fade-in"
    >
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6">Generate Your Email</h2>

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
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={
              loading ||
              !form.company ||
              !form.role ||
              !form.product ||
              uses >= MAX_FREE
            }
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="loading-dot w-1.5 h-1.5 bg-white rounded-full" />
                <span className="loading-dot w-1.5 h-1.5 bg-white rounded-full" />
                <span className="loading-dot w-1.5 h-1.5 bg-white rounded-full" />
              </>
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
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Your Email
              </span>
              <button
                onClick={copy}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy to clipboard"}
              </button>
            </div>
            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
              {result}
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        {uses >= MAX_FREE && (
          <div className="mt-6 text-center fade-in">
            <p className="text-gray-500 text-sm mb-3">
              Unlock unlimited emails for just $29/month
            </p>
            <a
              href={process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIBE_URL || "#"}
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Upgrade to Pro — $29/mo
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
        {/* Free */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <div className="text-sm text-gray-500 mb-1">Free</div>
          <div className="text-3xl font-bold mb-4">
            $0<span className="text-base font-normal text-gray-500">/mo</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> 3 emails per day
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> All tones & styles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> No signup required
            </li>
          </ul>
        </div>
        {/* Pro */}
        <div className="bg-[#12121a] border-2 border-indigo-500/50 rounded-xl p-6 relative">
          <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
            POPULAR
          </div>
          <div className="text-sm text-gray-500 mb-1">Pro</div>
          <div className="text-3xl font-bold mb-4">
            $29<span className="text-base font-normal text-gray-500">/mo</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Unlimited emails
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> All tones & styles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Follow-up sequences
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Priority support
            </li>
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIBE_URL || "#"}
            className="block mt-6 bg-indigo-500 hover:bg-indigo-600 text-white text-center font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Start Pro — $29/mo
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
    {
      q: "How does ColdMailAI work?",
      a: "Enter the prospect's company name, their role, and what you're offering. Choose a tone, click Generate, and get a personalized cold email in seconds. The AI analyzes the context and crafts a compelling message tailored to your prospect."
    },
    {
      q: "Is it really free?",
      a: "Yes! You get 3 free email generations per day with no signup required. If you need unlimited emails, upgrade to Pro for \$29/month."
    },
    {
      q: "How do I upgrade to Pro?",
      a: "Click any 'Upgrade to Pro' button on the site. You'll be redirected to PayPal to set up a \$29/month subscription. Once confirmed, you'll get unlimited access."
    },
    {
      q: "Can I cancel my Pro subscription?",
      a: "Yes, anytime. Log into PayPal, go to Settings > Payments > Manage Automatic Payments, and cancel ColdMailAI. No questions asked."
    },
    {
      q: "Are the generated emails unique?",
      a: "Every email is generated fresh by AI based on your specific inputs. No two emails are the same, even with identical inputs."
    },
    {
      q: "What languages are supported?",
      a: "ColdMailAI works best in English but can generate emails in most major languages. Just write your offering in your preferred language."
    },
    {
      q: "Is my data stored?",
      a: "No. We don't store your inputs or generated emails. Everything is processed in real-time and discarded after generation."
    },
  ];

  return (
    <section className="max-w-2xl mx-auto px-6 pb-20">
      <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:text-indigo-300 transition-colors"
            >
              {faq.q}
              <span className="text-gray-500 ml-2">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed fade-in">
                {faq.a}
              </div>
            )}
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
      © {new Date().getFullYear()} ColdMailAI. Built with AI, for humans who
      sell.
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
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="font-bold text-lg">
          <span className="text-indigo-400">Cold</span>MailAI
        </div>
        <a
          href={process.env.NEXT_PUBLIC_PAYPAL_SUBSCRIBE_URL || "#"}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Upgrade to Pro
        </a>
      </nav>

      <Landing onTryNow={scrollToGenerator} />
      <Generator />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}

