import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Dishaara collects, uses, and protects your information while navigating India's Union Territories.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container section-spacing" role="main">
      <div className="section-header" style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
        <h1 className="font-serif" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "16px" }}>
          Privacy Policy
        </h1>
        <p className="lead-text">
          Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: 1.8, fontSize: "1rem" }}>
        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            1. Introduction
          </h2>
          <p>
            Welcome to Dishaara, the official smart tourism and life safety platform for India's 8 Union Territories. We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, and share information when you use our web application.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            2. Information We Collect
          </h2>
          <p>
            We strictly limit the data we collect to what is necessary for providing you with a seamless and intelligent travel experience.
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "12px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Device and Usage Data:</strong> We automatically collect standard diagnostic and usage information (such as IP address, browser type, and interactions) to maintain application stability and performance.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Local Storage:</strong> We use your browser's LocalStorage to save your preferences, theme choices, and temporary itinerary drafts. This data remains on your device.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            3. AI Disclosure (Yatra AI)
          </h2>
          <p>
            Dishaara integrates <strong>Yatra AI</strong>, an intelligent travel companion powered by Large Language Models (LLMs), to assist you with itinerary planning, tourism intelligence, and safety information.
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "12px" }}>
            <li style={{ marginBottom: "8px" }}>
              When you interact with Yatra AI, your prompt inputs are processed by external AI endpoints to generate responses.
            </li>
            <li style={{ marginBottom: "8px" }}>
              We strongly advise you <strong>not</strong> to submit sensitive Personally Identifiable Information (PII) such as passport numbers, exact home addresses, or financial details into the Yatra AI chat.
            </li>
            <li style={{ marginBottom: "8px" }}>
              AI interactions are temporarily processed for the duration of your session to provide contextual travel recommendations and are not used to permanently train our foundational AI models.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            4. Third-Party Services
          </h2>
          <p>
            To deliver an immersive experience, Dishaara utilizes specific third-party services:
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "12px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Google Maps API & OpenStreetMap:</strong> Used to render interactive 3D geospatial maps, navigation routes, and topographical features. These providers may collect IP addresses and location data subject to their respective privacy policies.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Unsplash:</strong> Used to serve high-quality photographic assets of Union Territory destinations.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            5. Data Security & Storage
          </h2>
          <p>
            We implement appropriate technical and organizational security measures to protect the integrity of the tourism and safety data presented to you. User-generated itineraries and preferences are primarily stored locally on your device unless explicitly saved to an authenticated cloud vault (where applicable).
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            6. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--color-accent)" }}>
            7. Contact Us
          </h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact the Dishaara administrative team or utilize the National Tourist Helpline (1363).
          </p>
        </section>
      </div>
    </main>
  );
}
