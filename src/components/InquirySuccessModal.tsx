import React from 'react';
import {
  CheckCircle2,
  X,
  MessageCircle,
  Mail,
  ShieldCheck,
  Bell,
  Clock,
  ArrowRight,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { StoredInquiry, generateWhatsAppInquiryUrl, generateEmailNotificationUrl } from '../utils/inquiryManager';

interface InquirySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: StoredInquiry | null;
}

export const InquirySuccessModal: React.FC<InquirySuccessModalProps> = ({
  isOpen,
  onClose,
  inquiry,
}) => {
  if (!isOpen || !inquiry) return null;

  const waUrl = generateWhatsAppInquiryUrl({
    customerName: inquiry.customerName,
    phone: inquiry.phone,
    city: inquiry.city,
    variety: inquiry.variety,
    volume: inquiry.volume,
    businessName: inquiry.businessName,
    message: inquiry.notes,
    inquiryId: inquiry.id
  });

  const mailUrl = generateEmailNotificationUrl({
    customerName: inquiry.customerName,
    phone: inquiry.phone,
    city: inquiry.city,
    variety: inquiry.variety,
    volume: inquiry.volume,
    businessName: inquiry.businessName,
    message: inquiry.notes,
    inquiryId: inquiry.id
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Green Badge */}
        <div className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white text-center space-y-2 relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-[11px] font-bold tracking-wider uppercase border border-emerald-700">
            Tracking ID: {inquiry.id}
          </span>

          <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
            Inquiry Registered & Dispatched!
          </h3>
          <p className="text-xs text-emerald-100/90 max-w-sm mx-auto">
            Your bulk rice inquiry has been securely stored in our system and routed to our Bucheki Mandi sourcing desk.
          </p>
        </div>

        {/* Notification Channels Guide */}
        <div className="p-6 space-y-5 text-xs">
          <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/90 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <Bell className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span>How You & The Trade Desk Get Notified:</span>
            </div>

            <div className="space-y-2.5 text-neutral-700">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-neutral-900 block font-semibold">Instant WhatsApp Alert (+92 333 8990883)</strong>
                  <span>Pre-formatted alert with variety, volume, and city specs is dispatched to Owner Muhammad Amir Shahzad.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-neutral-900 block font-semibold">Admin Inquiries Desk (Real-Time CRM)</strong>
                  <span>Logged permanently into WordPress Admin Dashboard under &quot;Inquiries Desk&quot; with waiting status.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-neutral-900 block font-semibold">Email Backup Notification</strong>
                  <span>Sent directly to info@hashirricesupplier.com and type2amir@gmail.com.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Summary Capsule */}
          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-neutral-600">
              <span>Customer: <strong className="text-neutral-900">{inquiry.customerName}</strong></span>
              <span>Phone: <strong className="text-neutral-900">{inquiry.phone}</strong></span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Variety: <strong className="text-emerald-900">{inquiry.variety}</strong></span>
              <span>City: <strong className="text-neutral-900">{inquiry.city}</strong></span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Volume: <strong className="text-neutral-900">{inquiry.volume}</strong></span>
              <span>Status: <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">Waiting / New</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open WhatsApp Alert to Muhammad Amir Shahzad</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </a>

            <div className="flex items-center gap-2">
              <a
                href={mailUrl}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-neutral-200"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-600" />
                <span>Trigger Email Notification</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-[11px] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
