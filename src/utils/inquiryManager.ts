// Sourcing Inquiry & Instant Notification Management System
// Hashir Rice Supplier (Owner: Muhammad Amir Shahzad, +92 333 8990883)

export interface StoredInquiry {
  id: string;
  customerName: string;
  businessName: string;
  phone: string;
  city: string;
  variety: string;
  volume: string;
  valuePkr: string;
  type: string;
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  notes: string;
  unread?: boolean;
  createdAt?: string;
}

// Play notification sound chime using Web Audio API
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Pleasant two-tone chime (E5 -> G#5)
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.15); // G#5
    gain2.gain.setValueAtTime(0.18, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

// Save inquiry to persistent storage and alert listeners
export function recordNewInquiry(inquiryData: {
  customerName: string;
  phone: string;
  city: string;
  variety: string;
  volume: string;
  businessName?: string;
  message?: string;
  type?: string;
  estimatedValue?: string;
}): StoredInquiry {
  const existingRaw = localStorage.getItem('hashir_rice_inquiries_pipeline');
  let inquiriesList: StoredInquiry[] = [];
  try {
    if (existingRaw) inquiriesList = JSON.parse(existingRaw);
  } catch {
    inquiriesList = [];
  }

  const newId = `INQ-${Date.now().toString().slice(-4)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  const newRecord: StoredInquiry = {
    id: newId,
    customerName: inquiryData.customerName.trim() || 'Valued Buyer',
    businessName: inquiryData.businessName?.trim() || 'Wholesale Rice Merchant',
    phone: inquiryData.phone.trim(),
    city: inquiryData.city.trim() || 'Lahore',
    variety: inquiryData.variety || '1121 Kainat Steam Basmati',
    volume: inquiryData.volume || '10 Tons (200 Bags of 50kg)',
    valuePkr: inquiryData.estimatedValue || 'Pending Verification',
    type: inquiryData.type || 'Commercial Sourcing Inquiry',
    status: 'Waiting',
    date: dateStr,
    notes: inquiryData.message?.trim() || 'New inquiry submitted via website inquiry desk.',
    unread: true,
    createdAt: new Date().toISOString()
  };

  // Prepend new inquiry so it appears at top of dashboard
  const updatedList = [newRecord, ...inquiriesList];
  localStorage.setItem('hashir_rice_inquiries_pipeline', JSON.stringify(updatedList));

  // Play audio chime
  playNotificationChime();

  // Dispatch custom window event for instant UI sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hashir_new_inquiry_added', { detail: newRecord }));
  }

  return newRecord;
}

// Generate preformatted WhatsApp notification text and URL
export function generateWhatsAppInquiryUrl(params: {
  customerName: string;
  phone: string;
  city: string;
  variety: string;
  volume: string;
  businessName?: string;
  message?: string;
  inquiryId?: string;
}): string {
  const text = 
    `*🚨 NEW WHOLESALE RICE INQUIRY - HASHIR RICE SUPPLIER*\n\n` +
    `👤 *Buyer Name:* ${params.customerName}\n` +
    `🏢 *Business / Firm:* ${params.businessName || 'Wholesale Buyer'}\n` +
    `📞 *Buyer Phone / WhatsApp:* ${params.phone}\n` +
    `📍 *Delivery City / Mandi:* ${params.city}\n` +
    `🌾 *Rice Variety Required:* ${params.variety}\n` +
    `⚖️ *Order Volume:* ${params.volume}\n` +
    (params.inquiryId ? `🔖 *System Tracking ID:* ${params.inquiryId}\n` : '') +
    (params.message ? `📝 *Buyer Requirements / Notes:* ${params.message}\n\n` : '\n') +
    `_Sent via hashirricesupplier.com direct inquiry desk to Muhammad Amir Shahzad._`;

  return `https://wa.me/923338990883?text=${encodeURIComponent(text)}`;
}

// Generate mailto notification link to notify owner via email
export function generateEmailNotificationUrl(params: {
  customerName: string;
  phone: string;
  city: string;
  variety: string;
  volume: string;
  businessName?: string;
  message?: string;
  inquiryId?: string;
}): string {
  const subject = `[NEW RICE INQUIRY ${params.inquiryId || ''}] ${params.customerName} - ${params.variety} (${params.city})`;
  const body = 
    `Hello Muhammad Amir Shahzad,\n\n` +
    `A new wholesale rice procurement inquiry has been submitted on hashirricesupplier.com:\n\n` +
    `Buyer Name: ${params.customerName}\n` +
    `Firm / Company: ${params.businessName || 'N/A'}\n` +
    `Contact Phone: ${params.phone}\n` +
    `Delivery Destination: ${params.city}\n` +
    `Variety Needed: ${params.variety}\n` +
    `Quantity: ${params.volume}\n` +
    (params.message ? `Notes: ${params.message}\n\n` : '\n\n') +
    `Timestamp: ${new Date().toLocaleString()}\n` +
    `Please reply promptly via WhatsApp (+92 333 8990883) or Phone.\n`;

  return `mailto:type2amir@gmail.com,info@hashirricesupplier.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
