import React, { useEffect } from 'react';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Phone, Mail, MapPin, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  setCurrentView: (view: string) => void;
  onOpenQuoteModal: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  setCurrentView,
  onOpenQuoteModal,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-neutral-900 text-white py-14 sm:py-16 border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-800/80">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Protection & Privacy Standard</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
            Last Updated: January 2026 • Hashir Rice Supplier (Noor Galla Mandi, Bucheki, Nankana Sahib, Punjab, Pakistan)
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-neutral-800 space-y-10 text-sm sm:text-base leading-relaxed">
        {/* Quick Summary Box */}
        <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-950 font-serif font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
            <span>Commitment to Trade Confidentiality</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-700 leading-normal">
            At <strong>Hashir Rice Supplier</strong> (operating from Noor Galla Mandi, Bucheki, Pakistan), we respect the privacy of our wholesale clients, grain buyers, restaurant operators, and exporter partners. We collect only the information necessary to provide accurate rice quotations, coordinate free physical cooking sample shipments, and arrange secure bilty freight delivery. We do not sell or rent commercial trade data to third parties.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            1. Information We Collect
          </h2>
          <p>
            When you interact with our website, request a bulk quotation, order a cooking sample, or contact our trade desk via WhatsApp, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Contact Details:</strong> Full Name, Business/Trading Name, WhatsApp Number, Phone Number, and Email Address.</li>
            <li><strong>Sourcing Requirements:</strong> Desired rice variety (e.g., 1121 Kainat Steam, Super Kernel Basmati, IRRI-6), expected tonnage volume, packaging preference (25kg/50kg PP, Non-woven, Jute), and target delivery city.</li>
            <li><strong>Delivery Address:</strong> Complete business, warehouse, or wholesale mandi delivery address (for courier dispatch of free physical cooking samples and freight coordination).</li>
            <li><strong>Technical Log Data:</strong> Standard web analytics information such as browser type, device specifications, IP address, referring URL, and approximate geographic location to improve website responsiveness.</li>
          </ul>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            2. How We Use Collected Data
          </h2>
          <p>
            Your information is used strictly for legitimate commercial and trade-facilitation purposes, including:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <strong className="text-neutral-900 block font-semibold">Quotation & Spot Pricing:</strong>
              <span className="text-neutral-600">Calculating real-time mandi rates, ex-mill prices, packaging fees, and multi-axle freight estimates for your city.</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <strong className="text-neutral-900 block font-semibold">Sample Requisition Fulfillment:</strong>
              <span className="text-neutral-600">Generating courier dispatch slips (TCS, Leopard, Daewoo FastEx) to courier free physical cooking sample bags to your doorstep.</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <strong className="text-neutral-900 block font-semibold">Bilty Logistics Coordination:</strong>
              <span className="text-neutral-600">Coordinating multi-axle trailers, tracking weighbridge slips, and sharing live bilty numbers for secure cargo receiving.</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <strong className="text-neutral-900 block font-semibold">Market Updates & Price Intelligence:</strong>
              <span className="text-neutral-600">Sending seasonal paddy harvest alerts, export trend briefings, and weekly Punjab mandi price movements upon client request.</span>
            </div>
          </div>
        </section>

        {/* Section 3: Third-Party Disclosures & Logistics Partners */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            3. Information Sharing & Third-Party Disclosure
          </h2>
          <p>
            Hashir Rice Supplier operates with absolute integrity. We do not sell, trade, or monetize your contact or commercial details. We share details solely with necessary service entities required to fulfill your order:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Logistics & Freight Transporters:</strong> Truck drivers and bilty transport booking offices receive destination city, warehouse address, receiver contact name, and phone number to coordinate offloading.</li>
            <li><strong>Courier Services:</strong> Courier partners receive recipient name, address, and mobile number to deliver physical sample packages.</li>
            <li><strong>Legal & Regulatory Authorities:</strong> In rare cases where disclosure is required by Pakistani law, tax authorities, or court order to enforce commercial contracts.</li>
          </ul>
        </section>

        {/* Section 4: Cookies, Google AdSense & Third-Party Advertising Technologies */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            4. Cookies, Google AdSense & Third-Party Advertising
          </h2>
          <p>
            Our website uses cookies, web beacons, and client-side storage to improve your browsing experience, remember preferences, and serve relevant content and advertisements.
          </p>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs sm:text-sm text-neutral-800">
            <strong className="block text-amber-950 font-bold font-serif text-base">
              Google AdSense & DoubleClick DART Cookie Disclosure
            </strong>
            <p>
              Google is one of our third-party advertising vendors. Google uses cookies, known as <strong>DART cookies</strong>, to serve advertisements to visitors of <em>hashirricesupplier.com</em> based upon their visits to this site and other websites across the Internet.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 text-xs">
              <li>
                <strong>Personalized Advertising:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.
              </li>
              <li>
                <strong>Third-Party Ad Networks:</strong> Third-party ad networks or ad servers use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on Hashir Rice Supplier. These technologies measure the effectiveness of advertising campaigns and personalize the advertising content you see.
              </li>
              <li>
                <strong>No Access to Personal Identity:</strong> Hashir Rice Supplier has no access to or control over these cookies used by third-party advertisers.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs sm:text-sm">
            <strong className="block text-emerald-950 font-semibold">How to Opt Out of Personalized Advertising</strong>
            <p className="text-neutral-700">
              Users may opt out of personalized advertising by visiting:
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:underline bg-white px-3 py-1.5 rounded-lg border border-emerald-300"
              >
                <span>Google Ads Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:underline bg-white px-3 py-1.5 rounded-lg border border-emerald-300"
              >
                <span>AboutAds.info Opt-Out</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.networkadvertising.org/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:underline bg-white px-3 py-1.5 rounded-lg border border-emerald-300"
              >
                <span>Network Advertising Initiative (NAI)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Section 4.5: CCPA & GDPR User Data Rights */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            5. CCPA & GDPR Privacy Rights (California & European Users)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and the General Data Protection Regulation (GDPR), users are entitled to the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Right to Know / Access:</strong> You have the right to request the specific pieces and categories of personal data we have collected about you.</li>
            <li><strong>Right to Deletion:</strong> You have the right to request the deletion of your personal data under certain conditions.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will never discriminate against you for exercising your privacy rights.</li>
            <li><strong>Right to Opt-Out of Sale:</strong> We do not sell your personal data to any third party.</li>
          </ul>
        </section>

        {/* Section 6: Data Security & Storage */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            6. Data Security Measures
          </h2>
          <p>
            We implement standard technical and organizational security measures to protect your inquiries and communications against unauthorized access, loss, or misuse. All website interactions are secured using Transport Layer Security (HTTPS/SSL encryption).
          </p>
        </section>

        {/* Section 7: Buyer Rights & Data Access */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            7. Your Privacy Rights
          </h2>
          <p>
            As a prospective or active client, you hold the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li>Request a copy of any personal or commercial information stored in our trade database.</li>
            <li>Request corrections or updates to your company details, delivery addresses, or billing records.</li>
            <li>Opt-out of promotional mandi rate broadcasts or seasonal harvest market updates at any time by messaging us on WhatsApp or sending an email.</li>
          </ul>
        </section>

        {/* Section 8: Contact Us for Privacy Concerns */}
        <section className="p-6 sm:p-8 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-950">
            8. Privacy Contact & Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            For questions, data access requests, or feedback regarding our privacy practices, please contact our administrative desk:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 bg-white rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900 font-semibold mb-1">Physical Office:</strong>
              <span className="text-neutral-600">Noor Galla Mandi, Bucheki, Nankana Sahib, Punjab, Pakistan</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900 font-semibold mb-1">WhatsApp / Phone:</strong>
              <div className="flex flex-col gap-0.5">
                <a href="https://wa.me/923338990883" className="text-emerald-900 hover:underline font-bold">
                  +92 333 8990883
                </a>
                <a href="https://wa.me/923002861297" className="text-emerald-900 hover:underline font-bold">
                  +92 300 2861297
                </a>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-neutral-200">
              <strong className="block text-neutral-900 font-semibold mb-1">Google Profile:</strong>
              <a href="https://share.google/Xog0BKr0oU1NiGIUL" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:underline inline-flex items-center gap-1 font-semibold">
                <span>Verified Listing</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Embedded Google Business Map */}
        <div className="pt-2">
          <GoogleBusinessMap
            cityName="Bucheki"
            province="Punjab"
            customHeading="Operational Trade Desk & Verification Office"
            customSubheading="Shop #4, Noor Galla Mandi, Bucheki, Nankana Sahib, Punjab, Pakistan"
            height="280px"
            showDetailsGrid={true}
          />
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('terms')}
              className="text-xs font-semibold text-emerald-900 hover:underline"
            >
              Read Terms & Conditions →
            </button>
            <button
              onClick={onOpenQuoteModal}
              className="px-4 py-2 rounded-lg bg-emerald-900 text-white font-bold text-xs hover:bg-emerald-950 transition-colors"
            >
              Request Bulk Rate Quote
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
