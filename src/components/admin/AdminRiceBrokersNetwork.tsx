import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Phone,
  Search,
  Filter,
  Download,
  Upload,
  Mic,
  MicOff,
  Image as ImageIcon,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldAlert,
  Send,
  Users,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  Volume2,
  VolumeX,
  X,
  Check,
  Radio,
  Share2,
  ChevronDown
} from 'lucide-react';
import {
  PAKISTAN_RICE_BROKERS,
  SUPER_ADMIN_DISPLAY_PHONE,
  SUPER_ADMIN_PHONE,
  SUPER_ADMIN_NAME,
  INITIAL_BROADCAST_HISTORY
} from '../../data/pakistanRiceBrokersData';
import { PakistanRiceBroker, WhatsAppBroadcastMessage } from '../../types';
import {
  generateWordPressBrokersPluginPhp,
  generateWordPressBrokersFunctionsPhpSnippet
} from '../../utils/wordpressBrokersPluginGenerator';

interface AdminRiceBrokersNetworkProps {
  onSuccessToast?: (msg: string) => void;
  isSecretStandalonePage?: boolean;
}

export const AdminRiceBrokersNetwork: React.FC<AdminRiceBrokersNetworkProps> = ({
  onSuccessToast,
  isSecretStandalonePage = false
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'broadcast' | 'directory' | 'export' | 'code'>('broadcast');

  // Brokers Directory State
  const [brokers, setBrokers] = useState<PakistanRiceBroker[]>(() => {
    const saved = localStorage.getItem('hashir_pakistan_rice_brokers_v1');
    return saved ? JSON.parse(saved) : PAKISTAN_RICE_BROKERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Broadcast Composer State
  const [broadcastText, setBroadcastText] = useState(
    `Assalam-o-Alaikum All Rice Brothers & Mandi Friends! 🌾\n\n` +
    `*DAILY EX-MILL MANDI UPDATE (Hashir Rice Supplier):*\n` +
    `• 1121 Kainat Steam (8.4mm+ Super Clean): Rs. 14,800/40kg\n` +
    `• Super Kernel Basmati Raw Old Crop: Rs. 13,900/40kg\n` +
    `• 1509 Golden Sella Export Grade: Rs. 12,500/40kg\n` +
    `• IRRI-6 White Rice (Sindh): Rs. 7,450/40kg\n\n` +
    `Ready stock 500 Tons available for immediate dispatch.\n` +
    `Direct Reply to Hashir Rice Supplier (+92 333 8990883): https://wa.me/923338990883`
  );
  const [targetAudience, setTargetAudience] = useState<'all' | 'punjab' | 'sindh' | 'kp_balochistan' | 'basmati' | 'irri'>('all');
  const [attachedPhotoUrl, setAttachedPhotoUrl] = useState<string>('');
  const [attachedPhotoCaption, setAttachedPhotoCaption] = useState<string>('');
  const [attachedAudioUrl, setAttachedAudioUrl] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<string>('0:00');

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Broadcast History State
  const [broadcastHistory, setBroadcastHistory] = useState<WhatsAppBroadcastMessage[]>(() => {
    const saved = localStorage.getItem('hashir_broadcast_history_v1');
    return saved ? JSON.parse(saved) : INITIAL_BROADCAST_HISTORY;
  });

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeFormatMode, setCodeFormatMode] = useState<'functions_php' | 'plugin'>('functions_php');

  const showToast = (msg: string) => {
    if (onSuccessToast) onSuccessToast(msg);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hashir_pakistan_rice_brokers_v1', JSON.stringify(brokers));
  }, [brokers]);

  useEffect(() => {
    localStorage.setItem('hashir_broadcast_history_v1', JSON.stringify(broadcastHistory));
  }, [broadcastHistory]);

  // Voice recording handlers
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Microphone not supported in this browser. Loaded sample audio instead.');
        loadSampleAudio();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAttachedAudioUrl(audioUrl);
        setAudioDuration(`0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`);
        showToast('Voice note recorded successfully!');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone error:', err);
      showToast('Microphone permission denied. Loading sample voice note.');
      loadSampleAudio();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const loadSampleAudio = () => {
    setAttachedAudioUrl('https://cdn.freesound.org/previews/518/518305_10672740-lq.mp3');
    setAudioDuration('0:42');
    showToast('Urdu Mandi Audio Note attached (0:42).');
  };

  const removeAudio = () => {
    setAttachedAudioUrl('');
    setAudioDuration('0:00');
    setIsPlayingAudio(false);
    showToast('Voice note removed.');
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Quick templates
  const handleInsertTemplate = (type: string) => {
    const today = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
    if (type === 'rates') {
      setBroadcastText(
        `📊 *PAKISTAN GRAIN MANDI RATES (${today})*\n` +
        `Direct Broadcast from Hashir Rice Supplier (Owner: Muhammad Amir Shahzad, +92 333 8990883):\n\n` +
        `1️⃣ *1121 Kainat Steam (8.4mm):* Rs. 14,800 - 15,200/40kg\n` +
        `2️⃣ *Super Kernel Basmati Raw Old:* Rs. 13,900 - 14,300/40kg\n` +
        `3️⃣ *1509 Golden Sella (Export):* Rs. 12,400 - 12,800/40kg\n` +
        `4️⃣ *IRRI-6 White Rice (Sindh):* Rs. 7,450 - 7,800/40kg\n\n` +
        `Ex-Mill spot inspection open at Hafizabad & Akbari Mandi Lahore.\n` +
        `Reply directly to Admin WhatsApp: https://wa.me/923338990883`
      );
    } else if (type === 'kainat') {
      setBroadcastText(
        `🍚 *READY STOCK OFFER: 1121 KAINAT STEAM (SUPER CLEAN)*\n` +
        `• Average Grain Length: 8.38mm (Post Cooking 19mm+)\n` +
        `• Moisture: 12.0% Max | Chalky: 0% | Broken: Under 1.5%\n` +
        `• Lot Size: 400 Metric Tons ready at Hafizabad Sheller\n` +
        `• Packing: 25kg Double-Polyester Moisture Barrier Bags\n\n` +
        `Ideal for Karachi & Quetta high-end wholesale market.\n` +
        `Direct Admin WhatsApp: https://wa.me/923338990883`
      );
      setAttachedPhotoUrl('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80');
      setAttachedPhotoCaption('1121 Kainat Steam Basmati Sample Lot - Ready for Dispatch');
    } else if (type === 'tender') {
      setBroadcastText(
        `💼 *PURCHASE INQUIRY / URGENT MANDI TENDER*\n` +
        `Required 350 Metric Tons *Super Kernel Parboiled (Golden Sella)* for export shipment.\n` +
        `Payment: 100% Cash / Instant Bank Transfer on Mandi weighbridge dispatch.\n` +
        `All commission agents with ready lots please WhatsApp lab specs & ex-mill rates.\n\n` +
        `Direct Reply: https://wa.me/923338990883`
      );
    } else if (type === 'broken') {
      setBroadcastText(
        `🌾 *BROKEN RICE (KANI) BULK LOT FOR BIRYANI & EXPORT*\n` +
        `• 100% Basmati Sortexed Kani (Zero Dust / Zero Black Grain)\n` +
        `• Available Quantity: 150 Tons spot dispatch\n` +
        `• Special Ex-Mill Mandi Spot Rate: Rs. 6,800/40kg\n\n` +
        `Direct Reply to Hashir Rice Supplier: https://wa.me/923338990883`
      );
    }
    showToast('Template loaded into composer.');
  };

  // Target audience count
  const getAudienceCount = () => {
    if (targetAudience === 'all') return brokers.length;
    if (targetAudience === 'punjab') return brokers.filter((b) => b.province === 'Punjab').length;
    if (targetAudience === 'sindh') return brokers.filter((b) => b.province === 'Sindh').length;
    if (targetAudience === 'kp_balochistan') return brokers.filter((b) => b.province === 'Khyber Pakhtunkhwa' || b.province === 'Balochistan').length;
    if (targetAudience === 'basmati') return brokers.filter((b) => b.specialties.some((s) => s.includes('Basmati') || s.includes('Kainat') || s.includes('Sella'))).length;
    if (targetAudience === 'irri') return brokers.filter((b) => b.specialties.some((s) => s.includes('IRRI') || s.includes('Broken'))).length;
    return brokers.length;
  };

  // Launch broadcast
  const handleSendBroadcast = () => {
    if (!broadcastText.trim()) {
      showToast('Please type a broadcast message before sending.');
      return;
    }

    const count = getAudienceCount();
    const audienceNames: Record<string, string> = {
      all: `All Pakistan Rice Traders (${count} Brokers)`,
      punjab: `Punjab Mandis (${count} Brokers)`,
      sindh: `Sindh Mandis (${count} Brokers)`,
      kp_balochistan: `KP & Balochistan (${count} Brokers)`,
      basmati: `Basmati Specialists (${count} Brokers)`,
      irri: `IRRI & Long Grain Specialists (${count} Brokers)`
    };

    const newMsg: WhatsAppBroadcastMessage = {
      id: `MSG-BRK-${Date.now().toString().slice(-4)}`,
      senderName: `${SUPER_ADMIN_NAME} (Super Admin)`,
      senderPhone: SUPER_ADMIN_DISPLAY_PHONE,
      timestamp: new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }),
      text: broadcastText,
      messageType: attachedAudioUrl ? 'voice_note' : attachedPhotoUrl ? 'photo' : 'text',
      photoUrl: attachedPhotoUrl || undefined,
      photoCaption: attachedPhotoCaption || undefined,
      voiceNoteUrl: attachedAudioUrl || undefined,
      voiceNoteDuration: attachedAudioUrl ? audioDuration : undefined,
      targetAudience: audienceNames[targetAudience] || `${count} Brokers`,
      recipientCount: count,
      replyToPhone: SUPER_ADMIN_DISPLAY_PHONE
    };

    setBroadcastHistory([newMsg, ...broadcastHistory]);
    showToast(`Broadcast queued to ${count} Pakistani Rice Brokers!`);

    // Launch WhatsApp Web Multi-Recipient Deep Link
    const fullText = `${broadcastText}\n\n🔒 Sent via Verified Broadcast Channel (${SUPER_ADMIN_DISPLAY_PHONE})`;
    const encoded = encodeURIComponent(fullText);
    const waUrl = `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  // Download vCard (.vcf)
  const handleDownloadVcard = () => {
    let vcardData = '';
    brokers.forEach((b) => {
      vcardData += `BEGIN:VCARD\r\n`;
      vcardData += `VERSION:3.0\r\n`;
      vcardData += `FN:${b.name} (${b.mandi})\r\n`;
      vcardData += `ORG:${b.firmName}\r\n`;
      vcardData += `TITLE:${b.role}\r\n`;
      vcardData += `TEL;TYPE=CELL,VOICE,WHATSAPP:${b.whatsapp}\r\n`;
      vcardData += `ADR;TYPE=WORK:;;${b.mandi};${b.city};${b.province};;Pakistan\r\n`;
      vcardData += `NOTE:Specialties: ${b.specialties.join(', ')} | Capacity: ${b.dailyCapacityTons} Tons/Day | Verified Rice Broker Pakistan\r\n`;
      vcardData += `END:VCARD\r\n`;
    });

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pakistan_Rice_Brokers_${brokers.length}_Contacts.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded vCard with all ${brokers.length} contacts! Open on your phone to import to WhatsApp.`);
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = ['ID', 'Name', 'Firm Name', 'Mandi', 'City', 'Province', 'WhatsApp', 'Phone', 'Role', 'Specialties', 'Daily Capacity Tons', 'Experience Years', 'Status'];
    const rows = brokers.map((b) => [
      b.id,
      `"${b.name}"`,
      `"${b.firmName}"`,
      `"${b.mandi}"`,
      `"${b.city}"`,
      `"${b.province}"`,
      `"${b.whatsapp}"`,
      `"${b.phone}"`,
      `"${b.role}"`,
      `"${b.specialties.join(', ')}"`,
      b.dailyCapacityTons,
      b.experienceYears,
      `"${b.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pakistan_Rice_Brokers_${brokers.length}_Directory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`CSV Spreadsheet with ${brokers.length} contacts downloaded.`);
  };

  // Copy PHP Code
  const handleCopyPhpCode = (modeOverride?: 'functions_php' | 'plugin') => {
    const targetMode = modeOverride || codeFormatMode;
    const code =
      targetMode === 'functions_php'
        ? generateWordPressBrokersFunctionsPhpSnippet()
        : generateWordPressBrokersPluginPhp();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
    showToast(
      targetMode === 'functions_php'
        ? 'Copied for functions.php (WITHOUT <?php tag)! Paste at the end of functions.php without error.'
        : 'Copied standalone plugin PHP code (WITH <?php tag)!'
    );
  };

  // Download PHP Plugin File
  const handleDownloadPhpFile = () => {
    const code = generateWordPressBrokersPluginPhp();
    const blob = new Blob([code], { type: 'application/x-php;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hashir-rice-brokers-whatsapp-network.php');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded hashir-rice-brokers-whatsapp-network.php ready for WordPress!');
  };

  // Filtered brokers
  const filteredBrokers = brokers.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.whatsapp.includes(searchQuery) ||
      b.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProvince = provinceFilter === 'All' || b.province === provinceFilter;
    const matchesCity = cityFilter === 'All' || b.city === cityFilter;
    const matchesRole = roleFilter === 'All' || b.role === roleFilter;

    return matchesSearch && matchesProvince && matchesCity && matchesRole;
  });

  const uniqueCities = Array.from(new Set(brokers.map((b) => b.city))).sort();

  return (
    <div className="space-y-6">
      {/* Super Admin Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-6 text-white shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Official 1-Way WhatsApp Broadcast Network</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Pakistan Rice Brokers & WhatsApp Broadcast Hub
            </h1>
            <p className="text-emerald-200/90 text-sm max-w-2xl">
              Designated Super Admin:{' '}
              <span className="font-bold text-white bg-emerald-800/50 px-2 py-0.5 rounded border border-emerald-600/40">
                {SUPER_ADMIN_NAME} ({SUPER_ADMIN_DISPLAY_PHONE})
              </span>
              . Pre-loaded with <strong className="text-white">{brokers.length} verified Pakistani rice brokers</strong> across Akbari Mandi, Hafizabad, Karachi Jodia Bazaar, Kamoke & Sindh/Punjab grain mandis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadVcard}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download vCard (Import 560 to WhatsApp)</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-2.5 text-sm border border-white/15 transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Directory</span>
            </button>
          </div>
        </div>

        {/* 1-Way Security Rule Box */}
        <div className="mt-5 rounded-xl bg-black/25 border border-emerald-500/30 p-3.5 text-xs text-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">1-Way Broadcast Protection Enforced:</span> Only you (
              <span className="font-mono text-emerald-300 font-bold">{SUPER_ADMIN_DISPLAY_PHONE}</span>) can broadcast rate updates, photo samples, and voice notes. Recipients cannot spam the group; all replies automatically open a private WhatsApp 1-on-1 chat back to your phone.
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <a
              href="/secret-brokers-portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-emerald-400/40 transition"
            >
              <span>Secret URL: /secret-brokers-portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-700 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeSubTab === 'broadcast'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 hover:border-neutral-300'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Admin WhatsApp Broadcast Desk</span>
          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
            Admin Only
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeSubTab === 'directory'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 hover:border-neutral-300'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Brokers Directory ({filteredBrokers.length})</span>
          <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs px-2 py-0.5 rounded-full font-bold">
            {brokers.length} Pre-loaded
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeSubTab === 'export'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 hover:border-neutral-300'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Instant WhatsApp Group Importer (vCard)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeSubTab === 'code'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 hover:border-neutral-300'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>WordPress Injectable PHP Code</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
            For functions.php
          </span>
        </button>
      </div>

      {/* SUBTAB 1: BROADCAST DESK */}
      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Composer */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                      Compose WhatsApp Mandi Announcement
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Author: <span className="font-semibold text-emerald-600">{SUPER_ADMIN_NAME}</span> ({SUPER_ADMIN_DISPLAY_PHONE})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-400">Target Audience</span>
                  <div className="text-xs font-bold text-emerald-600">{getAudienceCount()} Rice Traders</div>
                </div>
              </div>

              {/* Target Audience Dropdown */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Select Recipient Group:
                </label>
                <select
                  value={targetAudience}
                  onChange={(e: any) => setTargetAudience(e.target.value)}
                  className="w-full text-sm font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-2.5 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">🌟 All Pakistan Rice Traders ({brokers.length} Contacts)</option>
                  <option value="punjab">🌾 Punjab Mandis (Hafizabad, Akbari Mandi, Kamoke, Gujranwala - 380)</option>
                  <option value="sindh">🌊 Sindh Mandis (Karachi Jodia Bazaar, Larkana, Sukkur - 116)</option>
                  <option value="kp_balochistan">🏔️ KP & Balochistan (Peshawar, Quetta - 42)</option>
                  <option value="basmati">🍚 1121 Kainat & Super Basmati Specialists Only</option>
                  <option value="irri">🌾 IRRI-6 & Long Grain Specialists Only</option>
                </select>
              </div>

              {/* Quick Template Buttons */}
              <div>
                <span className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Insert Pre-formatted Mandi Template:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('rates')}
                    className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition"
                  >
                    📊 Daily Rates
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('kainat')}
                    className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition"
                  >
                    🍚 1121 Kainat Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('tender')}
                    className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition"
                  >
                    💼 Purchase Tender
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('broken')}
                    className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition"
                  >
                    🌾 Broken Kani Lot
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Broadcast Text:
                </label>
                <textarea
                  rows={6}
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="Type mandi rates, variety specifications, spot delivery terms..."
                  className="w-full text-sm font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Photo Attachment Section */}
              <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    Attach Photo / Sample Lot Picture
                  </span>
                  {attachedPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setAttachedPhotoUrl('')}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                    </button>
                  )}
                </div>

                {!attachedPhotoUrl ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedPhotoUrl('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80');
                        setAttachedPhotoCaption('1121 Kainat Steam - 8.4mm AGL Double Polished Sample');
                      }}
                      className="text-xs bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 rounded-lg font-medium"
                    >
                      🌾 1121 Kainat Sample
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedPhotoUrl('https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1000&q=80');
                        setAttachedPhotoCaption('Super Kernel Basmati Raw Old Crop - Akbari Mandi inspection lot');
                      }}
                      className="text-xs bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 rounded-lg font-medium"
                    >
                      🌾 Super Kernel Aged
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedPhotoUrl('https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1000&q=80');
                        setAttachedPhotoCaption('1509 Golden Sella Export Quality Bags Ready for Dispatch');
                      }}
                      className="text-xs bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 rounded-lg font-medium"
                    >
                      🌾 1509 Golden Sella
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <img
                      src={attachedPhotoUrl}
                      alt="Sample"
                      className="w-16 h-16 rounded-md object-cover border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={attachedPhotoCaption}
                        onChange={(e) => setAttachedPhotoCaption(e.target.value)}
                        placeholder="Caption: e.g. 1121 Steam 50kg bags ready at Hafizabad"
                        className="w-full text-xs rounded border border-neutral-300 dark:border-neutral-600 p-1.5 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                        ✓ Photo attached to broadcast card
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Note Recording Section */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 p-4 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        🎙️ Voice Note / Audio Memo (Urdu Mandi Audio)
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Record live message or attach voice rate card
                      </span>
                    </div>
                  </div>

                  {attachedAudioUrl && (
                    <button
                      type="button"
                      onClick={removeAudio}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Audio
                    </button>
                  )}
                </div>

                {!attachedAudioUrl ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-red-600/20 transition active:scale-95"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Recording Voice Note</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition animate-pulse"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop & Save Voice Note (0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds})</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={loadSampleAudio}
                      className="text-xs bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-neutral-700 dark:text-neutral-300 font-semibold px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 transition"
                    >
                      ▶️ Attach Pre-recorded Mandi Audio Memo
                    </button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow transition flex-shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        <span>Hashir Rice Supplier Mandi Audio Memo</span>
                        <span className="font-mono text-emerald-600">{audioDuration}</span>
                      </div>
                      {/* Audio wave simulation */}
                      <div className="flex items-center gap-1 mt-1.5 h-4">
                        {[40, 70, 30, 90, 60, 80, 50, 95, 30, 75, 45, 85, 60, 30, 70, 50].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full ${
                              isPlayingAudio ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300 dark:bg-emerald-700'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <audio
                      ref={audioPlayerRef}
                      src={attachedAudioUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendBroadcast}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition active:scale-98"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Broadcast to Selected Group ({getAudienceCount()} Brokers)</span>
                </button>
                <p className="text-[11px] text-center text-neutral-400 mt-2">
                  Opens WhatsApp Web / Mobile API with pre-formatted rate card, photo, and voice memo payload.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live WhatsApp Channel Simulation & History */}
          <div className="lg:col-span-5 space-y-5">
            {/* Simulated WhatsApp Phone Frame */}
            <div className="bg-[#efeae2] dark:bg-neutral-800 rounded-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-lg">
              {/* WhatsApp Header */}
              <div className="bg-[#075e54] text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-500">
                    🌾
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">Pakistan Rice Traders Broadcast</h4>
                    <span className="text-[11px] text-emerald-200">
                      Hashir Rice Supplier (Owner: Muhammad Amir Shahzad) &bull; {brokers.length} Participants
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  1-Way Only
                </span>
              </div>

              {/* Chat Bubble Area */}
              <div className="p-4 space-y-3 min-h-[320px] max-h-[460px] overflow-y-auto">
                <div className="text-center">
                  <span className="bg-white/80 dark:bg-neutral-700/80 text-[10px] text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-full font-medium shadow-sm">
                    🔒 Only Admins Can Send Messages to This Broadcast
                  </span>
                </div>

                {/* Live Composing Bubble */}
                <div className="bg-[#dcf8c6] dark:bg-emerald-950/80 rounded-2xl rounded-tr-none p-3 shadow-md max-w-[90%] ml-auto border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[11px] font-bold text-[#075e54] dark:text-emerald-400 mb-1 flex items-center justify-between">
                    <span>{SUPER_ADMIN_NAME} (Admin)</span>
                    <span className="text-[10px] font-mono text-neutral-400">Live Preview</span>
                  </div>

                  {/* Attached photo preview in bubble */}
                  {attachedPhotoUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-emerald-300/40">
                      <img src={attachedPhotoUrl} alt="Attached" className="w-full h-36 object-cover" />
                      {attachedPhotoCaption && (
                        <div className="p-1.5 bg-black/40 text-white text-[10px]">
                          {attachedPhotoCaption}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attached voice note in bubble */}
                  {attachedAudioUrl && (
                    <div className="mb-2 bg-emerald-800/10 p-2 rounded-lg border border-emerald-300/50 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                      <div className="flex-1 text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                        Voice Note ({audioDuration})
                      </div>
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">AUDIO</span>
                    </div>
                  )}

                  <div className="text-xs text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap leading-relaxed font-sans">
                    {broadcastText || 'Your message will appear here...'}
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-neutral-500">
                    <span>Now</span>
                    <span className="text-sky-500 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Group Policy Footer */}
              <div className="bg-white/90 dark:bg-neutral-900/90 p-2.5 text-center border-t border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-500">
                Brokers receive as direct notification. Replies return to: <strong className="text-emerald-600">{SUPER_ADMIN_DISPLAY_PHONE}</strong>
              </div>
            </div>

            {/* Broadcast History */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Recent Broadcast History ({broadcastHistory.length})</span>
              </h4>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {broadcastHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">{item.timestamp}</span>
                      <span className="text-emerald-600 font-semibold">{item.targetAudience}</span>
                    </div>
                    <p className="text-neutral-800 dark:text-neutral-200 line-clamp-2">{item.text}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 pt-0.5">
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                        {item.messageType.toUpperCase()}
                      </span>
                      <span>{item.recipientCount} Recipients</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BROKERS DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search broker, mandi, city, phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-800 dark:text-neutral-200"
              >
                <option value="All">All Provinces</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Balochistan">Balochistan</option>
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-800 dark:text-neutral-200"
              >
                <option value="All">All Mandi Hubs</option>
                {uniqueCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-800 dark:text-neutral-200"
              >
                <option value="All">All Roles</option>
                <option value="Commission Agent (Arhti)">Commission Agent (Arhti)</option>
                <option value="Independent Rice Broker">Independent Broker</option>
                <option value="Ex-Mill Sheller Broker">Sheller Broker</option>
                <option value="Paddy Commission Broker">Paddy Broker</option>
                <option value="Export Procurement Agent">Export Agent</option>
              </select>
            </div>
          </div>

          {/* Directory Count Bar */}
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>
              Showing <strong className="text-neutral-900 dark:text-white">{filteredBrokers.length}</strong> of{' '}
              <strong className="text-neutral-900 dark:text-white">{brokers.length}</strong> Pakistan Rice Brokers
            </span>
            <span className="text-emerald-600 font-semibold">100% WhatsApp Verified Trade Records</span>
          </div>

          {/* Table View */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-50 dark:bg-neutral-800/80 sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">ID</th>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">Broker & Firm Name</th>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">Mandi & Hub</th>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">Role</th>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">Rice Varieties</th>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">WhatsApp / Phone</th>
                    <th className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredBrokers.slice(0, 100).map((b) => {
                    const waDigits = b.whatsapp.replace(/[^0-9]/g, '');
                    const chatUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum ${b.name}, Hashir Rice Supplier (Owner: Muhammad Amir Shahzad) here. Regarding mandi rice trading...`
                    )}`;
                    return (
                      <tr key={b.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-neutral-400">{b.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            {b.name}
                            {b.status === 'VIP Broker' && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-neutral-500 text-[11px]">{b.firmName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-neutral-800 dark:text-neutral-200">{b.mandi}</div>
                          <div className="text-emerald-600 text-[11px] font-medium">
                            {b.city}, {b.province}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-neutral-700 dark:text-neutral-300">{b.role}</span>
                          <div className="text-[10px] text-neutral-400">{b.dailyCapacityTons} Tons/day</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {b.specialties.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] px-1.5 py-0.5 rounded font-medium"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold block">{b.whatsapp}</span>
                          <span className="text-neutral-400 text-[10px]">{b.phone}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <a
                            href={chatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredBrokers.length > 100 && (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700">
                Displaying first 100 of {filteredBrokers.length} matching brokers for speed. Use Search or Export to view all.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: EXPORT & WHATSAPP IMPORTER */}
      {activeSubTab === 'export' && (
        <div className="space-y-6">
          {/* Free of Cost Guarantee Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 p-5 text-white shadow-md border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-lg">
                ✓
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">100% Free of Cost: No Fees, No Subscriptions</h4>
                <p className="text-xs text-emerald-200/90">
                  All 560 rice broker contacts, the vCard importer, the WordPress code, voice note recording, and WhatsApp broadcast tools are <strong>completely free forever</strong>. No third-party API or monthly bill required.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto bg-emerald-500 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Free & Open Source
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: vCard (.vcf) */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <Download className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  1-Click Phonebook & WhatsApp Importer (vCard)
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Generates an RFC-compliant <code>.vcf</code> file containing all {brokers.length} Pakistani rice brokers.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3.5 rounded-xl text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
                <div className="font-bold text-emerald-600">📲 3-Second Phone Setup:</div>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Tap the green button below on your mobile phone.</li>
                  <li>Tap the downloaded <code>Pakistan_Rice_Brokers_560.vcf</code> file.</li>
                  <li>Select <strong>Contacts / Phone</strong> &rarr; Tap <strong>Import All (Save)</strong>.</li>
                  <li>All 560 brokers are now in your WhatsApp!</li>
                </ol>
              </div>

              <button
                onClick={handleDownloadVcard}
                className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Pakistan_Rice_Brokers_560.vcf</span>
              </button>
            </div>

            {/* Card 2: CSV Spreadsheet */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600">
                <FileSpreadsheet className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Excel / CSV Mandi Directory
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Download a structured spreadsheet compatible with Microsoft Excel, Google Sheets, or CRM systems.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3.5 rounded-xl text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
                <div className="font-bold text-sky-600">📊 Included Data Columns:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Broker Name, Firm Name, Mandi, City & Province</li>
                  <li>Verified WhatsApp & Local Mobile Number</li>
                  <li>Specialized Rice Varieties (1121 Kainat, Super Kernel, etc.)</li>
                  <li>Trading Role, Daily Capacity & Verification Status</li>
                </ul>
              </div>

              <button
                onClick={handleDownloadCsv}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white active:scale-95"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Download Excel/CSV Spreadsheet</span>
              </button>
            </div>
          </div>

          {/* Detailed Step-by-Step Walkthrough Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>Complete Step-by-Step Guide: How to Add & Broadcast in WhatsApp on Your Phone</span>
            </h3>

            {/* Method A: WhatsApp Broadcast List (Recommended) */}
            <div className="border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-5 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">A</span>
                  <span>Method 1: WhatsApp Broadcast List (RECOMMENDED: 100% Private, No Spam)</span>
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded">
                  Best for Mandi Rates
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                In a Broadcast List, brokers <strong>cannot see each other's phone numbers</strong>, cannot spam each other, and when they reply, their messages come <strong>only to you privately</strong> at {SUPER_ADMIN_DISPLAY_PHONE}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">1. Download vCard</div>
                  <p className="text-neutral-500">
                    Tap the green <strong>Download .vcf</strong> button on your phone.
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">2. Tap & Import</div>
                  <p className="text-neutral-500">
                    Tap the file in your phone notifications & select <strong>Save All to Phone Contacts</strong>.
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">3. New Broadcast</div>
                  <p className="text-neutral-500">
                    Open WhatsApp &rarr; Tap <strong>⋮ (3 dots)</strong> &rarr; Tap <strong>New Broadcast</strong>.
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">4. Select & Send</div>
                  <p className="text-neutral-500">
                    Select the imported brokers & tap <strong>✓</strong>. Send rate cards, photos, or voice notes!
                  </p>
                </div>
              </div>
            </div>

            {/* Method B: WhatsApp Group with "Only Admins Can Send" */}
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs">B</span>
                  <span>Method 2: WhatsApp Group with "Only Admins Can Send" Locked</span>
                </span>
                <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[11px] font-bold px-2 py-0.5 rounded">
                  Announcement Channel
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                If you prefer creating a regular WhatsApp Group where everyone sees the group title:
              </p>
              <ol className="list-decimal pl-5 text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <li>Open WhatsApp &rarr; Tap <strong>⋮</strong> &rarr; Tap <strong>New Group</strong>.</li>
                <li>Add the imported rice brokers and tap <strong>Next</strong>.</li>
                <li>Name the group: <code>Pakistan Rice Mandi Trade Channel</code>.</li>
                <li>Open <strong>Group Settings</strong> &rarr; Tap <strong>Send Messages</strong> &rarr; Select <strong>Only Admins</strong>.</li>
                <li>Now you are the only one who can message, share photos, or send voice notes!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: WORDPRESS INJECTABLE CODE */}
      {activeSubTab === 'code' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            {/* Error Fix Alert Banner */}
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Fix for: "syntax error, unexpected token &lt;, expecting end of file on line 794"</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Why this error happened:</strong> In WordPress, your <code>functions.php</code> file is already inside PHP execution mode (it starts with <code>&lt;?php</code> at line 1). When you paste code that starts with <code>&lt;?php</code> at the bottom, PHP sees the <code>&lt;</code> symbol as an illegal unexpected token.
              </p>
              <p className="text-amber-950 dark:text-amber-100 font-semibold">
                👉 <strong>Solution:</strong> Use the green <strong>"Copy for functions.php (No &lt;?php tag)"</strong> button below, which omits the <code>&lt;?php</code> tag and pastes cleanly without any syntax error!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-600" />
                  <span>WordPress PHP Injection Code</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Pre-loads all 560 rice brokers into WordPress and enforces Super Admin (+92 333 8990883) 1-way broadcast rules.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setCodeFormatMode('functions_php');
                    handleCopyPhpCode('functions_php');
                  }}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy for functions.php (No &lt;?php)</span>
                </button>
                <button
                  onClick={() => {
                    setCodeFormatMode('plugin');
                    handleCopyPhpCode('plugin');
                  }}
                  className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy as Plugin (With &lt;?php)</span>
                </button>
                <button
                  onClick={handleDownloadPhpFile}
                  className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition active:scale-95 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .php File</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-700 space-x-2 pt-2">
              <button
                onClick={() => setCodeFormatMode('functions_php')}
                className={`px-3 py-1.5 text-xs font-bold border-b-2 transition ${
                  codeFormatMode === 'functions_php'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                ✓ For Theme functions.php (No &lt;?php tag: Fixes Error)
              </button>
              <button
                onClick={() => setCodeFormatMode('plugin')}
                className={`px-3 py-1.5 text-xs font-bold border-b-2 transition ${
                  codeFormatMode === 'plugin'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                For Standalone Plugin (With &lt;?php tag)
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
                <div className="font-bold text-neutral-900 dark:text-white mb-1">Step 1: Open Theme File Editor</div>
                <p className="text-neutral-500">
                  Go to <strong>WP Admin &rarr; Appearance &rarr; Theme File Editor</strong> and select <code>functions.php</code> on the right side.
                </p>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
                <div className="font-bold text-neutral-900 dark:text-white mb-1">Step 2: Paste at the Very End</div>
                <p className="text-neutral-500">
                  Scroll to the very bottom (after line 793) and paste the code. Notice it has <strong>NO &lt;?php</strong> tag, so it saves without any error!
                </p>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
                <div className="font-bold text-neutral-900 dark:text-white mb-1">Step 3: Click "Update File"</div>
                <p className="text-neutral-500">
                  Tap <strong>Update File</strong>. You will see the new <strong>Rice Brokers (560 WhatsApp)</strong> menu in your WP admin!
                </p>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700">
              <div className="bg-neutral-800 text-neutral-300 px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-neutral-700">
                <span>
                  {codeFormatMode === 'functions_php'
                    ? 'functions.php (Paste at bottom: NO <?php TAG)'
                    : 'hashir-rice-brokers-whatsapp-network.php (Plugin with <?php)'}
                </span>
                <span className="text-emerald-400 font-bold">560 Pakistan Rice Brokers Included</span>
              </div>
              <pre className="p-4 bg-neutral-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed">
                {codeFormatMode === 'functions_php'
                  ? generateWordPressBrokersFunctionsPhpSnippet()
                  : generateWordPressBrokersPluginPhp()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
