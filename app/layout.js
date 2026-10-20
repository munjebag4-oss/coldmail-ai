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
        {/* Tawk.to Live Chat Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6ad7f89088f3d534cf48e51d/1k5dq5tht';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
