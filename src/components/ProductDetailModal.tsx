import React from 'react';
import { RiceVariety } from '../types';
import { X, CheckCircle2, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Box, CookingPot } from 'lucide-react';

interface ProductDetailModalProps {
  variety: RiceVariety | null;
  onClose: () => void;
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  variety,
  onClose,
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  if (!variety) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image & Title */}
        <div className="relative h-48 sm:h-56 bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={variety.imageUrl}
            alt={variety.name}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Tagline */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-2.5 py-0.5 rounded bg-amber-400 text-neutral-950 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
              {variety.category} Category
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {variety.name}
            </h2>
            <p className="text-xs text-amber-200 mt-0.5">{variety.tagline}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-neutral-800 flex-1">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Grain Character & Sourcing Background
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {variety.description}
            </p>
          </div>

          {/* Laboratory Specification Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Laboratory & Milling Specifications</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Avg. Raw Length:</span>
                <span className="font-bold text-neutral-900">{variety.specs.averageGrainLength}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Cooked Elongation:</span>
                <span className="font-bold text-emerald-800">{variety.specs.postCookingLength}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Max Moisture:</span>
                <span className="font-bold text-neutral-900">{variety.specs.moistureMax}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Broken Grain %:</span>
                <span className="font-bold text-neutral-900">{variety.specs.brokenMax}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Purity Level:</span>
                <span className="font-bold text-neutral-900">{variety.specs.purity}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Aroma Profile:</span>
                <span className="font-bold text-neutral-900">{variety.specs.aroma} Aroma</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Milling Polish:</span>
                <span className="font-bold text-neutral-900">{variety.specs.polish}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Crop Vintage:</span>
                <span className="font-bold text-neutral-900">{variety.specs.cropYear}</span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Minimum Order:</span>
                <span className="font-bold text-emerald-800">{variety.minOrderQuantity}</span>
              </div>
            </div>
          </div>

          {/* Suitable Culinary Applications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
              <CookingPot className="w-4 h-4 text-emerald-700" />
              <span>Recommended Commercial Culinary Applications</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {variety.suitableFor.map((app, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Packaging Options */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-emerald-700" />
              <span>Available Bagging & Packaging Types</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {variety.packagingOptions.map((pkg, i) => (
                <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium border border-neutral-200">
                  {pkg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-neutral-500 text-center sm:text-left">
            Dispatch arranged directly from Punjab mills to your warehouse.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenSampleModal(variety.name);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-xs border border-neutral-300 shadow-2xs transition-colors"
            >
              Order Sample Pack
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenQuoteModal(variety.name);
              }}
              className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Get Wholesale Price</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
