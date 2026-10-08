import Script from "next/script";

export default function HomePage() {
  return (
    <>
      <main id="app" className="app-root">
        <div className="boot-screen" role="status" aria-live="polite">
          <span className="boot-mark" aria-hidden="true" />
          <span>Opening EYEFIND</span>
        </div>
      </main>
      <Script src="/app.js" type="module" strategy="afterInteractive" />
    </>
  );
}