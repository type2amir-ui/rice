import React from 'react';
import { ClipboardList, Filter, CookingPot, Handshake, CheckCheck, Truck, ShieldAlert, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface SourcingWorkflowSectionProps {
  onOpenQuoteModal: () => void;
  onOpenSampleModal: () => void;
}

export const SourcingWorkflowSection: React.FC<SourcingWorkflowSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  const steps = [
    {
      number: '01',
      title: 'Submit Your Requirement',
      icon: ClipboardList,
      description: 'Specify your target rice variety (Super Kernel, 1121 Kainat, IRRI), required tonnage/bags, packaging preference, target price, and destination city.',
      highlight: 'Takes 2 minutes via WhatsApp or Quote Form'
    },
    {
      number: '02',
      title: 'Multi-Mill Sourcing & Filtering',
      icon: Filter,
      description: 'We query our verified network of processing mills across Punjab and Sindh to locate lots matching your exact culinary and price parameters.',
      highlight: 'Independent price & quality comparison'
    },
    {
      number: '03',
      title: 'Physical Sample Dispatch & Test',
      icon: CookingPot,
      description: 'A physical Free Sample lot is couriered directly to your city for grain measurement, moisture check, and kitchen test cooking (Daig/Pot test).',
      highlight: 'Zero guesswork: 100% verified cooking'
    },
    {
      number: '04',
      title: 'Commercial Finalization',
      icon: Handshake,
      description: 'Once you approve the sample, final quantity, delivery timeline, and transparent broker commission terms are locked with the selected supplier mill.',
      highlight: 'Fixed rates with zero hidden markups'
    },
    {
      number: '05',
      title: 'Loading & Weight Inspection',
      icon: CheckCheck,
      description: 'Our team verifies that the rice loaded in trucks corresponds strictly to the sealed approved sample lot, checking bag weight, stitch quality, and moisture.',
      highlight: 'Sample-matching loading guarantee'
    },
    {
      number: '06',
      title: 'Dispatched with Consignment Note (Bilty)',
      icon: Truck,
      description: 'Tarpaulin-covered trucks or container trailers depart with official goods consignment note (bilty), live driver contact, and transit monitoring.',
      highlight: 'Safe nationwide freight across 60+ cities'
    },
    {
      number: '07',
      title: 'Warehouse Delivery & Recurring Supply',
      icon: Sparkles,
      description: 'You receive the consignment at your designated warehouse. For regular buyers, we maintain reserve milling lots for seamless recurring weekly orders.',
      highlight: 'Locked-in consistency all year round'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Clear & Safe Buying Process
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            How Our 7-Step B2B Rice Sourcing Workflow Operates
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            From initial variety consultation to final truck delivery at your mandi warehouse, we eliminate risk with sample verification and transparent coordination.
          </p>
        </div>

        {/* Workflow Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-neutral-50/80 rounded-2xl p-6 border border-neutral-200 hover:border-emerald-800/60 hover:bg-white transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-black text-emerald-900/40 group-hover:text-emerald-900 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-neutral-900 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/70">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {step.highlight}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Final Callout Card in Grid */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                Start With Step 01
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-950 mb-2">
                Ready to Test a Cooking Sample or Get Sourcing Rates?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Connect directly with Hashir Rice Supplier on WhatsApp to initiate your inquiry.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={onOpenQuoteModal}
                className="w-full py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Submit Bulk Requirement
              </button>
              <a
                href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20ready%20to%20start%20the%20rice%20sourcing%20process."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-white hover:bg-neutral-100 text-emerald-950 font-semibold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp (+92 333 8990883)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
