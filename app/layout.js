import "./globals.css";

export const metadata = {
  title: "ColdMailAI - AI Cold Email Generator",
  description:
    "Generate hyper-personalized cold emails in seconds. 3x your reply rates with AI-powered outreach.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* Chat widget placeholder - add Crisp/Tawk.to ID later */}
      </body>
    </html>
  );
}
