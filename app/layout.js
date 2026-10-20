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
        {/* Crisp AI Chat Widget - Free customer support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="pending-setup";
              (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
