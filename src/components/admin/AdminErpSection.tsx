import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  FileSpreadsheet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ShieldCheck,
  Building2,
  HardDrive
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface AdminErpSectionProps {
  onSuccessToast?: (msg: string) => void;
}

// 7-day, 15-day, 30-day simulated ERP datasets
const ERP_7D_DATA = [
  { date: 'Day 1', volumeTons: 140, revenuePkr: 21.5, biltyDispatches: 6, marginPercent: 7.2 },
  { date: 'Day 2', volumeTons: 190, revenuePkr: 29.8, biltyDispatches: 8, marginPercent: 7.8 },
  { date: 'Day 3', volumeTons: 220, revenuePkr: 34.2, biltyDispatches: 9, marginPercent: 8.1 },
  { date: 'Day 4', volumeTons: 175, revenuePkr: 27.0, biltyDispatches: 7, marginPercent: 7.5 },
  { date: 'Day 5', volumeTons: 310, revenuePkr: 48.5, biltyDispatches: 13, marginPercent: 8.4 },
  { date: 'Day 6', volumeTons: 280, revenuePkr: 43.1, biltyDispatches: 11, marginPercent: 8.0 },
  { date: 'Day 7', volumeTons: 340, revenuePkr: 52.8, biltyDispatches: 14, marginPercent: 8.6 },
];

const ERP_15D_DATA = [
  { date: 'Aug 17', volumeTons: 120, revenuePkr: 18.2, biltyDispatches: 5, marginPercent: 7.1 },
  { date: 'Aug 19', volumeTons: 160, revenuePkr: 24.5, biltyDispatches: 7, marginPercent: 7.4 },
  { date: 'Aug 21', volumeTons: 210, revenuePkr: 32.8, biltyDispatches: 9, marginPercent: 7.9 },
  { date: 'Aug 23', volumeTons: 290, revenuePkr: 45.0, biltyDispatches: 12, marginPercent: 8.3 },
  { date: 'Aug 25', volumeTons: 240, revenuePkr: 37.1, biltyDispatches: 10, marginPercent: 7.8 },
  { date: 'Aug 27', volumeTons: 310, revenuePkr: 48.2, biltyDispatches: 13, marginPercent: 8.4 },
  { date: 'Aug 29', volumeTons: 360, revenuePkr: 56.4, biltyDispatches: 15, marginPercent: 8.7 },
  { date: 'Aug 31', volumeTons: 340, revenuePkr: 52.8, biltyDispatches: 14, marginPercent: 8.6 },
];

const ERP_30D_DATA = [
  { date: 'W1 (Aug 1-7)', volumeTons: 980, revenuePkr: 152.0, biltyDispatches: 41, marginPercent: 7.4 },
  { date: 'W2 (Aug 8-14)', volumeTons: 1240, revenuePkr: 194.5, biltyDispatches: 52, marginPercent: 7.9 },
  { date: 'W3 (Aug 15-21)', volumeTons: 1420, revenuePkr: 221.8, biltyDispatches: 59, marginPercent: 8.2 },
  { date: 'W4 (Aug 22-31)', volumeTons: 1860, revenuePkr: 291.0, biltyDispatches: 78, marginPercent: 8.6 },
];

interface InventoryBatch {
  id: string;
  variety: string;
  godown: string;
  bags50kg: number;
  totalTons: number;
  moisturePercent: number;
  millingYield: number;
  agingMonths: number;
  status: 'In Stock' | 'Allocated' | 'Reserved';
}

interface DispatchBilty {
  biltyNo: string;
  truckNo: string;
  driverName: string;
  driverPhone: string;
  destination: string;
  variety: string;
  quantityTons: number;
  freightPkr: number;
  status: 'Dispatched' | 'In Transit' | 'Delivered' | 'Loading';
  date: string;
}

export const AdminErpSection: React.FC<AdminErpSectionProps> = ({ onSuccessToast }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '15d' | '30d'>('7d');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'warehouse' | 'logistics' | 'accounts' | 'procurement'>('overview');

  const [inventoryList, setInventoryList] = useState<InventoryBatch[]>([
    { id: 'BATCH-BK-8901', variety: '1121 Kainat Steam (8.35mm)', godown: 'Bucheki Silo A - HQ', bags50kg: 2400, totalTons: 120, moisturePercent: 11.8, millingYield: 69.2, agingMonths: 18, status: 'In Stock' },
    { id: 'BATCH-BK-8902', variety: 'Super Kernel Basmati Raw Old', godown: 'Bucheki Godown #4', bags50kg: 1800, totalTons: 90, moisturePercent: 12.0, millingYield: 67.8, agingMonths: 24, status: 'In Stock' },
    { id: 'BATCH-HF-4412', variety: '1509 Golden Sella Premium', godown: 'Hafizabad Processing Plant', bags50kg: 3200, totalTons: 160, moisturePercent: 12.4, millingYield: 71.0, agingMonths: 12, status: 'Allocated' },
    { id: 'BATCH-KM-7721', variety: 'Super Gold Creamy Sella', godown: 'Kamoke Parboiled Hub', bags50kg: 1400, totalTons: 70, moisturePercent: 12.1, millingYield: 70.4, agingMonths: 14, status: 'In Stock' },
    { id: 'BATCH-KH-1109', variety: 'IRRI-6 White 5% Broken', godown: 'Karachi Port Transit Godown', bags50kg: 5000, totalTons: 250, moisturePercent: 13.0, millingYield: 65.5, agingMonths: 6, status: 'Reserved' },
  ]);

  const [dispatches, setDispatches] = useState<DispatchBilty[]>([
    { biltyNo: 'BLT-9921', truckNo: 'TKL-9402', driverName: 'Umar Hayat', driverPhone: '+92 300 7812390', destination: 'Karachi (Jodia Bazar)', variety: '1121 Kainat Steam', quantityTons: 35, freightPkr: 145000, status: 'In Transit', date: '2026-08-31' },
    { biltyNo: 'BLT-9920', truckNo: 'LES-5512', driverName: 'Ghulam Rasool', driverPhone: '+92 312 4455667', destination: 'Lahore (Akbari Mandi)', variety: 'Super Kernel Raw', quantityTons: 20, freightPkr: 38000, status: 'Delivered', date: '2026-08-30' },
    { biltyNo: 'BLT-9919', truckNo: 'RWP-3301', driverName: 'Zahid Khan', driverPhone: '+92 333 9988112', destination: 'Rawalpindi (Gunj Mandi)', variety: '1509 Golden Sella', quantityTons: 25, freightPkr: 68000, status: 'In Transit', date: '2026-08-30' },
    { biltyNo: 'BLT-9918', truckNo: 'PSW-7744', driverName: 'Gul Faraz', driverPhone: '+92 345 8877119', destination: 'Peshawar (Ring Road)', variety: 'Super Gold Sella', quantityTons: 18, freightPkr: 72000, status: 'Dispatched', date: '2026-08-29' },
    { biltyNo: 'BLT-9917', truckNo: 'QTA-1209', driverName: 'Sardar Wali', driverPhone: '+92 331 6655443', destination: 'Quetta (Liaquat Bazar)', variety: 'IRRI-6 White Rice', quantityTons: 30, freightPkr: 125000, status: 'Delivered', date: '2026-08-28' },
  ]);

  // Modal States
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [showAddBiltyModal, setShowAddBiltyModal] = useState(false);

  // New batch form
  const [newBatch, setNewBatch] = useState<Partial<InventoryBatch>>({
    variety: '1121 Kainat Steam',
    godown: 'Bucheki Silo A - HQ',
    bags50kg: 1000,
    totalTons: 50,
    moisturePercent: 12.0,
    millingYield: 69.0,
    agingMonths: 12,
    status: 'In Stock'
  });

  // New bilty form
  const [newBilty, setNewBilty] = useState<Partial<DispatchBilty>>({
    biltyNo: `BLT-${Math.floor(1000 + Math.random() * 9000)}`,
    truckNo: 'TKL-8822',
    driverName: 'Muhammad Akram',
    driverPhone: '+92 301 5566778',
    destination: 'Karachi',
    variety: '1121 Kainat Steam',
    quantityTons: 25,
    freightPkr: 110000,
    status: 'Loading',
    date: new Date().toISOString().split('T')[0]
  });

  const chartData = timeRange === '7d' ? ERP_7D_DATA : timeRange === '15d' ? ERP_15D_DATA : ERP_30D_DATA;

  const totalTonsStock = inventoryList.reduce((acc, curr) => acc + curr.totalTons, 0);
  const totalBagsStock = inventoryList.reduce((acc, curr) => acc + curr.bags50kg, 0);

  const kpis = {
    '7d': { tradedTons: 1655, revenueM: '256.8M', dispatchesCount: 68, avgMargin: '8.1%' },
    '15d': { tradedTons: 3410, revenueM: '529.6M', dispatchesCount: 142, avgMargin: '8.0%' },
    '30d': { tradedTons: 5500, revenueM: '859.3M', dispatchesCount: 230, avgMargin: '8.2%' },
  }[timeRange];

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.variety || !newBatch.godown) return;
    const created: InventoryBatch = {
      id: `BATCH-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      variety: newBatch.variety || '1121 Kainat Steam',
      godown: newBatch.godown || 'Bucheki Silo A',
      bags50kg: Number(newBatch.bags50kg) || 500,
      totalTons: Number(newBatch.totalTons) || (Number(newBatch.bags50kg || 500) * 0.05),
      moisturePercent: Number(newBatch.moisturePercent) || 12.0,
      millingYield: Number(newBatch.millingYield) || 68.5,
      agingMonths: Number(newBatch.agingMonths) || 12,
      status: (newBatch.status as any) || 'In Stock'
    };
    setInventoryList([created, ...inventoryList]);
    setShowAddBatchModal(false);
    if (onSuccessToast) onSuccessToast(`Inventory Batch ${created.id} registered into ERP warehouse.`);
  };

  const handleCreateBilty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBilty.truckNo || !newBilty.destination) return;
    const created: DispatchBilty = {
      biltyNo: newBilty.biltyNo || `BLT-${Math.floor(1000 + Math.random() * 9000)}`,
      truckNo: newBilty.truckNo,
      driverName: newBilty.driverName || 'Driver',
      driverPhone: newBilty.driverPhone || '+92 300 0000000',
      destination: newBilty.destination,
      variety: newBilty.variety || '1121 Kainat Steam',
      quantityTons: Number(newBilty.quantityTons) || 20,
      freightPkr: Number(newBilty.freightPkr) || 50000,
      status: (newBilty.status as any) || 'Dispatched',
      date: newBilty.date || new Date().toISOString().split('T')[0]
    };
    setDispatches([created, ...dispatches]);
    setShowAddBiltyModal(false);
    if (onSuccessToast) onSuccessToast(`Freight Bilty ${created.biltyNo} logged for truck ${created.truckNo}.`);
  };

  return (
    <div className="space-y-6">
      {/* TOP ERP CONTROL BAR & TIME SELECTOR (7D, 15D, 30D) */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              Enterprise Mandi ERP Suite
            </span>
            <span className="text-xs text-[#646970] font-medium">Bucheki Central Hub</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <Building2 className="w-5 h-5 text-[#2271b1]" />
            Mandi ERP Operations & Analytics Control
          </h2>
        </div>

        {/* TIME DURATION TOGGLES (7 Days / 15 Days / 30 Days) */}
        <div className="flex items-center gap-2 bg-[#f0f0f1] p-1.5 rounded-lg border border-[#c3c4c7] self-start md:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#50575e] ml-1.5" />
          <span className="text-xs font-bold text-[#50575e] mr-1">Period:</span>
          {(['7d', '15d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                if (onSuccessToast) onSuccessToast(`ERP data filtered to last ${range === '7d' ? '7 Days' : range === '15d' ? '15 Days' : '30 Days'}`);
              }}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                timeRange === range
                  ? 'bg-[#2271b1] text-white shadow-xs'
                  : 'text-[#50575e] hover:text-[#1d2327] hover:bg-[#dcdcde]'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '15d' ? '15 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 TOP ERP METRICS CARDS FOR CURRENT PERIOD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#c3c4c7] rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Volume Traded ({timeRange.toUpperCase()})</span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#1d2327]">{kpis.tradedTons.toLocaleString()} MT</div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{(kpis.tradedTons * 25).toLocaleString()} Maunds</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#c3c4c7] rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Gross Revenue ({timeRange.toUpperCase()})</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-[#2271b1]">Rs. {kpis.revenueM}</div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Avg Margin: {kpis.avgMargin}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#c3c4c7] rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Active Silo Stock</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-[#1d2327]">{totalTonsStock} MT</div>
          <div className="text-[11px] text-[#50575e] font-medium">
            {totalBagsStock.toLocaleString()} Bags (50kg)
          </div>
        </div>

        <div className="p-4 bg-white border border-[#c3c4c7] rounded-lg shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Freight Dispatches</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#1d2327]">{kpis.dispatchesCount} Trucks</div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>99.4% On-Time Bilty Arrival</span>
          </div>
        </div>
      </div>

      {/* ERP SUB-TABS (Overview, Warehouse & Silos, Bilty Logistics, Accounts & Invoicing, Procurement) */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-[#dcdcde] bg-[#f6f7f7] px-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & {timeRange.toUpperCase()} Trends</span>
          </button>

          <button
            onClick={() => setActiveSubTab('warehouse')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'warehouse'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Warehouse & Silo Inventory ({inventoryList.length} Batches)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logistics')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'logistics'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Logistics & Bilty Fleet ({dispatches.length} Active)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'accounts'
                ? 'border-[#2271b1] text-[#2271b1] bg-white'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Mandi Accounts & Settlement</span>
          </button>
        </div>

        <div className="p-5">
          {/* SUBTAB 1: OVERVIEW & TIME-SERIES CHARTS */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume & Dispatches Chart */}
                <div className="bg-[#fcfcfc] border border-[#dcdcde] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#1d2327] flex items-center gap-1.5">
                      <Boxes className="w-4 h-4 text-[#2271b1]" />
                      <span>Metric Tons Traded ({timeRange.toUpperCase()})</span>
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-bold">Daily Grain Inflow</span>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTons" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2271b1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2271b1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#646970' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#646970' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1d2327', borderColor: '#3c434a', color: '#fff', borderRadius: '6px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="volumeTons" name="Tons Traded" stroke="#2271b1" fillOpacity={1} fill="url(#colorTons)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue & Margin Chart */}
                <div className="bg-[#fcfcfc] border border-[#dcdcde] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#1d2327] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Gross Revenue PKR Millions & Profit Margins</span>
                    </h3>
                    <span className="text-[11px] text-blue-700 font-bold">Mandi Brokerage</span>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#646970' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#646970' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1d2327', borderColor: '#3c434a', color: '#fff', borderRadius: '6px', fontSize: '12px' }} />
                        <Bar dataKey="revenuePkr" name="Revenue (PKR Million)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ERP DISPATCH CITY DISTRIBUTION */}
              <div className="bg-[#f6f7f7] border border-[#dcdcde] rounded-lg p-4">
                <h4 className="text-xs font-bold text-[#1d2327] mb-3">Freight Corridor Volume Share ({timeRange.toUpperCase()})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                  <div className="bg-white p-2.5 rounded border border-[#dcdcde]">
                    <span className="text-emerald-800 font-bold block text-sm">38%</span>
                    <span className="text-[#50575e]">Karachi (Sindh)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#dcdcde]">
                    <span className="text-blue-800 font-bold block text-sm">26%</span>
                    <span className="text-[#50575e]">Lahore (Punjab)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#dcdcde]">
                    <span className="text-purple-800 font-bold block text-sm">16%</span>
                    <span className="text-[#50575e]">Rawalpindi/Islamabad</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#dcdcde]">
                    <span className="text-amber-800 font-bold block text-sm">12%</span>
                    <span className="text-[#50575e]">Peshawar (KPK)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#dcdcde]">
                    <span className="text-rose-800 font-bold block text-sm">8%</span>
                    <span className="text-[#50575e]">Quetta (Balochistan)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: WAREHOUSE & SILO INVENTORY */}
          {activeSubTab === 'warehouse' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1d2327]">Physical Warehouse & Godown Stock Ledger</h3>
                  <p className="text-xs text-[#646970]">Real-time grain lots stored across Bucheki, Hafizabad, Kamoke, and Karachi godowns.</p>
                </div>
                <button
                  onClick={() => setShowAddBatchModal(true)}
                  className="px-3 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Inventory Batch</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                      <th className="p-3">Batch ID & Variety</th>
                      <th className="p-3">Godown Location</th>
                      <th className="p-3">Bags (50kg)</th>
                      <th className="p-3">Total Tons</th>
                      <th className="p-3">Moisture %</th>
                      <th className="p-3">Milling Yield</th>
                      <th className="p-3">Aging (Months)</th>
                      <th className="p-3">Stock Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dcdcde]">
                    {inventoryList.map((batch) => (
                      <tr key={batch.id} className="hover:bg-[#f6f7f7]">
                        <td className="p-3">
                          <div className="font-bold text-[#1d2327]">{batch.variety}</div>
                          <span className="font-mono text-[10px] text-[#646970]">{batch.id}</span>
                        </td>
                        <td className="p-3 font-semibold text-[#50575e]">📍 {batch.godown}</td>
                        <td className="p-3 font-bold text-[#1d2327]">{batch.bags50kg.toLocaleString()} Bags</td>
                        <td className="p-3 font-black text-[#2271b1]">{batch.totalTons} MT</td>
                        <td className="p-3 font-semibold text-emerald-800">{batch.moisturePercent}%</td>
                        <td className="p-3 text-[#50575e]">{batch.millingYield}%</td>
                        <td className="p-3 font-semibold text-amber-900">{batch.agingMonths} mos aged</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            batch.status === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : batch.status === 'Allocated'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 3: LOGISTICS & BILTY FLEET */}
          {activeSubTab === 'logistics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1d2327]">Logistics Fleet & Freight Bilty Tracker</h3>
                  <p className="text-xs text-[#646970]">Active road freight dispatches from Noor Galla Mandi Bucheki to all provinces.</p>
                </div>
                <button
                  onClick={() => setShowAddBiltyModal(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Freight Bilty</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                      <th className="p-3">Bilty # & Date</th>
                      <th className="p-3">Truck No & Driver</th>
                      <th className="p-3">Destination City</th>
                      <th className="p-3">Rice Variety</th>
                      <th className="p-3">Payload (Tons)</th>
                      <th className="p-3">Freight (PKR)</th>
                      <th className="p-3">Dispatch Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dcdcde]">
                    {dispatches.map((b) => (
                      <tr key={b.biltyNo} className="hover:bg-[#f6f7f7]">
                        <td className="p-3">
                          <div className="font-bold text-[#1d2327]">{b.biltyNo}</div>
                          <span className="text-[10px] text-[#646970]">{b.date}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-[#1d2327]">{b.truckNo}</div>
                          <div className="text-[11px] text-[#50575e]">{b.driverName} ({b.driverPhone})</div>
                        </td>
                        <td className="p-3 font-semibold text-[#1d2327]">📍 {b.destination}</td>
                        <td className="p-3 text-[#50575e]">{b.variety}</td>
                        <td className="p-3 font-bold text-emerald-800">{b.quantityTons} Tons</td>
                        <td className="p-3 font-bold text-[#2271b1]">Rs. {b.freightPkr.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : b.status === 'In Transit'
                              ? 'bg-sky-100 text-sky-900 border border-sky-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 4: MANDI ACCOUNTS & SETTLEMENTS */}
          {activeSubTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1d2327]">Mandi Commission & Accounts Settlement</h3>
                  <p className="text-xs text-[#646970]">Direct ledger tracking Bank Al Habib commercial deposits and 1% broker clearance.</p>
                </div>
                <button
                  onClick={() => { if (onSuccessToast) onSuccessToast('Account ledger exported as CSV.'); }}
                  className="px-3 py-1.5 bg-white border border-[#8c8f94] text-[#1d2327] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Ledger</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-[#f6f7f7] rounded-lg border border-[#dcdcde]">
                  <span className="text-xs text-[#646970]">Accounts Receivable (Wholesalers)</span>
                  <div className="text-xl font-bold text-[#1d2327] mt-1">Rs. 14,850,000</div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">92% within 7-day payment cycle</span>
                </div>
                <div className="p-3.5 bg-[#f6f7f7] rounded-lg border border-[#dcdcde]">
                  <span className="text-xs text-[#646970]">Accounts Payable (Rice Millers)</span>
                  <div className="text-xl font-bold text-amber-900 mt-1">Rs. 11,200,000</div>
                  <span className="text-[10px] text-blue-700 font-semibold block">Cleared on weighbridge bilty confirmation</span>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-semibold">1% Mandi Commission Pool</span>
                  <div className="text-xl font-bold text-emerald-900 mt-1">Rs. 2,568,000</div>
                  <span className="text-[10px] text-emerald-700 font-bold block">★ Net Brokerage Settled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD INVENTORY BATCH */}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#2271b1]" />
                <span>Add Physical Rice Batch to Warehouse</span>
              </h3>
              <button onClick={() => setShowAddBatchModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">Rice Variety</label>
                <input
                  type="text"
                  required
                  value={newBatch.variety}
                  onChange={(e) => setNewBatch({ ...newBatch, variety: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  placeholder="e.g. 1121 Kainat Steam (8.35mm)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Warehouse Godown</label>
                  <select
                    value={newBatch.godown}
                    onChange={(e) => setNewBatch({ ...newBatch, godown: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="Bucheki Silo A - HQ">Bucheki Silo A - HQ</option>
                    <option value="Bucheki Godown #4">Bucheki Godown #4</option>
                    <option value="Hafizabad Processing Plant">Hafizabad Processing Plant</option>
                    <option value="Kamoke Parboiled Hub">Kamoke Parboiled Hub</option>
                    <option value="Karachi Port Transit Godown">Karachi Port Transit Godown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Bags (50kg)</label>
                  <input
                    type="number"
                    required
                    value={newBatch.bags50kg}
                    onChange={(e) => {
                      const bags = Number(e.target.value);
                      setNewBatch({ ...newBatch, bags50kg: bags, totalTons: bags * 0.05 });
                    }}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Total Tons</label>
                  <input
                    type="number"
                    value={newBatch.totalTons}
                    readOnly
                    className="w-full px-3 py-1.5 bg-[#f0f0f1] border border-[#8c8f94] rounded font-bold text-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Moisture %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatch.moisturePercent}
                    onChange={(e) => setNewBatch({ ...newBatch, moisturePercent: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Milling Yield %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatch.millingYield}
                    onChange={(e) => setNewBatch({ ...newBatch, millingYield: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                >
                  Save Batch to Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW FREIGHT BILTY */}
      {showAddBiltyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Log New Road Freight Bilty</span>
              </h3>
              <button onClick={() => setShowAddBiltyModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleCreateBilty} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Bilty Number</label>
                  <input
                    type="text"
                    required
                    value={newBilty.biltyNo}
                    onChange={(e) => setNewBilty({ ...newBilty, biltyNo: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Truck Registration No</label>
                  <input
                    type="text"
                    required
                    value={newBilty.truckNo}
                    onChange={(e) => setNewBilty({ ...newBilty, truckNo: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none uppercase font-bold"
                    placeholder="e.g. TKL-9402"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={newBilty.driverName}
                    onChange={(e) => setNewBilty({ ...newBilty, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Driver Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newBilty.driverPhone}
                    onChange={(e) => setNewBilty({ ...newBilty, driverPhone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={newBilty.destination}
                    onChange={(e) => setNewBilty({ ...newBilty, destination: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    placeholder="e.g. Karachi (Jodia Bazar)"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Rice Variety</label>
                  <input
                    type="text"
                    required
                    value={newBilty.variety}
                    onChange={(e) => setNewBilty({ ...newBilty, variety: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Payload (Metric Tons)</label>
                  <input
                    type="number"
                    required
                    value={newBilty.quantityTons}
                    onChange={(e) => setNewBilty({ ...newBilty, quantityTons: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Freight Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newBilty.freightPkr}
                    onChange={(e) => setNewBilty({ ...newBilty, freightPkr: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowAddBiltyModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold"
                >
                  Log & Dispatch Bilty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
