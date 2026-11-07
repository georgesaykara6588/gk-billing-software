import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Receipt, 
  FileText, 
  Repeat, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Mail, 
  User, 
  Share2, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstPercent: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerGSTIN: string;
  date: string;
  items: InvoiceItem[];
  type: 'B2B' | 'B2C';
  status: 'Completed' | 'Pending' | 'Failed';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      customerName: 'TechCorp Solutions Ltd',
      customerGSTIN: '29ABCDE1234F1ZH',
      date: '17 Apr, 2026',
      type: 'B2B',
      status: 'Completed',
      items: [{ id: '1', name: 'Software License', hsn: '9973', qty: 1, rate: 25500, gstPercent: 18 }]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      customerName: 'Aarav Sharma',
      customerGSTIN: 'URP',
      date: '16 Apr, 2026',
      type: 'B2C',
      status: 'Completed',
      items: [{ id: '2', name: 'Cloud Hosting Monthly', hsn: '9973', qty: 2, rate: 7500, gstPercent: 18 }]
    }
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>(
    [{ id: '1', name: '', hsn: '', qty: 1, rate: 0, gstPercent: 18 }]
  );

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', hsn: '', qty: 1, rate: 0, gstPercent: 18 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotals = (itemList: InvoiceItem[]) => {
    let subtotal = 0;
    let totalGst = 0;
    itemList.forEach(item => {
      const itemTotal = item.qty * item.rate;
      const gst = (itemTotal * item.gstPercent) / 100;
      subtotal += itemTotal;
      totalGst += gst;
    });
    return { subtotal, totalGst, grandTotal: subtotal + totalGst };
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2026-00${invoices.length + 1}`,
      customerName,
      customerGSTIN: customerGSTIN || 'URP',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: customerGSTIN ? 'B2B' : 'B2C',
      status: 'Completed',
      items
    };
    setInvoices([newInv, ...invoices]);
    setCustomerName('');
    setCustomerGSTIN('');
    setItems([{ id: '1', name: '', hsn: '', qty: 1, rate: 0, gstPercent: 18 }]);
  };

  const totalSales = invoices.reduce((acc, inv) => acc + calculateTotals(inv.items).grandTotal, 0);

  return (
    <div className="flex h-screen bg-[#0e0f12] text-gray-200 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#13151b] border-r border-white/5 flex flex-col justify-between p-5 select-none z-20">
        <div>
          {/* Brand Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-wide text-white">Fintrixity</span>
          </div>

          {/* Search Box */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#1b1e26] border border-white/5 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
            />
            <span className="absolute right-3 top-2.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">⌘K</span>
          </div>

          {/* Menu Section */}
          <div className="space-y-6">
            <div>
              <nav className="space-y-1">
                {[
                  { name: 'Dashboard', icon: LayoutDashboard },
                  { name: 'Analytics', icon: BarChart3, badge: '20' },
                  { name: 'Transactions', icon: Receipt },
                  { name: 'Invoices', icon: FileText }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active 
                          ? 'bg-[#1b1e26] text-white font-semibold shadow-inner border border-white/5' 
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-orange-500' : 'text-gray-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* FEATURES SECTION */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 mb-2">Features</p>
              <nav className="space-y-1">
                {[
                  { name: 'Recurring', icon: Repeat, badge: '10' },
                  { name: 'Subscriptions', icon: CreditCard },
                  { name: 'Feedback', icon: MessageSquare }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-white/10 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* SUPPORT SECTION */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 mb-2">Support</p>
              <nav className="space-y-1">
                {[
                  { name: 'Settings', icon: Settings },
                  { name: 'Help Desk', icon: HelpCircle },
                  { name: 'Logout', icon: LogOut }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* UPGRADE PRO CARD */}
        <div className="bg-[#1b1e26] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
          <p className="text-xs font-semibold text-white flex items-center gap-1.5">
            Upgrade Pro! 👑
          </p>
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
            Higher productivity with better organization
          </p>
          <div className="mt-3 flex items-center justify-between">
            <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-90 transition-opacity">
              ⚡ Upgrade
            </button>
            <button className="text-[11px] text-gray-400 hover:text-white transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0e0f12]">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#0e0f12]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <button className="p-1.5 bg-[#1b1e26] rounded-lg hover:text-white transition-colors">←</button>
            <button className="p-1.5 bg-[#1b1e26] rounded-lg hover:text-white transition-colors">→</button>
            <span className="text-gray-600 px-2">/</span>
            <span className="text-gray-400">Fintrixity</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 bg-[#1b1e26] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="p-2 bg-[#1b1e26] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-2 bg-[#1b1e26] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 overflow-hidden border border-white/10 flex items-center justify-center text-white font-bold text-xs">
              GA
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 flex items-center space-x-1.5 hover:opacity-90 transition-opacity">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          {/* OVERVIEW TITLE & CONTROLS */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
              <p className="text-xs text-gray-400 mt-0.5">Here is the summary of overall data</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-[#1b1e26] border border-white/5 px-3.5 py-2 rounded-xl text-xs text-gray-300 flex items-center space-x-2 cursor-pointer hover:border-white/10 transition-colors">
                <span>This Month</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90 text-gray-500" />
              </div>
              <button className="bg-[#1b1e26] border border-white/5 px-3.5 py-2 rounded-xl text-xs text-gray-300 flex items-center space-x-2 hover:text-white transition-colors">
                <span>Reset Data</span>
              </button>
            </div>
          </div>

          {/* TOP 3 HERO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* My Balance Card (Orange gradient) */}
            <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-black/20 backdrop-blur-md rounded-xl">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">My balance</span>
                </div>
                <span className="text-xl font-bold opacity-80 cursor-pointer">•••</span>
              </div>
              <p className="text-[11px] opacity-80 mt-1 relative z-10">Wallet Overview & Spending</p>
              
              <div className="mt-6 flex items-baseline justify-between relative z-10">
                <span className="text-3xl font-extrabold tracking-tight">₹{totalSales.toLocaleString()}</span>
                <span className="text-[11px] bg-black/20 backdrop-blur-md px-2 py-1 rounded-full font-semibold flex items-center space-x-1">
                  <span>+1.5%</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-white/20 flex justify-between items-center text-xs font-semibold relative z-10 cursor-pointer hover:opacity-80 transition-opacity">
                <span>See details</span>
                <span>→</span>
              </div>
            </div>

            {/* Savings Account Card */}
            <div className="bg-[#1b1e26] border border-white/5 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/5 rounded-xl text-gray-300">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Savings account</span>
                </div>
                <span className="text-xl font-bold text-gray-500 cursor-pointer">•••</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Steady Growth Savings</p>
              
              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">₹24,800.45</span>
                <span className="text-[11px] text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full font-semibold flex items-center space-x-1">
                  <span>-2.2%</span>
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-gray-400 group-hover:text-white transition-colors cursor-pointer">
                <span>View summary</span>
                <span>→</span>
              </div>
            </div>

            {/* Investment Portfolio Card */}
            <div className="bg-[#1b1e26] border border-white/5 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/5 rounded-xl text-gray-300">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Investment portfolio</span>
                </div>
                <span className="text-xl font-bold text-gray-500 cursor-pointer">•••</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Track Your Wealth Growth</p>
              
              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">₹70,120.78</span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full font-semibold flex items-center space-x-1">
                  <span>+4.7%</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-gray-400 group-hover:text-white transition-colors cursor-pointer">
                <span>Analyze performance</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: WALLET & CASH FLOW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: My Wallet Currencies */}
            <div className="lg:col-span-5 bg-[#13151b] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Wallet</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">Today 1 USD = 122.20 BDT</p>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-md shadow-orange-500/20 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { flag: '🇺🇸', code: 'USD', val: '$24,678.00', sub: 'Limit $50k a month', status: 'Active' },
                    { flag: '🇪🇺', code: 'EUR', val: '€28,345.00', sub: 'Limit €45k a month', status: 'Active' },
                    { flag: '🇦🇺', code: 'AUD', val: '$20,517.52', sub: 'Limit $40k a month', status: 'Active' },
                    { flag: '🇬🇧', code: 'GBP', val: '£25,000.00', sub: 'Limit £35k a month', status: 'Vault' }
                  ].map((cur, idx) => (
                    <div key={idx} className="bg-[#1b1e26] border border-white/5 p-4 rounded-2xl relative">
                      <div className="flex justify-between items-start">
                        <span className="text-base">{cur.flag}</span>
                        <span className="text-[10px] font-bold text-gray-500">{cur.code}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-base font-bold text-white tracking-tight">{cur.val}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{cur.sub}</p>
                      </div>
                      <span className="inline-block mt-3 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {cur.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Cash Flow Chart */}
            <div className="lg:col-span-7 bg-[#13151b] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Cash Flow</h2>
                    <p className="text-2xl font-extrabold text-white tracking-tight mt-1">₹540,323.45</p>
                  </div>
                  <div className="bg-[#1b1e26] p-1 rounded-xl flex items-center space-x-1 border border-white/5 text-xs">
                    <button className="px-3 py-1 bg-white/10 rounded-lg text-white font-medium shadow">Monthly</button>
                    <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">Yearly</button>
                  </div>
                </div>

                {/* Bar Chart Visual */}
                <div className="h-48 flex items-end justify-between px-2 pt-6 relative border-b border-white/5">
                  {[
                    { month: 'Jan', h: '45%' },
                    { month: 'Feb', h: '35%' },
                    { month: 'Mar', h: '85%', active: true },
                    { month: 'Apr', h: '60%' },
                    { month: 'May', h: '75%' },
                    { month: 'Jun', h: '40%' },
                    { month: 'Jul', h: '55%' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-2 h-full justify-end group cursor-pointer">
                      {bar.active && (
                        <div className="absolute top-4 bg-[#1b1e26] border border-white/10 p-2.5 rounded-xl shadow-2xl text-[10px] space-y-1 z-20">
                          <p className="text-gray-400">July 25, 2026</p>
                          <div className="flex justify-between space-x-4">
                            <span className="text-gray-400">Cashflow:</span>
                            <span className="font-bold text-white">₹33,842.00</span>
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-gray-400">Inflow:</span>
                            <span className="font-bold text-emerald-400">₹7,486.00</span>
                          </div>
                        </div>
                      )}
                      <div 
                        style={{ height: bar.h }}
                        className={`w-10 rounded-xl transition-all duration-300 ${
                          bar.active 
                            ? 'bg-gradient-to-t from-orange-600 to-amber-500 shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/50' 
                            : 'bg-[#1b1e26] hover:bg-white/10'
                        }`}
                      ></div>
                      <span className="text-[11px] text-gray-500 font-medium">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: RECENT ACTIVITIES & INVOICES */}
          <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activities</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-[#1b1e26] border border-white/5 rounded-xl pl-8 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button className="bg-[#1b1e26] border border-white/5 px-3 py-1.5 rounded-xl text-xs text-gray-300 flex items-center space-x-1 hover:text-white transition-colors">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 uppercase tracking-wider font-semibold border-b border-white/5">
                <tr>
                  <th className="pb-3 pl-2">Activity</th>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {invoices.map((inv) => {
                  const totals = calculateTotals(inv.items);
                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2 font-medium text-white flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
                          {inv.customerName.charAt(0)}
                        </div>
                        <span>{inv.customerName}</span>
                      </td>
                      <td className="py-4 font-mono text-gray-400">{inv.invoiceNumber}</td>
                      <td className="py-4 text-gray-400">{inv.date}</td>
                      <td className="py-4 text-gray-400">03:45 PM</td>
                      <td className="py-4 font-bold text-white">₹{totals.grandTotal.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>{inv.status}</span>
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right text-gray-500 hover:text-white cursor-pointer font-bold">
                        •••
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* QUICK INVOICE GENERATOR FORM */}
          <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Create New Transaction / Invoice</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Customer Name (e.g. Acme Corp)" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <input 
                  type="text" 
                  placeholder="Customer GSTIN (Leave blank for B2C URP)" 
                  value={customerGSTIN}
                  onChange={(e) => setCustomerGSTIN(e.target.value)}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                    <input 
                      type="text" 
                      placeholder="Item Description" 
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      required
                      className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 md:col-span-2 focus:outline-none"
                    />
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                      className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                    <input 
                      type="number" 
                      placeholder="Rate (₹)" 
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                    <select 
                      value={item.gstPercent}
                      onChange={(e) => updateItem(item.id, 'gstPercent', Number(e.target.value))}
                      className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value={5}>5% GST</option>
                      <option value={12}>12% GST</option>
                      <option value={18}>18% GST</option>
                      <option value={28}>28% GST</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  onClick={addItem} 
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Item</span>
                </button>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity"
                >
                  Save & Publish Transaction
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}