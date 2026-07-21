import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Search, RefreshCw, X, Phone, MapPin, Package, Printer } from 'lucide-react';
import InvoiceModal from '../../components/InvoiceModal';

const STATUSES = ['','pending','confirmed','processing','delivered','cancelled'];
const STATUS_BADGE = { pending:'badge-pending', confirmed:'badge-confirmed', processing:'badge-processing', delivered:'badge-delivered', cancelled:'badge-cancelled' };
const PAY_BADGE = { paid:'badge-paid', unpaid:'badge-unpaid', partial:'badge-partial' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [dashStats, setDashStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders);
      setStats(data.stats);
      setDashStats({ pending_orders: data.stats?.pending, unread_messages: 0 });
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrder = async (id, updates) => {
    setUpdating(true);
    try {
      const updated = await api.put(`/orders/${id}`, updates);
      setOrders(prev => prev.map(o => o.id === id ? updated.data : o));
      if (selected?.id === id) setSelected(updated.data);
      toast.success('Order updated');
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  return (
    <AdminLayout stats={dashStats}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-800">Orders Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage, fulfill, and print invoices for customer feed orders.</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {[['All',stats.total||0,''],['Pending',stats.pending||0,'text-amber-600'],['Confirmed',stats.confirmed||0,'text-blue-600'],['Processing',stats.processing||0,'text-purple-600'],['Delivered',stats.delivered||0,'text-green-700'],['Cancelled',stats.cancelled||0,'text-red-600']].map(([l,v,c])=>(
            <button key={l} onClick={() => setStatusFilter(l==='All'?'':l.toLowerCase())}
              className={`bg-white rounded-xl p-3 text-center border-2 transition-all ${statusFilter===(l==='All'?'':l.toLowerCase()) ? 'border-green-700' : 'border-gray-100'}`}>
              <div className={`font-heading font-black text-xl ${c||'text-gray-800'}`}>{v}</div>
              <div className="text-gray-400 text-xs">{l}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="flex gap-3 p-4 border-b border-gray-100">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="admin-input w-full pl-9" placeholder="Search by name, phone, ref, product..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="admin-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s||'All Status'}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Order Ref</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Product</th>
                  <th className="table-th">Qty</th>
                  <th className="table-th">Total</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Payment</th>
                  <th className="table-th text-right">Invoice & Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">No orders found</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(o)}>
                    <td className="table-td font-mono text-xs font-bold text-green-900">{o.order_ref}</td>
                    <td className="table-td">
                      <div className="font-semibold text-sm">{o.customer_name}</div>
                      <div className="text-xs text-gray-400">{o.customer_phone}</div>
                    </td>
                    <td className="table-td text-sm max-w-[140px] truncate">{o.product_name}</td>
                    <td className="table-td text-sm font-semibold">{o.quantity}</td>
                    <td className="table-td text-sm font-bold text-green-900">{o.total_price?.toLocaleString()} ETB</td>
                    <td className="table-td text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="table-td"><span className={`badge ${STATUS_BADGE[o.status]||''}`}>{o.status}</span></td>
                    <td className="table-td"><span className={`badge ${PAY_BADGE[o.payment_status]||''}`}>{o.payment_status}</span></td>
                    <td className="table-td text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPrintOrder(o)}
                          className="bg-green-100 hover:bg-green-200 text-green-900 p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Print Sales Invoice"
                        >
                          <Printer size={14} /> Print
                        </button>
                        <select className="admin-input text-xs py-1"
                          value={o.status}
                          onChange={e => updateOrder(o.id, { status: e.target.value })}>
                          {['pending','confirmed','processing','delivered','cancelled'].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-heading font-black text-xl text-gray-800">{selected.order_ref}</h2>
                <p className="text-gray-500 text-sm">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrintOrder(selected)}
                  className="btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer size={15} /> Print Invoice
                </button>
                <button onClick={() => setSelected(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Customer */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="font-bold text-sm text-gray-700 mb-3">Customer Details</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><span className="text-gray-400 w-20">Name</span><span className="font-semibold">{selected.customer_name}</span></div>
                  <div className="flex items-center gap-2"><Phone size={13} className="text-gray-400" /><a href={`tel:${selected.customer_phone}`} className="text-green-700 font-semibold hover:underline">{selected.customer_phone}</a></div>
                  {selected.customer_email && <div className="flex items-center gap-2"><span className="text-gray-400 w-20">Email</span><span>{selected.customer_email}</span></div>}
                </div>
              </div>

              {/* Order details */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="font-bold text-sm text-gray-700 mb-3">Order & Payment Info</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2"><Package size={13} className="text-gray-400 mt-0.5" /><span className="font-semibold">{selected.product_name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-bold">{selected.quantity} bag(s)</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Unit Price</span><span>{selected.unit_price?.toLocaleString()} ETB</span></div>
                  <div className="flex justify-between font-black text-green-900 text-base pt-1 border-t border-gray-200"><span>Total</span><span>{selected.total_price?.toLocaleString()} ETB</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="font-semibold uppercase">{selected.payment_method || 'Cash'}</span></div>
                  {selected.payment_txn_ref && (
                    <div className="flex justify-between bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <span className="text-amber-900 font-semibold">Txn Ref Code</span>
                      <span className="font-mono font-bold text-amber-900">{selected.payment_txn_ref}</span>
                    </div>
                  )}
                  {selected.delivery_address && <div className="flex items-start gap-2"><MapPin size={13} className="text-gray-400 mt-0.5" /><span>{selected.delivery_method === 'pickup' ? 'Pickup from Bole Michael' : selected.delivery_address}</span></div>}
                  {selected.notes && <div className="text-gray-500 italic">Note: {selected.notes}</div>}
                </div>
              </div>

              {/* Update status */}
              <div className="space-y-3">
                <div>
                  <label className="label">Order Status</label>
                  <select className="admin-input w-full" value={selected.status}
                    onChange={e => { setSelected({...selected, status:e.target.value}); updateOrder(selected.id, { status: e.target.value }); }}>
                    {['pending','confirmed','processing','delivered','cancelled'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Payment Status</label>
                    <select className="admin-input w-full" value={selected.payment_status}
                      onChange={e => { setSelected({...selected,payment_status:e.target.value}); updateOrder(selected.id,{payment_status:e.target.value}); }}>
                      {['unpaid','partial','paid'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Payment Method</label>
                    <select className="admin-input w-full" value={selected.payment_method}
                      onChange={e => { setSelected({...selected,payment_method:e.target.value}); updateOrder(selected.id,{payment_method:e.target.value}); }}>
                      {['telebirr','cbe','cash','bank_transfer'].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Admin Notes</label>
                  <textarea className="admin-input w-full h-20 resize-none" placeholder="Internal notes..."
                    defaultValue={selected.admin_notes}
                    onBlur={e => updateOrder(selected.id, { admin_notes: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Printable Modal */}
      {printOrder && (
        <InvoiceModal order={printOrder} onClose={() => setPrintOrder(null)} />
      )}
    </AdminLayout>
  );
}
