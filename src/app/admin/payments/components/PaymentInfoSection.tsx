import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: number;
  method: string;
  type: 'QR' | 'Direct Transfer' | 'FPX' | 'Cash' | 'Other';
  accountName: string;
  accountNumber: string;
  bankName: string;
  details: string;
  enabled: boolean;
}

const initialMethods: PaymentMethod[] = [
  { id: 1, method: 'DuitNow QR', type: 'QR', accountName: 'Arena IRC Sdn Bhd', accountNumber: '1234567890', bankName: 'Maybank', details: 'Scan QR code to pay instantly via any Malaysian banking app.', enabled: true },
  { id: 2, method: 'Maybank Direct Transfer', type: 'Direct Transfer', accountName: 'Arena IRC Sdn Bhd', accountNumber: '5678 9012 3456', bankName: 'Maybank', details: 'Transfer directly to our Maybank account. Send receipt via WhatsApp after payment.', enabled: true },
  { id: 3, method: 'CIMB Direct Transfer', type: 'Direct Transfer', accountName: 'Arena IRC Sdn Bhd', accountNumber: '8012 3456 7890', bankName: 'CIMB Bank', details: 'Transfer to CIMB account. Please include booking ID as reference.', enabled: true },
  { id: 4, method: 'FPX Online Banking', type: 'FPX', accountName: 'Arena IRC Sdn Bhd', accountNumber: 'N/A', bankName: 'All Malaysian Banks', details: 'Pay securely via FPX using your preferred Malaysian bank account.', enabled: true },
  { id: 5, method: 'Cash Payment', type: 'Cash', accountName: 'Arena IRC Office', accountNumber: 'N/A', bankName: 'N/A', details: 'Cash payment accepted at the Arena IRC office during operating hours (Mon–Sat, 8AM–5:30PM).', enabled: false },
];

const emptyMethod: Omit<PaymentMethod, 'id'> = {
  method: '', type: 'Direct Transfer', accountName: '', accountNumber: '', bankName: '', details: '', enabled: true,
};

const typeColors: Record<string, string> = {
  'QR': 'bg-accent/10 text-accent',
  'Direct Transfer': 'bg-blue-400/10 text-blue-400',
  'FPX': 'bg-purple-400/10 text-purple-400',
  'Cash': 'bg-[#25D366]/10 text-[#25D366]',
  'Other': 'bg-white/10 text-white/50',
};

const typeIcons: Record<string, string> = {
  'QR': 'QrCodeIcon',
  'Direct Transfer': 'BanknotesIcon',
  'FPX': 'CreditCardIcon',
  'Cash': 'CurrencyDollarIcon',
  'Other': 'EllipsisHorizontalCircleIcon',
};

export default function PaymentInfoSection() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<PaymentMethod, 'id'>>(emptyMethod);
  const [savedMsg, setSavedMsg] = useState('');

  const showSaved = (msg = 'Saved successfully!') => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const openAdd = () => {
    setForm(emptyMethod);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (m: PaymentMethod) => {
    const { id, ...rest } = m;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    showSaved('Payment method deleted.');
  };

  const handleToggle = (id: number) => {
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setMethods((prev) => prev.map((m) => (m.id === editingId ? { ...form, id: editingId } : m)));
      showSaved('Payment method updated!');
    } else {
      setMethods((prev) => [...prev, { ...form, id: Date.now() }]);
      showSaved('Payment method added!');
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyMethod);
  };

  const paymentTypes = ['QR', 'Direct Transfer', 'FPX', 'Cash', 'Other'] as const;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Payment Info</h2>
          <p className="text-white/40 text-sm mt-1">Manage payment methods — QR, direct transfer, FPX and more</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shrink-0"
        >
          <Icon name="PlusIcon" size={14} />
          Add Method
        </button>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-5">
          <Icon name="CheckCircleIcon" size={16} className="text-[#25D366]" />
          <p className="text-[#25D366] text-sm font-bold">{savedMsg}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 mb-6 space-y-5">
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">
            {editingId !== null ? 'Edit Payment Method' : 'Add Payment Method'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Method Name</label>
              <input
                type="text"
                value={form.method}
                onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))}
                required
                placeholder="e.g. Maybank Direct Transfer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as PaymentMethod['type'] }))}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {paymentTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#1A1A1A]">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Account Name</label>
              <input
                type="text"
                value={form.accountName}
                onChange={(e) => setForm((p) => ({ ...p, accountName: e.target.value }))}
                required
                placeholder="e.g. Arena IRC Sdn Bhd"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value }))}
                placeholder="e.g. 1234 5678 9012"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}
                placeholder="e.g. Maybank"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, enabled: !p.enabled }))}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.enabled ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label="Toggle enabled"
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.enabled ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-white/60 text-sm font-medium">{form.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Instructions / Details</label>
              <textarea
                value={form.details}
                onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                rows={3}
                placeholder="Payment instructions for customers..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">
              {editingId !== null ? 'Update Method' : 'Add Method'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m) => (
          <div key={m.id} className={`glass-card rounded-2xl p-5 flex flex-col gap-4 ${!m.enabled ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon name={(typeIcons[m.type] || 'CreditCardIcon') as 'CreditCardIcon'} size={18} className="text-white/50" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${typeColors[m.type] || typeColors['Other']}`}>
                      {m.type}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${m.enabled ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-white/10 text-white/30'}`}>
                      {m.enabled ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <p className="text-white font-black text-sm">{m.method}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(m.id)}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${m.enabled ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label={`Toggle ${m.method}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${m.enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/30 font-medium">Account Name</span>
                <span className="text-white font-bold">{m.accountName}</span>
              </div>
              {m.accountNumber !== 'N/A' && (
                <div className="flex justify-between">
                  <span className="text-white/30 font-medium">Account No.</span>
                  <span className="text-white font-bold font-mono">{m.accountNumber}</span>
                </div>
              )}
              {m.bankName !== 'N/A' && (
                <div className="flex justify-between">
                  <span className="text-white/30 font-medium">Bank</span>
                  <span className="text-white font-bold">{m.bankName}</span>
                </div>
              )}
            </div>

            <p className="text-white/30 text-xs leading-relaxed border-t border-white/5 pt-3">{m.details}</p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => openEdit(m)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Edit payment method"
              >
                <Icon name="PencilSquareIcon" size={13} />
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                aria-label="Delete payment method"
              >
                <Icon name="TrashIcon" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
