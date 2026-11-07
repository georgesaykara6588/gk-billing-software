import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  FileText, 
  TrendingUp, 
  Plus, 
  Search,
  Users,
  CreditCard,
  ArrowUpRight,
  Sparkles
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
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'gstr1'>('dashboard');
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      customerName: 'TechCorp Solutions Ltd',
      customerGSTIN: '29ABCDE1234F1ZH',
      date: '2026-11-05',
      type: 'B2B',
      items: [
        { id: 'item-1', name: 'Wireless Router', hsn: '8517', qty: 5, rate: 2500, gstPercent: 18 },
        { id: 'item-2', name: 'Cat6 Cable (Roll)', hsn: '8544', qty: 2, rate: 4500, gstPercent: 18 }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      customerName: 'Ramesh Kumar',
      customerGSTIN: 'URP',
      date: '2026-11-06',
      type: 'B2C',
      items: [
        { id: 'item-3', name: 'Mechanical Keyboard', hsn: '8471', qty: 1, rate: 3500, gstPercent: 18 }
      ]
    }
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', hsn: '', qty: 1, rate: 0, gstPercent: 18 }
  ]);

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
      date: new Date().toISOString().split('T')[0],
      type: customerGSTIN ? 'B2B' : 'B2C',
      items
    };
    setInvoices([newInv, ...invoices]);
    setCustomerName('');
    setCustomerGSTIN('');
    setItems([{ id: '1', name: '', hsn: '', qty: 1, rate: 0, gstPercent: 18 }]);
    setActiveTab('invoices');
  };

  const stats = {
    totalSales: invoices.reduce((acc, inv) => acc + calculateTotals(inv.items).grandTotal, 0),
    totalGst: invoices.reduce((acc, inv) => acc + calculateTotals(inv.items).totalGst, 0),
    count: invoices.length
  };

  return (
    <div className="flex h-screen bg-[#0b0c10] text-gray-100 overflow-hidden font-sans">
      {/* macOS Side Bar */}
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col justify-between p-4 z-20">
        <div>
          {/* Mac Traffic Lights & App Brand */}
          <div className="flex items-center space-x-2 px-3 pt-2 pb-6">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>

          <div className="px-3 pb-6 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl apple-button flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white leading-none">Vyapar Pro</h1>
              <p className="text-xs text-gray-400 mt-1 font-medium">Accounting</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-sm backdrop-blur-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('invoices')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${activeTab === 'invoices' ? 'bg-white/10 text-white shadow-sm backdrop-blur-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Invoices</span>
            </button>
            <button 
              onClick={() => setActiveTab('gstr1')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${activeTab === 'gstr1' ? 'bg-white/10 text-white shadow-sm backdrop-blur-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>GSTR-1 Statutory</span>
            </button>
          </nav>
        </div>

        <div className="px-3 py-3 glass-card rounded-2xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs font-bold">
            GA
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">George Aykara</p>
            <p className="text-[10px] text-gray-400 truncate">Pro License</p>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0b0c10] via-[#12141c] to-[#0b0c10] p-10">
        
        {/* Top Header Bar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white capitalize">{activeTab}</h2>
            <p className="text-xs text-gray-400 mt-1">Real-time business insights and billing</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="apple-input text-xs rounded-full pl-9 pr-4 py-2 text-white placeholder-gray-500 w-64"
            />
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-card p-6 rounded-3xl transition-all duration-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Revenue</span>
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-white tracking-tight">₹{stats.totalSales.toLocaleString()}</span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center">
                    +12.4% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl transition-all duration-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">GST Collected</span>
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-white tracking-tight">₹{stats.totalGst.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 font-medium">Monthly tax liability</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl transition-all duration-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Invoices</span>
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-white tracking-tight">{stats.count}</span>
                  <span className="text-xs text-emerald-400 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Invoice Builder Panel */}
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Create Tax Invoice</h3>
                  <p className="text-xs text-gray-400">Generate instantly styled invoice receipts</p>
                </div>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Customer Name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="apple-input p-3.5 rounded-2xl text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Customer GSTIN (Optional)" 
                    value={customerGSTIN}
                    onChange={(e) => setCustomerGSTIN(e.target.value)}
                    className="apple-input p-3.5 rounded-2xl text-xs text-white"
                  />
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-5 gap-3 items-center">
                      <input 
                        type="text" 
                        placeholder="Item Description" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        required
                        className="apple-input p-3 rounded-xl text-xs text-white col-span-2"
                      />
                      <input 
                        type="number" 
                        placeholder="Qty" 
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                        className="apple-input p-3 rounded-xl text-xs text-white"
                      />
                      <input 
                        type="number" 
                        placeholder="Rate (₹)" 
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="apple-input p-3 rounded-xl text-xs text-white"
                      />
                      <select 
                        value={item.gstPercent}
                        onChange={(e) => updateItem(item.id, 'gstPercent', Number(e.target.value))}
                        className="apple-input p-3 rounded-xl text-xs text-white bg-[#191b23]"
                      >
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                        <option value={28}>28% GST</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={addItem} 
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                  <button 
                    type="submit" 
                    className="apple-button text-white font-medium px-6 py-2.5 rounded-full text-xs"
                  >
                    Generate Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Invoice</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => {
                  const totals = calculateTotals(inv.items);
                  return (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-medium text-indigo-400">{inv.invoiceNumber}</td>
                      <td className="p-4 font-medium text-white">{inv.customerName}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${inv.type === 'B2B' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`}>
                          {inv.type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{inv.date}</td>
                      <td className="p-4 text-right font-bold text-white">₹{totals.grandTotal.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'gstr1' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-3xl space-y-3">
              <h3 className="text-base font-semibold text-white">B2B Supplies</h3>
              <p className="text-xs text-gray-400">Registered business supplies</p>
              <div className="pt-2 text-3xl font-bold text-indigo-400 tracking-tight">
                ₹{invoices.filter(i => i.type === 'B2B').reduce((acc, i) => acc + calculateTotals(i.items).grandTotal, 0).toLocaleString()}
              </div>
            </div>
            <div className="glass-panel p-8 rounded-3xl space-y-3">
              <h3 className="text-base font-semibold text-white">B2C Supplies</h3>
              <p className="text-xs text-gray-400">Consumer end-user sales</p>
              <div className="pt-2 text-3xl font-bold text-emerald-400 tracking-tight">
                ₹{invoices.filter(i => i.type === 'B2C').reduce((acc, i) => acc + calculateTotals(i.items).grandTotal, 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}