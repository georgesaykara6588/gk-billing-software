iimport React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Package,
  Users,
  RotateCcw,
  ShoppingCart,
  AlertTriangle
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
  type: 'B2B' | 'B2C' | 'Return';
  status: 'Completed' | 'Pending' | 'Returned';
}

interface Product {
  id: string;
  name: string;
  hsn: string;
  stock: number;
  minStock: number;
  price: number;
  gstPercent: number;
}

interface Party {
  id: string;
  name: string;
  phone: string;
  gstin: string;
  type: 'Customer' | 'Supplier';
  balance: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // --- LOCALSTORAGE PERSISTED STATES ---
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

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vyapar_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: '1', name: 'Software License', hsn: '9973', stock: 45, minStock: 10, price: 25500, gstPercent: 18 },
      { id: '2', name: 'Cloud Hosting Monthly', hsn: '9973', stock: 8, minStock: 15, price: 7500, gstPercent: 18 },
      { id: '3', name: 'POS Thermal Printer', hsn: '8443', stock: 4, minStock: 5, price: 8900, gstPercent: 18 }
    ];
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('vyapar_parties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: '1', name: 'TechCorp Solutions Ltd', phone: '9876543210', gstin: '29ABCDE1234F1ZH', type: 'Customer', balance: 30090 },
      { id: '2', name: 'Aarav Sharma', phone: '9123456789', gstin: 'URP', type: 'Customer', balance: 0 }
    ];
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('vyapar_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('vyapar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vyapar_parties', JSON.stringify(parties));
  }, [parties]);

  // --- INVOICE BUILDER & FORM STATES ---
  const [customerName, setCustomerName] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>(
    [{ id: '1', name: '', hsn: '9983', qty: 1, rate: 0, gstPercent: 18 }]
  );
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // --- NEW ITEM / INVENTORY STATES ---
  const [newProdName, setNewProdName] = useState('');
  const [newProdHsn, setNewProdHsn] = useState('9983');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdMinStock, setNewProdMinStock] = useState(5);
  const [newProdPrice, setNewProdPrice] = useState(0);

  // --- NEW PARTY STATES ---
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyPhone, setNewPartyPhone] = useState('');
  const [newPartyGstin, setNewPartyGstin] = useState('');

  // --- RETURN / CREDIT NOTE STATES ---
  const [returnInvoiceId, setReturnInvoiceId] = useState('');
  const [returnReason, setReturnReason] = useState('Defective Item');

  // --- CALCULATION UTILITIES ---
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

  const totalSales = invoices.filter(i => i.type !== 'Return').reduce((acc, inv) => acc + calculateTotals(inv.items).grandTotal, 0);
  const totalGstCollected = invoices.filter(i => i.type !== 'Return').reduce((acc, inv) => acc + calculateTotals(inv.items).totalGst, 0);

  // --- HANDLERS ---
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

  const handleSelectPredefinedProduct = (index: number, prodName: string) => {
    const found = products.find(p => p.name === prodName);
    if (found) {
      setItems(items.map((item, i) => i === index ? {
        ...item,
        name: found.name,
        hsn: found.hsn,
        rate: found.price,
        gstPercent: found.gstPercent
      } : item));
    }
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

    // Deduct Stock Quantity
    setProducts(products.map(prod => {
      const match = items.find(i => i.name.toLowerCase() === prod.name.toLowerCase());
      if (match) {
        return { ...prod, stock: Math.max(0, prod.stock - match.qty) };
      }
      return prod;
    }));

    setInvoices([newInv, ...invoices]);
    setCustomerName('');
    setCustomerGSTIN('');
    setItems([{ id: '1', name: '', hsn: '9983', qty: 1, rate: 0, gstPercent: 18 }]);
    setActiveTab('Invoices');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Product = {
      id: Date.now().toString(),
      name: newProdName,
      hsn: newProdHsn,
      stock: Number(newProdStock),
      minStock: Number(newProdMinStock),
      price: Number(newProdPrice),
      gstPercent: 18
    };
    setProducts([...products, newP]);
    setNewProdName('');
    setNewProdPrice(0);
  };

  const handleCreateParty = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Party = {
      id: Date.now().toString(),
      name: newPartyName,
      phone: newPartyPhone,
      gstin: newPartyGstin || 'URP',
      type: 'Customer',
      balance: 0
    };
    setParties([...parties, newP]);
    setNewPartyName('');
    setNewPartyPhone('');
    setNewPartyGstin('');
  };

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find(i => i.id === returnInvoiceId);
    if (inv) {
      const returnInv: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `RET-${inv.invoiceNumber}`,
        customerName: inv.customerName,
        customerGSTIN: inv.customerGSTIN,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: 'Return',
        status: 'Returned',
        items: inv.items
      };

      // Restock inventory
      setProducts(products.map(prod => {
        const match = inv.items.find(i => i.name.toLowerCase() === prod.name.toLowerCase());
        if (match) {
          return { ...prod, stock: prod.stock + match.qty };
        }
        return prod;
      }));

      setInvoices([returnInv, ...invoices]);
      setReturnInvoiceId('');
      alert(`Return Note RET-${inv.invoiceNumber} processed successfully and inventory restored!`);
    }
  };

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
              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-widest">Enterprise Edition</span>
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
                  { name: 'POS Billing', icon: ShoppingCart, badge: 'Rapid' },
                  { name: 'Invoices', icon: FileText, badge: invoices.length.toString() },
                  { name: 'Inventory & Stock', icon: Package, badge: products.filter(p => p.stock <= p.minStock).length ? 'Alert' : undefined },
                  { name: 'Parties Ledger', icon: Users },
                  { name: 'Sales Returns', icon: RotateCcw }
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
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          item.badge === 'Alert' ? 'bg-rose-500/20 text-rose-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* REPORTS & SUPPORT */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 mb-2">Reports & GST</p>
              <nav className="space-y-1">
                {[
                  { name: 'Analytics', icon: BarChart3 },
                  { name: 'Settings', icon: Settings }
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
            Vyapar Pro Active 👑
          </p>
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
            All GST, Inventory & POS features unlocked
          </p>
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
            <span className="text-gray-400">Vyapar Pro</span>
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

        {/* VIEW 1: DASHBOARD & POS */}
        {(activeTab === 'Dashboard' || activeTab === 'POS Billing') && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Overview & POS Dashboard</h1>
                <p className="text-xs text-gray-400 mt-0.5">Real-time business insights and rapid billing counter</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setInvoices([])} className="bg-[#1b1e26] border border-white/5 px-3.5 py-2 rounded-xl text-xs text-gray-300 hover:text-white transition-colors">
                  Reset Demo Data
                </button>
              </div>
            </div>

            {/* HERO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-600/20 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-black/20 backdrop-blur-md rounded-xl">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">Total Revenue</span>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline justify-between">
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
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white tracking-tight">₹{totalGstCollected.toLocaleString()}</span>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full font-semibold">GSTR-1 Ready</span>
                </div>
              </div>

              <div className="bg-[#1b1e26] border border-white/5 p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-white/5 rounded-xl text-gray-300">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Low Stock Items</span>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{products.filter(p => p.stock <= p.minStock).length}</span>
                  <span className="text-[11px] text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Reorder Needed
                  </span>
                </div>
              </div>
            </div>

            {/* INVOICE BUILDER FORM */}
            <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-500" /> Create New Tax Invoice / POS Entry
              </h2>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Customer / Party Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. TechCorp Solutions Ltd" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full bg-[#1b1e26] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Customer GSTIN (Blank for B2C URP)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 29ABCDE1234F1ZH" 
                      value={customerGSTIN}
                      onChange={(e) => setCustomerGSTIN(e.target.value)}
                      className="w-full bg-[#1b1e26] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Line Items & Stock Selection</label>
                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                      <select
                        onChange={(e) => handleSelectPredefinedProduct(idx, e.target.value)}
                        className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="">Select Predefined Inventory Item</option>
                        {products.map(p => (
                          <option key={p.id} value={p.name}>{p.name} (Qty: {p.stock} left)</option>
                        ))}
                      </select>

                      <input 
                        type="text" 
                        placeholder="Item Description" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        required
                        className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="HSN" 
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
                    <span>Add Another Item Row</span>
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

        {/* VIEW 2: INVENTORY & STOCK */}
        {activeTab === 'Inventory & Stock' && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">Inventory & Stock Tracking</h1>
            
            {/* Add New Product */}
            <div className="bg-[#13151b] border border-white/5 p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Add New Product to Inventory</h2>
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input 
                  type="text" 
                  placeholder="Product Name" 
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <input 
                  type="text" 
                  placeholder="HSN Code" 
                  value={newProdHsn}
                  onChange={(e) => setNewProdHsn(e.target.value)}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <input 
                  type="number" 
                  placeholder="Stock Qty" 
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <input 
                  type="number" 
                  placeholder="Price (₹)" 
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <button type="submit" className="bg-orange-500 text-white font-semibold rounded-xl text-xs py-2.5">
                  Save Product
                </button>
              </form>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500 uppercase tracking-wider font-semibold border-b border-white/5">
                  <tr>
                    <th className="pb-3 pl-2">Product Name</th>
                    <th className="pb-3">HSN</th>
                    <th className="pb-3">Current Stock</th>
                    <th className="pb-3">Min Threshold</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-4 pl-2 font-semibold text-white">{p.name}</td>
                      <td className="py-4 font-mono text-gray-400">{p.hsn}</td>
                      <td className="py-4 font-bold text-white">{p.stock} units</td>
                      <td className="py-4 text-gray-400">{p.minStock} units</td>
                      <td className="py-4 font-bold text-orange-400">₹{p.price.toLocaleString()}</td>
                      <td className="py-4">
                        {p.stock <= p.minStock ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: PARTIES LEDGER */}
        {activeTab === 'Parties Ledger' && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">Parties & Receivables Ledger</h1>
            
            <div className="bg-[#13151b] border border-white/5 p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Add New Customer / Supplier</h2>
              <form onSubmit={handleCreateParty} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" 
                  placeholder="Party Name" 
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  required
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={newPartyPhone}
                  onChange={(e) => setNewPartyPhone(e.target.value)}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <input 
                  type="text" 
                  placeholder="GSTIN (Blank for URP)" 
                  value={newPartyGstin}
                  onChange={(e) => setNewPartyGstin(e.target.value)}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />
                <button type="submit" className="bg-orange-500 text-white font-semibold rounded-xl text-xs py-2.5">
                  Save Party
                </button>
              </form>
            </div>

            <div className="bg-[#13151b] border border-white/5 rounded-3xl p-6">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500 uppercase tracking-wider font-semibold border-b border-white/5">
                  <tr>
                    <th className="pb-3 pl-2">Party Name</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">GSTIN</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Outstanding Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {parties.map((party) => (
                    <tr key={party.id}>
                      <td className="py-4 pl-2 font-semibold text-white">{party.name}</td>
                      <td className="py-4 text-gray-400">{party.phone}</td>
                      <td className="py-4 font-mono text-gray-400">{party.gstin}</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                          {party.type}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-emerald-400">₹{party.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: SALES RETURNS / CREDIT NOTES */}
        {activeTab === 'Sales Returns' && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">Sales Returns & Credit Notes</h1>
            
            <div className="bg-[#13151b] border border-white/5 p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Process Sales Return</h2>
              <form onSubmit={handleProcessReturn} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select 
                  value={returnInvoiceId}
                  onChange={(e) => setReturnInvoiceId(e.target.value)}
                  required
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="">Select Invoice to Return</option>
                  {invoices.filter(i => i.type !== 'Return').map(i => (
                    <option key={i.id} value={i.id}>{i.invoiceNumber} - {i.customerName}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  placeholder="Reason for Return" 
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="bg-[#1b1e26] border border-white/5 rounded-xl p-2.5 text-xs text-white"
                />

                <button type="submit" className="bg-rose-500 text-white font-semibold rounded-xl text-xs py-2.5">
                  Process Credit Note & Restock
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 5: INVOICES & PRINT MODAL TRIGGER */}
        {activeTab === 'Invoices' && (
          <div className="p-8 space-y-6 max-w-[1400px] w-full mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Issued Tax Invoices</h1>
                <p className="text-xs text-gray-400 mt-0.5">Manage, print, and export your legal billing receipts</p>
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
                        <td className="py-4 font-mono text-orange-400 font-semibold">{inv.invoiceNumber}</td>
                        <td className="py-4 font-mono text-gray-400">{inv.customerGSTIN}</td>
                        <td className="py-4 text-gray-400">{inv.date}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.type === 'B2B' ? 'bg-indigo-500/20 text-indigo-300' : inv.type === 'Return' ? 'bg-rose-500/20 text-rose-300' : 'bg-gray-500/20 text-gray-300'}`}>
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
                  })}
                </tbody>
              </table>
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