import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Minus, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null); // product being adjusted
  const [adjForm, setAdjForm] = useState({ change_qty: '', reason: 'Restock', notes: '' });
  const [saving, setSaving] = useState(false);

  const REASONS = ['Restock','Production Run','Damaged Stock','Stocktake Correction','Transfer','Other'];

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inv, logData] = await Promise.all([
        api.get('/inventory'),
        api.get('/inventory/log'),
      ]);
      setProducts(inv.data.products);
      setLogs(logData.data);
    } catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  };

  const openAdjust = (p) => {
    setAdjusting(p);
    setAdjForm({ change_qty: '', reason: 'Restock', notes: '' });
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!adjForm.change_qty) return toast.error('Enter quantity');
    setSaving(true);
    try {
      await api.post('/inventory/adjust', {
        product_id: adjusting.id,
        change_qty: parseInt(adjForm.change_qty),
        reason: adjForm.reason,
        notes: adjForm.notes,
      });
      toast.success('Stock updated successfully');
      setAdjusting(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  const lowStock = products.filter(p => p.stock_qty <= p.min_stock_alert && p.active);

  return (
    <AdminLayout stats={{}}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-800">Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Track stock levels and log all adjustments.</p>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-800 text-sm mb-1">Low Stock Alert — {lowStock.length} product(s) need restocking</div>
              <div className="flex flex-wrap gap-2">
                {lowStock.map(p => (
                  <span key={p.id} className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {p.emoji} {p.name}: {p.stock_qty} bags
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stock Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 font-heading font-bold text-gray-700">Current Stock Levels</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Product</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">In Stock</th>
                  <th className="table-th">Min Alert</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Last Updated</th>
                  <th className="table-th">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
                ) : products.map(p => {
                  const isLow = p.stock_qty <= p.min_stock_alert;
                  const pct = Math.min(100, (p.stock_qty / (p.min_stock_alert * 2)) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{p.emoji}</span>
                          <span className="font-semibold text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="table-td text-sm text-gray-500">{p.category}</td>
                      <td className="table-td">
                        <div className="font-black text-lg text-gray-800">{p.stock_qty}</div>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-green-600'}`} style={{width:`${pct}%`}} />
                        </div>
                      </td>
                      <td className="table-td text-sm text-gray-500">{p.min_stock_alert} bags</td>
                      <td className="table-td">
                        <span className={`badge ${isLow ? 'badge-pending' : 'badge-delivered'}`}>
                          {isLow ? '⚠ Low Stock' : '✓ Sufficient'}
                        </span>
                      </td>
                      <td className="table-td text-xs text-gray-400">
                        {new Date(p.updated_at).toLocaleDateString()}
                      </td>
                      <td className="table-td">
                        <button onClick={() => openAdjust(p)}
                          className="btn-sm bg-green-50 text-green-800 hover:bg-green-100 font-semibold">
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 font-heading font-bold text-gray-700">Recent Stock Activity</div>
          {logs.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No activity recorded yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {logs.map(l => (
                <div key={l.id} className="flex items-center gap-4 px-6 py-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${l.change_qty > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {l.change_qty > 0 ? <TrendingUp size={15} className="text-green-700" /> : <TrendingDown size={15} className="text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{l.product_name}</div>
                    <div className="text-xs text-gray-400">{l.reason}{l.notes ? ` — ${l.notes}` : ''}</div>
                  </div>
                  <div className={`font-black text-sm ${l.change_qty > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {l.change_qty > 0 ? '+' : ''}{l.change_qty} bags
                  </div>
                  <div className="text-right text-xs text-gray-400 flex-shrink-0">
                    <div>{l.new_qty} remaining</div>
                    <div>{new Date(l.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Adjust Modal */}
      {adjusting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-heading font-black text-xl text-gray-800">Adjust Stock</h2>
                <p className="text-sm text-gray-500">{adjusting.emoji} {adjusting.name}</p>
              </div>
              <button onClick={() => setAdjusting(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">✕</button>
            </div>
            <form onSubmit={handleAdjust} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-gray-500 text-sm">Current Stock</div>
                <div className="font-heading font-black text-4xl text-gray-800">{adjusting.stock_qty}</div>
                <div className="text-gray-400 text-sm">bags</div>
              </div>
              <div>
                <label className="label">Quantity Change *</label>
                <p className="text-xs text-gray-400 mb-2">Use positive number to add stock, negative to reduce (e.g. +50 or -10)</p>
                <input className="input text-center text-xl font-bold" type="number"
                  placeholder="+50 or -10"
                  value={adjForm.change_qty}
                  onChange={e => setAdjForm({...adjForm, change_qty: e.target.value})}
                  required />
                {adjForm.change_qty && (
                  <div className="text-center text-sm mt-2 font-semibold text-green-700">
                    New total: {adjusting.stock_qty + parseInt(adjForm.change_qty || 0)} bags
                  </div>
                )}
              </div>
              <div>
                <label className="label">Reason</label>
                <select className="input" value={adjForm.reason} onChange={e => setAdjForm({...adjForm, reason: e.target.value})}>
                  {REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <input className="input" placeholder="Additional details..." value={adjForm.notes} onChange={e => setAdjForm({...adjForm, notes: e.target.value})} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-60">
                  {saving ? 'Saving...' : 'Confirm Adjustment'}
                </button>
                <button type="button" onClick={() => setAdjusting(null)} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
