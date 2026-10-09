import Script from "next/script";

export default function HomePage() {
  return (
    <>
      <div id="app" className="app-root">
        <div className="boot-screen" role="status" aria-live="polite">
          <span className="boot-mark" aria-hidden="true" />
          <span>Opening EYEFIND</span>
        </div>
      </div>
      <Script src="/app.js" type="module" strategy="afterInteractive" />
    </>
  );
}