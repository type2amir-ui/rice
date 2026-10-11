import React from 'react';
import { Store, UtensilsCrossed, Building, ShoppingCart, Globe2, Factory, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhoWeServeSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
}

export const WhoWeServeSection: React.FC<WhoWeServeSectionProps> = ({ onOpenQuoteModal }) => {
  const buyerCategories = [
    {
      icon: Store,
      title: 'Rice Wholesalers & Mandi Traders',
      tag: '5 to 50 Ton Consignments',
      description: 'Grain merchants in Akbari Mandi Lahore, Jodia Bazaar Karachi, Ganjmandi Rawalpindi, and wholesale mandi markets across 60+ cities seeking certified mill-direct lots with reliable bag weights and moisture controls.',
      keyBenefit: 'Competitive ex-mill rates & seamless bilty logistics'
    },
    {
      icon: UtensilsCrossed,
      title: 'Biryani Franchises & Restaurant Chains',
      tag: 'Batch-Locked Cooking Consistency',
      description: 'Commercial kitchens requiring specific non-breaking 22mm+ 1121 Steam or aged Super Kernel Basmati with uniform water absorption and distinct grain separation every single week.',
      keyBenefit: 'Guaranteed cooking performance with zero kitchen batch variance'
    },
    {
      icon: Building,
      title: 'Banquet Caterers & Daig Masters',
      tag: 'High-Heat & Heavy Daig Resistance',
      description: 'Large-scale wedding and banquet caterers preparing 50 to 200+ Daigs per event. We supply hardened 1121 Sella and Steam Basmati that survives vigorous stirring without turning mushy.',
      keyBenefit: 'Maximum cooked pot yield & dramatic presentation'
    },
    {
      icon: ShoppingCart,
      title: 'Supermarket Chains & Retail Brands',
      tag: 'Custom Packaging & BOPP Sacks',
      description: 'Retail grocery brands and supermarket chains seeking double silky polished, 100% sortex-cleaned Basmati in custom-printed 5kg, 10kg, and 25kg consumer packs.',
      keyBenefit: 'Private label bagging & high-purity laboratory sorting'
    },
    {
      icon: Globe2,
      title: 'Export Houses & Trading Companies',
      tag: 'Container Freight to Karachi Port',
      description: 'Commodity trading companies exporting Pakistani Basmati and IRRI-6 to Middle East, Europe, Africa, and Central Asia. We coordinate inland truck transit to Port Qasim & Karachi Port terminals.',
      keyBenefit: 'FOB Karachi / ex-mill packaging with third-party testing support'
    },
    {
      icon: Factory,
      title: 'Industrial Messes & Food Processors',
      tag: 'Economical Bulk Tonnage',
      description: 'Textile mill worker messes, corporate cafeterias, and food manufacturers requiring cost-effective PK-386, IRRI-6, or broken rice (Tota) for rice flour, snacks, and animal feed.',
      keyBenefit: 'High volume cost savings & reliable scheduled supply'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" />
            Commercial Rice Supplier Pakistan
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            Wholesale Basmati Rice Supplier & Bulk Rice Wholesaler for Every Industry
          </h2>
          <p className="mt-3 text-neutral-600 text-sm leading-relaxed">
            As a full-service <strong>Rice Supply Company Pakistan</strong> and authorized <strong>Rice Wholesale Dealer Pakistan</strong>, we supply bulk basmati rice, 1121 steam/sella, PK-386, and IRRI varieties tailored specifically to wholesale merchants, catering operations, and retail packaging brands.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyerCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-amber-300 transition-colors shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="text-[11px]">{cat.keyBenefit}</span>
                  </div>
                  <button
                    onClick={() => onOpenQuoteModal()}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-900 hover:bg-neutral-100 transition-colors"
                    title="Inquire for this industry"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
