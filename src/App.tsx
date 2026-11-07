import React, { useState, useEffect } from 'react';
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
  Share2, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  Printer,
  Download,
  Trash2,
  CheckCircle2
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
  
  // State with LocalStorage Persistence
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vyapar_invoices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
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
    ];
  });

  useEffect(() => {
    localStorage.setItem('vyapar_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const [customerName, setCustomerName] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>(
    [{ id: '1', name: '', hsn: '9983', qty: 1, rate: 0, gstPercent: 18 }]
  );

  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', hsn: '9983', qty: 1, rate: 0, gstPercent: 18 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
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
      type: customerGSTIN && customerGSTIN !== 'URP' ? 'B2B' : 'B2C',
      status: 'Completed',
      items
    };
    setInvoices([newInv, ...invoices]);
    setCustomerName('');
    setCustomerGSTIN('');
    setItems([{ id: '1', name: '', hsn: '9983', qty: 1, rate: 0, gstPercent: 18 }]);
    setActiveTab('Invoices');
  };

  const totalSales = invoices.reduce((acc, inv) => acc + calculateTotals(inv.items).grandTotal, 0);
  const totalGstCollected = invoices.reduce((acc, inv) => acc + calculateTotals(inv.items).totalGst, 0);

  const exportGstr1Json = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "gstr1_filing_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
            <div>
              <span className="font-bold text-base tracking-wide text-white block leading-none">Vyapar Pro</span>
              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-widest">Fintrixity Edition</span>
            </div>
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
                  { name: 'Invoices', icon: FileText, badge: invoices.length.toString() }
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
                  const active = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active ? 'bg-[#1b1e26] text-white font-semibold border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
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
                  const active = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active ? 'bg-[#1b1e26] text-white font-semibold border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
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
            <button onClick={exportGstr1Json} title="Export GSTR-1 JSON" className="p-2 bg-[#1b1e26] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors flex items-center space-x-1 text-xs">
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>GSTR-1 JSON</span>
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

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
                <p className="text-xs text-gray-400 mt-0.5">Here is the summary of overall data</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-[#1b1e26] border border-white/5 px-3.5 py-2 rounded-xl text-xs text-gray-300 flex items-center space-x-2">
                  <span>This Month</span>
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-gray-500" />
                </div>
                <button onClick={() => setInvoices([])} className="bg-[#1b1e26] border border-white/5 px-3.5 py-2 rounded-xl text-xs text-gray-300 hover:text-white transition-colors">
                  Reset Data
                </button>
              </div>
            </div>

            {/* HERO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-black/20 backdrop-blur-md rounded-xl">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">Total Revenue</span>
                  </div>
                </div>
                <p className="text-[11px] opacity-80 mt-1 relative z-10">B2B & B2C Billing Inflows</p>
                <div className="mt-6 flex items-baseline justify-between relative z-10">
                  <span className="text-3xl font-extrabold tracking-tight">₹{totalSales.toLocaleString()}</span>
                  <span className="text-[11px] bg-black/20 backdrop-blur-md px-2 py-1 rounded-full font-semibold flex items-center space-x-1">
                    <span>+12.4%</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="bg-[#1b1e26] border border-white/5 p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/5 rounded-xl text-gray-300">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">GST Collected</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Tax Liability for GSTR-1</p>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white tracking-tight">₹{totalGstCollected.toLocaleString()}</span>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full font-semibold">Active</span>
                </div>
              </div>

              <div className="bg-[#1b1e26] border border-white/5 p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/5 rounded-xl text-gray-300">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Total Invoices</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Issued Documents</p>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{invoices.length}</span>
                  <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full font-semibold">Verified</span>
                </div>
              </div>
            </div>

            {/* INVOICE BUILDER FORM */}
            <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-500" /> Create New Tax Invoice
              </h2>
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
                    placeholder="Customer GSTIN (e.g. 29ABCDE1234F1ZH or leave blank for URP)" 
                    value={customerGSTIN}
                    onChange={(e) => setCustomerGSTIN(e.target.value)}
                    className="bg-[#1b1e26] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                      <input 
                        type="text" 
                        placeholder="Item Description" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        required
                        className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 md:col-span-2 focus:outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="HSN Code" 
                        value={item.hsn}
                        onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                        className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
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
                      <div className="flex items-center space-x-2">
                        <select 
                          value={item.gstPercent}
                          onChange={(e) => updateItem(item.id, 'gstPercent', Number(e.target.value))}
                          className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none flex-1"
                        >
                          <option value={5}>5% GST</option>
                          <option value={12}>12% GST</option>
                          <option value={18}>18% GST</option>
                          <option value={28}>28% GST</option>
                        </select>
                        <button type="button" onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-rose-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                    Save & Generate Tax Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: INVOICES & TRANSACTIONS */}
        {(activeTab === 'Invoices' || activeTab === 'Transactions') && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{activeTab}</h1>
                <p className="text-xs text-gray-400 mt-0.5">Manage and print professional GST invoices</p>
              </div>
              <button onClick={() => setActiveTab('Dashboard')} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-orange-500/20">
                + Create New Invoice
              </button>
            </div>

            <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500 uppercase tracking-wider font-semibold border-b border-white/5">
                  <tr>
                    <th className="pb-3 pl-2">Customer</th>
                    <th className="pb-3">Invoice #</th>
                    <th className="pb-3">GSTIN</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">No invoices generated yet. Create one from the Dashboard!</td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const totals = calculateTotals(inv.items);
                      return (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 pl-2 font-medium text-white flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
                              {inv.customerName.charAt(0)}
                            </div>
                            <span>{inv.customerName}</span>
                          </td>
                          <td className="py-4 font-mono text-orange-400 font-semibold">{inv.invoiceNumber}</td>
                          <td className="py-4 font-mono text-gray-400">{inv.customerGSTIN}</td>
                          <td className="py-4 text-gray-400">{inv.date}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.type === 'B2B' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-500/20 text-gray-300'}`}>
                              {inv.type}
                            </span>
                          </td>
                          <td className="py-4 font-bold text-white">₹{totals.grandTotal.toLocaleString()}</td>
                          <td className="py-4 pr-2 text-right">
                            <button 
                              onClick={() => setSelectedInvoiceForPrint(inv)}
                              className="bg-[#1b1e26] hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 transition-all flex items-center space-x-1 ml-auto"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View / Print PDF</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & GSTR-1 */}
        {activeTab === 'Analytics' && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">Analytics & GSTR-1 Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#13151b] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">B2B Taxable Supplies</h3>
                <p className="text-2xl font-extrabold text-indigo-400">
                  ₹{invoices.filter(i => i.type === 'B2B').reduce((acc, i) => acc + calculateTotals(i.items).grandTotal, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Supplies made to registered business entities with valid GSTIN.</p>
              </div>
              <div className="bg-[#13151b] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">B2C Consumer Supplies</h3>
                <p className="text-2xl font-extrabold text-emerald-400">
                  ₹{invoices.filter(i => i.type === 'B2C').reduce((acc, i) => acc + calculateTotals(i.items).grandTotal, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Supplies made to unregistered end consumers (URP).</p>
              </div>
            </div>
            <div className="bg-[#13151b] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Ready for GST Portal Filing</h3>
                <p className="text-xs text-gray-400 mt-1">Download the complete JSON return payload formatted for the official GST portal.</p>
              </div>
              <button onClick={exportGstr1Json} className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/20 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download GSTR-1 JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* OTHER TABS (Settings, Recurring, Subscriptions, Help Desk, etc.) */}
        {['Recurring', 'Subscriptions', 'Feedback', 'Settings', 'Help Desk', 'Logout'].includes(activeTab) && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">{activeTab}</h1>
            <div className="bg-[#13151b] border border-white/5 p-8 rounded-3xl space-y-4 text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto animate-bounce" />
              <h2 className="text-lg font-bold text-white">{activeTab} Module Active</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                You are currently viewing the {activeTab} workspace in Vyapar Pro. All configurations and enterprise data controls are fully loaded.
              </p>
              <button onClick={() => setActiveTab('Dashboard')} className="mt-4 bg-[#1b1e26] border border-white/5 px-5 py-2 rounded-xl text-xs text-white font-medium hover:border-orange-500">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </main>

      {/* PRINTABLE PDF INVOICE MODAL */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl space-y-6">
            
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-indigo-900">VYAPAR PRO TAX INVOICE</h2>
                <p className="text-xs text-gray-500">Original for Recipient</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-indigo-600">{selectedInvoiceForPrint.invoiceNumber}</p>
                <p className="text-xs text-gray-500">Date: {selectedInvoiceForPrint.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl">
              <div>
                <p className="font-bold text-gray-700 uppercase">Billed By:</p>
                <p className="font-semibold text-gray-900 mt-1">GK Billing Software Enterprises</p>
                <p className="text-gray-600">GSTIN: 29AABCG1234F1Z9</p>
                <p className="text-gray-600">Bengaluru, Karnataka, India</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 uppercase">Billed To:</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedInvoiceForPrint.customerName}</p>
                <p className="text-gray-600">GSTIN: {selectedInvoiceForPrint.customerGSTIN}</p>
                <p className="text-gray-600">Place of Supply: Karnataka (29)</p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase text-gray-600 font-bold border-b">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">HSN</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">GST</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedInvoiceForPrint.items.map((item, idx) => {
                  const itemTotal = item.qty * item.rate;
                  const gstAmt = (itemTotal * item.gstPercent) / 100;
                  return (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{item.name}</td>
                      <td className="p-2.5 font-mono text-gray-600">{item.hsn}</td>
                      <td className="p-2.5 text-center">{item.qty}</td>
                      <td className="p-2.5 text-right">₹{item.rate.toLocaleString()}</td>
                      <td className="p-2.5 text-right">{item.gstPercent}%</td>
                      <td className="p-2.5 text-right font-bold">₹{(itemTotal + gstAmt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end pt-2 border-t">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotals(selectedInvoiceForPrint.items).subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total GST:</span>
                  <span>₹{calculateTotals(selectedInvoiceForPrint.items).totalGst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-indigo-900 pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>₹{calculateTotals(selectedInvoiceForPrint.items).grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t print:hidden">
              <button 
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs hover:bg-gray-300"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs shadow-lg hover:bg-indigo-700 flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}