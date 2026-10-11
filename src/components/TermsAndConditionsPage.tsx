import React, { useEffect } from 'react';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import { FileText, ShieldCheck, Scale, AlertTriangle, CheckCircle2, Truck, DollarSign, Clock, HelpCircle, ArrowLeft, ExternalLink } from 'lucide-react';

interface TermsAndConditionsPageProps {
  setCurrentView: (view: string) => void;
  onOpenQuoteModal: () => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({
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
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>B2B Commercial Sourcing Terms</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Terms & Conditions
          </h1>

          <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
            Effective Date: January 2026 • Governing Bulk Rice Trading & Mandi Brokerage Operations across Pakistan
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-neutral-800 space-y-10 text-sm sm:text-base leading-relaxed">
        {/* Core Brokerage Disclosure */}
        <div className="p-6 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
            <span>Important Notice: Sourcing Intermediary & Brokerage Agency</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-800 leading-normal">
            <strong>Hashir Rice Supplier</strong> operates strictly as a commercial rice sourcing intermediary and trade brokerage firm situated at Noor Galla Mandi, Bucheki (Punjab, Pakistan). We work in close partnership with verified, modern Sortex rice milling facilities across Punjab and Sindh to arrange wholesale consignments conforming to agreed buyer specifications. We are not a single manufacturing mill owner.
          </p>
        </div>

        {/* Section 1: Applicability & Contract Formation */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            1. Scope and Agreement
          </h2>
          <p>
            These Commercial Terms and Conditions govern all wholesale price quotations, free sample requisitions, purchase contracts, and bilty consignments negotiated through Hashir Rice Supplier. By requesting a quotation, paying an advance deposit, or accepting delivery of cargo, the Buyer agrees to be bound by these terms.
          </p>
        </section>

        {/* Section 2: Commodity Pricing & Mandi Rate Validity */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            2. Spot Pricing, Mandi Fluctuations & Rate Validity
          </h2>
          <p>
            Rice is an actively traded agricultural commodity subject to daily auction volatility in Punjab and Sindh Galla Mandis:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Validity Window:</strong> Unless explicitly agreed in writing, all verbal or electronic price quotations are valid for a period of <strong>24 hours</strong> from issuance due to live paddy spot price fluctuations.</li>
            <li><strong>Rate Composition:</strong> Rates are generally quoted as <em>Ex-Mill (Net of Freight)</em> or <em>CNF (Cost and Freight Destination)</em> in Pakistani Rupees (PKR) per 40 KG (Maund) or per Metric Ton.</li>
            <li><strong>Taxes & Levies:</strong> Applicable municipal market committee cesses, provincial sales taxes, or withholding taxes (if applicable to the buyer entity) are handled in accordance with Pakistani tax law.</li>
          </ul>
        </section>

        {/* Section 3: Free Cooking Sample Policy */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            3. Free Sample Requisition & Daig Testing Protocol
          </h2>
          <p>
            To prevent mismatched expectations, Hashir Rice Supplier maintains a strict <strong>Sample-First Policy</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <strong className="text-neutral-900 block font-semibold">Representative Lot Drawing:</strong>
              <span className="text-neutral-600">Free sample bags are drawn directly from the active mill batch earmarked for the commercial lot.</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <strong className="text-neutral-900 block font-semibold">Daig Testing:</strong>
              <span className="text-neutral-600">Buyers are encouraged to conduct a live commercial test cook (water absorption, elongation, aroma) prior to final batch confirmation.</span>
            </div>
          </div>
        </section>

        {/* Section 4: Quality Specifications & Technical Tolerances */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            4. Quality Tolerances and Grade Specifications
          </h2>
          <p>
            Every commercial consignment is prepared according to standard commercial grade limits:
          </p>
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="min-w-full text-xs text-left divide-y divide-neutral-200">
              <thead className="bg-neutral-100 font-bold text-neutral-900">
                <tr>
                  <th className="p-3">Variety</th>
                  <th className="p-3">Avg. Raw Length</th>
                  <th className="p-3">Cooked Length</th>
                  <th className="p-3">Moisture Limit</th>
                  <th className="p-3">Broken Grain Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 bg-white">
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">1121 Kainat Steam</td>
                  <td className="p-3">8.35 mm</td>
                  <td className="p-3">22.00 mm+</td>
                  <td className="p-3">12.5% Max</td>
                  <td className="p-3">2.0% Max</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">1121 Golden / White Sella</td>
                  <td className="p-3">8.30 mm</td>
                  <td className="p-3">20.00 mm+</td>
                  <td className="p-3">13.0% Max</td>
                  <td className="p-3">2.0% Max</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">Super Kernel Basmati (Aged)</td>
                  <td className="p-3">7.30 mm</td>
                  <td className="p-3">15.50 mm+</td>
                  <td className="p-3">12.5% Max</td>
                  <td className="p-3">3.0% Max</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">PK-386 Fragrant Rice</td>
                  <td className="p-3">6.85 mm</td>
                  <td className="p-3">13.00 mm+</td>
                  <td className="p-3">13.0% Max</td>
                  <td className="p-3">4.0% Max</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">IRRI-6 Long Grain</td>
                  <td className="p-3">6.00 mm</td>
                  <td className="p-3">9.50 mm</td>
                  <td className="p-3">13.5% Max</td>
                  <td className="p-3">5.0% Max</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500 italic">
            * Natural crop variations within ±0.2mm length or ±0.5% broken ratio are recognized under standard Pakistan Rice Exporters Association (REAP) commercial tolerances.
          </p>
        </section>

        {/* Section 5: Order Confirmation & Payment Terms */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            5. Payment Terms & Order Confirmation
          </h2>
          <p>
            To secure allocated milling slots and container or trailer loading, standard B2B transaction methods apply:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Advance Token:</strong> A mutually agreed advance token (typically 10% to 20%) is required upon contract signing to lock the spot price and commence Sortex cleaning and packaging.</li>
            <li><strong>Bilty Pay-Order / Bank Transfer:</strong> Remaining balance is cleared upon presentation of the stamped Truck Goods Receipt (Bilty) and weighbridge verification slip prior to final unloading.</li>
            <li><strong>Institutional Orders:</strong> Verified corporate buyers and export houses may qualify for Letter of Credit (LC at sight) or structured bank guarantees.</li>
          </ul>
        </section>

        {/* Section 6: Freight, Bilty Logistics & Delivery Risk */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            6. Freight Logistics, Weighbridge Audit & In-Transit Liability
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Weighbridge Proof:</strong> Consignments are weighed on digital certified weighbridges at the dispatch origin. Certified scale tickets accompany the driver.</li>
            <li><strong>Transit Insurance:</strong> Unless comprehensive marine/inland transit insurance is contracted by the buyer, road transit risks (force majeure, highway disruptions, severe inclement weather) are governed by carrier bilty terms.</li>
            <li><strong>Offloading:</strong> Unloading labor at destination warehouse or mandi godown is the responsibility of the receiving buyer unless door-delivery labor was pre-contracted.</li>
          </ul>
        </section>

        {/* Section 7: Inspection, Claims & Dispute Resolution */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 border-b border-neutral-200 pb-2">
            7. Inspection Window & Dispute Resolution
          </h2>
          <p>
            Buyers are required to inspect bag stitch seals, stitch integrity, and grain appearance upon truck arrival:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-xs sm:text-sm">
            <li><strong>Notification Window:</strong> Any discrepancies in bag count or apparent water damage must be endorsed on the delivery copy of the bilty and reported within <strong>48 hours</strong> of truck arrival.</li>
            <li><strong>Arbitration:</strong> In the unlikely event of a technical quality dispute that cannot be resolved amicably, matters are referred to trade arbitration under the Punjab Agricultural Produce Markets Act and Pakistani Commercial Arbitration Law.</li>
          </ul>
        </section>

        {/* Section 8: Legal Jurisdiction */}
        <section className="p-6 sm:p-8 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-950">
            8. Governing Law & Jurisdiction
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-normal">
            These terms are governed by and construed in accordance with the Laws of the Islamic Republic of Pakistan. The courts of Nankana Sahib / Lahore, Punjab hold exclusive commercial jurisdiction over matters arising from wholesale transactions.
          </p>
        </section>

        {/* Embedded Google Business Map */}
        <div className="pt-2">
          <GoogleBusinessMap
            cityName="Bucheki"
            province="Punjab"
            customHeading="Noor Galla Mandi Registered Trading Desk"
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
              onClick={() => setCurrentView('privacy')}
              className="text-xs font-semibold text-emerald-900 hover:underline"
            >
              Read Privacy Policy →
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
