import React, { useState } from 'react';
import {
  Boxes,
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Building2,
  DollarSign,
  Phone,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { SellerSample, SellerUser } from '../../types';
import { INITIAL_SELLER_USERS, INITIAL_SELLER_SAMPLES, RICE_VARIETY_CATEGORIES } from '../../data/sellerSamplesData';

interface AdminSellerControlProps {
  sellerSamples: SellerSample[];
  setSellerSamples: React.Dispatch<React.SetStateAction<SellerSample[]>>;
  onSuccessToast?: (msg: string) => void;
}

export const AdminSellerControl: React.FC<AdminSellerControlProps> = ({
  sellerSamples,
  setSellerSamples,
  onSuccessToast,
}) => {
  const [activeTab, setActiveTab] = useState<'sellers' | 'lots' | 'commission'>('sellers');
  const [sellers, setSellers] = useState<SellerUser[]>(() => {
    const saved = localStorage.getItem('hashir_rice_admin_sellers_list');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_USERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [editingSeller, setEditingSeller] = useState<SellerUser | null>(null);
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [editingLot, setEditingLot] = useState<SellerSample | null>(null);

  // New seller form
  const [sellerForm, setSellerForm] = useState<Partial<SellerUser>>({
    fullName: '',
    companyName: '',
    mandiLocation: 'Noor Galla Mandi, Bucheki',
    city: 'Bucheki',
    whatsappNumber: '+92 333 8990883',
    email: '',
    role: 'miller',
    isVerified: true,
  });

  // New lot form
  const [lotForm, setLotForm] = useState<Partial<SellerSample>>({
    varietyName: '1121 Kainat Steam Basmati',
    varietyCategory: 'basmati',
    processingGrade: 'Double Silky Polished',
    sellerName: 'Hashir Rice Supplier',
    sellerCompany: 'Hashir Rice Supplier (Owner: Muhammad Amir Shahzad)',
    sellerMandiLocation: 'Shop #4 Noor Galla Mandi',
    sellerCity: 'Bucheki',
    sellerWhatsApp: '+92 333 8990883',
    sellerEmail: 'trade@hashirricesupplier.com',
    isVerifiedSeller: true,
    totalLotSize: '50 Tons (1000 Bags)',
    remainingStock: '50 Tons (1000 Bags)',
    remainingStockNumber: 50,
    stockUnit: 'Tons',
    stockStatus: 'available',
    averageGrainLength: '8.35 mm',
    cookedLength: '19.5 mm',
    moisturePercent: '12.0%',
    brokenPercent: '1.5%',
    cropYear: '2026 (Fresh Harvest)',
    askingRatePkr: 'Rs. 13,200 / 40kg',
    priceType: 'Ex-Mill',
    minimumOrder: '5 Tons',
    sampleCourierAvailable: true,
    labReportAvailable: true,
    description: 'Certified Basmati Lot with guaranteed grain elongation.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'
  });

  const saveSellersToStorage = (updated: SellerUser[]) => {
    setSellers(updated);
    localStorage.setItem('hashir_rice_admin_sellers_list', JSON.stringify(updated));
  };

  const handleToggleVerify = (id: string) => {
    const updated = sellers.map((s) => (s.id === id ? { ...s, isVerified: !s.isVerified } : s));
    saveSellersToStorage(updated);
    if (onSuccessToast) onSuccessToast(`Seller verification status updated.`);
  };

  const handleDeleteSeller = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove seller ${name}?`)) {
      const updated = sellers.filter((s) => s.id !== id);
      saveSellersToStorage(updated);
      if (onSuccessToast) onSuccessToast(`Seller ${name} removed from exchange.`);
    }
  };

  const handleSaveSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerForm.fullName || !sellerForm.companyName) return;

    if (editingSeller) {
      const updated = sellers.map((s) => (s.id === editingSeller.id ? { ...s, ...sellerForm } as SellerUser : s));
      saveSellersToStorage(updated);
      if (onSuccessToast) onSuccessToast(`Seller ${sellerForm.fullName} updated.`);
    } else {
      const newEntry: SellerUser = {
        id: `seller-${Date.now()}`,
        fullName: sellerForm.fullName || 'Miller',
        companyName: sellerForm.companyName || 'Rice Mill',
        mandiLocation: sellerForm.mandiLocation || 'Bucheki Mandi',
        city: sellerForm.city || 'Bucheki',
        whatsappNumber: sellerForm.whatsappNumber || '+92 333 8990883',
        email: sellerForm.email || 'seller@mandi.pk',
        role: sellerForm.role || 'miller',
        isVerified: sellerForm.isVerified ?? true,
        joinedDate: new Date().toISOString().split('T')[0],
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      };
      saveSellersToStorage([newEntry, ...sellers]);
      if (onSuccessToast) onSuccessToast(`New Seller ${newEntry.fullName} registered into system.`);
    }
    setShowAddSellerModal(false);
    setEditingSeller(null);
  };

  const handleDeleteLot = (id: string) => {
    if (window.confirm(`Are you sure you want to delete lot ${id}?`)) {
      setSellerSamples((prev) => prev.filter((lot) => lot.id !== id));
      if (onSuccessToast) onSuccessToast(`Lot ${id} deleted.`);
    }
  };

  const handleSaveLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotForm.varietyName || !lotForm.askingRatePkr) return;

    if (editingLot) {
      setSellerSamples((prev) => prev.map((l) => (l.id === editingLot.id ? { ...l, ...lotForm } as SellerSample : l)));
      if (onSuccessToast) onSuccessToast(`Lot ${editingLot.id} updated.`);
    } else {
      const newLot: SellerSample = {
        id: `sample-lot-${Math.floor(1000 + Math.random() * 9000)}`,
        sellerId: 'seller-hashir-hq',
        sellerName: lotForm.sellerName || 'Hashir Rice Supplier',
        sellerCompany: lotForm.sellerCompany || 'Hashir Rice Supplier (Owner: Muhammad Amir Shahzad)',
        sellerMandiLocation: lotForm.sellerMandiLocation || 'Bucheki Mandi',
        sellerCity: lotForm.sellerCity || 'Bucheki',
        sellerWhatsApp: lotForm.sellerWhatsApp || '+92 333 8990883',
        sellerEmail: lotForm.sellerEmail || 'trade@hashirricesupplier.com',
        isVerifiedSeller: true,
        varietyName: lotForm.varietyName || '1121 Kainat Steam',
        varietyCategory: (lotForm.varietyCategory as any) || 'basmati',
        processingGrade: lotForm.processingGrade || 'Double Silky Polished',
        sampleImageUrl: lotForm.sampleImageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
        totalLotSize: lotForm.totalLotSize || '50 Tons',
        remainingStock: lotForm.remainingStock || '50 Tons',
        remainingStockNumber: Number(lotForm.remainingStockNumber) || 50,
        stockUnit: (lotForm.stockUnit as any) || 'Tons',
        stockStatus: (lotForm.stockStatus as any) || 'available',
        averageGrainLength: lotForm.averageGrainLength || '8.35 mm',
        cookedLength: lotForm.cookedLength || '19.5 mm',
        moisturePercent: lotForm.moisturePercent || '12.0%',
        brokenPercent: lotForm.brokenPercent || '1.5%',
        cropYear: lotForm.cropYear || '2026',
        askingRatePkr: lotForm.askingRatePkr || 'Rs. 13,200 / 40kg',
        priceType: (lotForm.priceType as any) || 'Ex-Mill',
        minimumOrder: lotForm.minimumOrder || '5 Tons',
        sampleCourierAvailable: lotForm.sampleCourierAvailable ?? true,
        labReportAvailable: lotForm.labReportAvailable ?? true,
        description: lotForm.description || 'Verified grain lot.',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setSellerSamples([newLot, ...sellerSamples]);
      if (onSuccessToast) onSuccessToast(`New sample lot ${newLot.id} published.`);
    }
    setShowAddLotModal(false);
    setEditingLot(null);
  };

  const filteredSellers = sellers.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-300">
              Mandi Broker & Seller Control
            </span>
            <span className="text-xs text-[#646970]">Full Super-Admin Permissions</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <Users className="w-5 h-5 text-indigo-700" />
            Seller Accounts, Physical Samples & Brokerage Control
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingSeller(null);
              setSellerForm({
                fullName: '',
                companyName: '',
                mandiLocation: 'Noor Galla Mandi, Bucheki',
                city: 'Bucheki',
                whatsappNumber: '+92 333 8990883',
                email: '',
                role: 'miller',
                isVerified: true
              });
              setShowAddSellerModal(true);
            }}
            className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Seller / Miller</span>
          </button>

          <button
            onClick={() => {
              setEditingLot(null);
              setShowAddLotModal(true);
            }}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Sample Lot</span>
          </button>
        </div>
      </div>

      {/* TABS (Sellers, Live Lots, Commission Settings) */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-[#dcdcde] bg-[#f6f7f7] px-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'sellers'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Registered Millers & Sellers ({sellers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lots')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'lots'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Live Grain Sample Lots ({sellerSamples.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('commission')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'commission'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Brokerage Commission & KYC Policy</span>
          </button>
        </div>

        <div className="p-5">
          {/* TAB 1: ALL SELLERS */}
          {activeTab === 'sellers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8c8f94]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sellers by name, mill, city..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#8c8f94] rounded bg-white focus:border-[#2271b1] outline-none"
                  />
                </div>
                <span className="text-xs text-[#646970]">{filteredSellers.length} Sellers found</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                      <th className="p-3">Seller Name & Mill</th>
                      <th className="p-3">Mandi Location & City</th>
                      <th className="p-3">Contact WhatsApp</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3 text-right">Actions (Edit / Delete)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dcdcde]">
                    {filteredSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-[#f6f7f7]">
                        <td className="p-3">
                          <div className="font-bold text-[#1d2327]">{seller.fullName}</div>
                          <div className="text-[11px] text-[#646970]">{seller.companyName}</div>
                          <span className="text-[10px] font-mono text-neutral-400">{seller.id}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-[#1d2327]">📍 {seller.city}</div>
                          <div className="text-[11px] text-[#50575e]">{seller.mandiLocation}</div>
                        </td>
                        <td className="p-3 font-mono text-[#2271b1] font-semibold">
                          {seller.whatsappNumber}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800 border border-neutral-300">
                            {seller.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleVerify(seller.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              seller.isVerified
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                            }`}
                            title="Click to toggle verification"
                          >
                            {seller.isVerified ? <Check className="w-3 h-3 text-emerald-700" /> : <X className="w-3 h-3 text-amber-700" />}
                            <span>{seller.isVerified ? 'Verified Mill' : 'Pending KYC'}</span>
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingSeller(seller);
                              setSellerForm(seller);
                              setShowAddSellerModal(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#8c8f94] rounded text-xs font-semibold"
                          >
                            <Edit className="w-3 h-3 inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSeller(seller.id, seller.fullName)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE GRAIN LOTS */}
          {activeTab === 'lots' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                      <th className="p-3">Lot ID & Rice Variety</th>
                      <th className="p-3">Seller / Mill</th>
                      <th className="p-3">Specs (Raw / Cooked)</th>
                      <th className="p-3">Stock Available</th>
                      <th className="p-3">Asking Rate</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dcdcde]">
                    {sellerSamples.map((lot) => (
                      <tr key={lot.id} className="hover:bg-[#f6f7f7]">
                        <td className="p-3">
                          <div className="font-bold text-[#1d2327]">{lot.varietyName}</div>
                          <span className="font-mono text-[10px] text-[#646970]">{lot.id}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-[#1d2327]">{lot.sellerName}</div>
                          <div className="text-[11px] text-[#50575e]">{lot.sellerCompany}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-[#1d2327]">{lot.averageGrainLength} raw</div>
                          <div className="text-[11px] text-emerald-800">{lot.cookedLength} cooked</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-900">{lot.remainingStock}</td>
                        <td className="p-3 font-bold text-[#2271b1]">{lot.askingRatePkr}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            lot.stockStatus === 'available'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : lot.stockStatus === 'low-stock'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-neutral-200 text-neutral-800'
                          }`}>
                            {lot.stockStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingLot(lot);
                              setLotForm(lot);
                              setShowAddLotModal(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#8c8f94] rounded text-xs font-semibold"
                          >
                            Edit Lot
                          </button>
                          <button
                            onClick={() => handleDeleteLot(lot.id)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COMMISSION & KYC */}
          {activeTab === 'commission' && (
            <div className="space-y-4 max-w-2xl text-xs">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Mandi Standard Brokerage Structure
                </h4>
                <p className="text-emerald-800">
                  Hashir Rice Supplier operates with a strict 1% mandi commission model on settled trades, collected upon weighbridge and bilty verification.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Default Mandi Commission (%)</label>
                  <input
                    type="number"
                    defaultValue="1.0"
                    step="0.1"
                    className="w-32 px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Free Courier Sample Policy</label>
                  <select className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs bg-white">
                    <option value="free">Free Sample for Verified Foodservice Buyers</option>
                    <option value="freight">Courier Freight on Buyer (Sample Grain Free)</option>
                    <option value="paid">Standard Flat Fee</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => { if (onSuccessToast) onSuccessToast('Brokerage & KYC settings updated.'); }}
                  className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold text-xs"
                >
                  Save Policy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT SELLER */}
      {showAddSellerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-700" />
                <span>{editingSeller ? 'Edit Seller Account' : 'Register New Rice Miller / Seller'}</span>
              </h3>
              <button onClick={() => setShowAddSellerModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleSaveSeller} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={sellerForm.fullName}
                    onChange={(e) => setSellerForm({ ...sellerForm, fullName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    placeholder="e.g. Mian Tariq"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Company / Mill Name</label>
                  <input
                    type="text"
                    required
                    value={sellerForm.companyName}
                    onChange={(e) => setSellerForm({ ...sellerForm, companyName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    placeholder="e.g. Chenab Rice Mills"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={sellerForm.city}
                    onChange={(e) => setSellerForm({ ...sellerForm, city: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Mandi Location</label>
                  <input
                    type="text"
                    required
                    value={sellerForm.mandiLocation}
                    onChange={(e) => setSellerForm({ ...sellerForm, mandiLocation: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={sellerForm.whatsappNumber}
                    onChange={(e) => setSellerForm({ ...sellerForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Role</label>
                  <select
                    value={sellerForm.role}
                    onChange={(e) => setSellerForm({ ...sellerForm, role: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="miller">Miller / Processor</option>
                    <option value="commission-agent">Commission Agent (Arhti)</option>
                    <option value="broker">Broker</option>
                    <option value="exporter">Exporter</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVerifiedCheckbox"
                  checked={sellerForm.isVerified}
                  onChange={(e) => setSellerForm({ ...sellerForm, isVerified: e.target.checked })}
                  className="rounded text-[#2271b1]"
                />
                <label htmlFor="isVerifiedCheckbox" className="font-semibold text-[#1d2327]">
                  Verify Seller KYC & Grant Active Live Trade Rights
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowAddSellerModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                >
                  {editingSeller ? 'Save Changes' : 'Register Seller'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LOT */}
      {showAddLotModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-700" />
                <span>{editingLot ? 'Edit Sample Lot' : 'Publish New Grain Sample Lot'}</span>
              </h3>
              <button onClick={() => setShowAddLotModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleSaveLot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Rice Variety Name</label>
                  <input
                    type="text"
                    required
                    value={lotForm.varietyName}
                    onChange={(e) => setLotForm({ ...lotForm, varietyName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Variety Category</label>
                  <select
                    value={lotForm.varietyCategory || '1121-kainat'}
                    onChange={(e) => setLotForm({ ...lotForm, varietyCategory: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    {RICE_VARIETY_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Asking Rate (PKR)</label>
                  <input
                    type="text"
                    required
                    value={lotForm.askingRatePkr}
                    onChange={(e) => setLotForm({ ...lotForm, askingRatePkr: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold text-[#2271b1]"
                    placeholder="e.g. Rs. 13,200 / 40kg"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Remaining Stock</label>
                  <input
                    type="text"
                    required
                    value={lotForm.remainingStock}
                    onChange={(e) => setLotForm({ ...lotForm, remainingStock: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold text-emerald-800"
                    placeholder="e.g. 50 Tons (1000 Bags)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Raw Grain Length (mm)</label>
                  <input
                    type="text"
                    value={lotForm.averageGrainLength}
                    onChange={(e) => setLotForm({ ...lotForm, averageGrainLength: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Cooked Length (mm)</label>
                  <input
                    type="text"
                    value={lotForm.cookedLength}
                    onChange={(e) => setLotForm({ ...lotForm, cookedLength: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Stock Status</label>
                  <select
                    value={lotForm.stockStatus}
                    onChange={(e) => setLotForm({ ...lotForm, stockStatus: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Price Terms</label>
                  <select
                    value={lotForm.priceType}
                    onChange={(e) => setLotForm({ ...lotForm, priceType: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="Ex-Mill">Ex-Mill</option>
                    <option value="FOR Dispatch">FOR Dispatch</option>
                    <option value="Mandi Spot">Mandi Spot</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowAddLotModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold"
                >
                  {editingLot ? 'Save Lot' : 'Publish Lot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
