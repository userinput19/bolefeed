// ─── BATCHES PAGE ───
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, X, FlaskConical, Calendar, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const EMPTY_BATCH = { product_id:'', batch_no:'', mfg_date:'', exp_date:'', qty_produced:'', notes:'' };

export function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_BATCH);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, p] = await Promise.all([api.get('/batches'), api.get('/products/admin/all')]);
      setBatches(b.data);
      setProducts(p.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleMfgChange = (date) => {
    const mfg = new Date(date);
    mfg.setMonth(mfg.getMonth() + 6);
    const exp = mfg.toISOString().split('T')[0];
    setForm(f => ({ ...f, mfg_date: date, exp_date: exp }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id || !form.batch_no || !form.mfg_date || !form.qty_produced) return toast.error('All fields required');
    setSaving(true);
    try {
      await api.post('/batches', { ...form, qty_produced: parseInt(form.qty_produced) });
      toast.success('Batch recorded & stock updated');
      setShowForm(false);
      setForm(EMPTY_BATCH);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save batch'); }
    finally { setSaving(false); }
  };

  const today = new Date();
  const soonExpiring = batches.filter(b => {
    const exp = new Date(b.exp_date);
    const daysLeft = Math.ceil((exp - today) / (1000*60*60*24));
    return daysLeft <= 60 && daysLeft > 0;
  });
  const expired = batches.filter(b => new Date(b.exp_date) < today);

  return (
    <AdminLayout stats={{}}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-800">Batch Records</h1>
            <p className="text-gray-500 text-sm mt-1">Track production batches, manufacturing & expiry dates.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 py-2.5">
            <Plus size={17} /> Record New Batch
          </button>
        </div>

        {/* Alerts */}
        {(soonExpiring.length > 0 || expired.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {expired.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-800 text-sm">{expired.length} Expired Batch(es)</div>
                  {expired.map(b => <div key={b.id} className="text-xs text-red-600">{b.batch_no} — {b.product_name}</div>)}
                </div>
              </div>
            )}
            {soonExpiring.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Calendar size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-800 text-sm">{soonExpiring.length} Batch(es) Expiring Soon (&lt;60 days)</div>
                  {soonExpiring.map(b => <div key={b.id} className="text-xs text-amber-700">{b.batch_no} — expires {new Date(b.exp_date).toLocaleDateString()}</div>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Batches Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Batch No.</th>
                  <th className="table-th">Product</th>
                  <th className="table-th">Mfg Date</th>
                  <th className="table-th">Exp Date</th>
                  <th className="table-th">Produced</th>
                  <th className="table-th">Remaining</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
                ) : batches.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No batches recorded yet</td></tr>
                ) : batches.map(b => {
                  const exp = new Date(b.exp_date);
                  const daysLeft = Math.ceil((exp - today) / (1000*60*60*24));
                  const isExpired = daysLeft <= 0;
                  const isSoon = daysLeft > 0 && daysLeft <= 60;
                  return (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="table-td font-mono text-sm font-bold text-green-900">{b.batch_no}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <span>{b.emoji}</span>
                          <span className="text-sm font-semibold">{b.product_name}</span>
                        </div>
                      </td>
                      <td className="table-td text-sm">{new Date(b.mfg_date).toLocaleDateString()}</td>
                      <td className="table-td text-sm">{new Date(b.exp_date).toLocaleDateString()}</td>
                      <td className="table-td font-semibold">{b.qty_produced} bags</td>
                      <td className="table-td font-semibold">{b.qty_remaining} bags</td>
                      <td className="table-td">
                        {isExpired ? (
                          <span className="badge badge-cancelled">Expired</span>
                        ) : isSoon ? (
                          <span className="badge badge-pending">{daysLeft}d left</span>
                        ) : (
                          <span className="badge badge-delivered">{daysLeft}d left</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Batch Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading font-black text-xl text-gray-800">Record New Batch</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Product *</label>
                <select className="input" value={form.product_id} onChange={e=>setForm({...form,product_id:e.target.value})} required>
                  <option value="">Select product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Batch Number *</label>
                  <input className="input" placeholder="e.g. BOLE-L1-2024-002" value={form.batch_no} onChange={e=>setForm({...form,batch_no:e.target.value})} required />
                </div>
                <div>
                  <label className="label">Quantity Produced *</label>
                  <input className="input" type="number" placeholder="500" value={form.qty_produced} onChange={e=>setForm({...form,qty_produced:e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Manufacturing Date *</label>
                  <input className="input" type="date" value={form.mfg_date} onChange={e=>handleMfgChange(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Expiry Date (auto +6mo)</label>
                  <input className="input" type="date" value={form.exp_date} onChange={e=>setForm({...form,exp_date:e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea className="input h-20 resize-none" placeholder="Optional batch notes..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-60">
                  {saving ? 'Saving...' : 'Record Batch & Update Stock'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── REPORTS PAGE ───
export function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(r => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <AdminLayout stats={{}}><div className="flex items-center justify-center h-96 text-gray-400">Loading reports...</div></AdminLayout>;

  const COLORS = ['#1B4D2E','#2D7A47','#C8920A','#F0B429','#6ec96f'];
  const monthNames = { '2024-08':'Aug','2024-09':'Sep','2024-10':'Oct','2024-11':'Nov','2024-12':'Dec','2025-01':'Jan','2025-02':'Feb' };

  return (
    <AdminLayout stats={data}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-heading font-black text-2xl text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Sales performance, revenue and business insights.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label:'Total Revenue (Paid)', value:`${(data.total_revenue||0).toLocaleString()} ETB`, sub:'Cash received' },
            { label:'Pending Revenue',      value:`${(data.pending_revenue||0).toLocaleString()} ETB`, sub:'Awaiting payment' },
            { label:'Total Bags Sold',      value:`${data.total_bags_sold||0}`, sub:'All-time orders' },
            { label:'Total Orders',         value:data.total_orders, sub:`${data.delivered_orders} delivered` },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="font-heading font-black text-2xl text-gray-800">{s.value}</div>
              <div className="text-gray-600 text-sm mt-1 font-medium">{s.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-heading font-bold text-gray-800 mb-1">Monthly Bags Sold</h2>
            <p className="text-gray-400 text-xs mb-4">Last 6 months</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.monthly_sales.map(m=>({...m, name: monthNames[m.month]||m.month}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:12}} />
                <Tooltip formatter={(v,n)=>[v, n==='bags'?'Bags Sold':'Revenue']} />
                <Bar dataKey="bags" fill="#1B4D2E" radius={[6,6,0,0]} name="bags" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-heading font-bold text-gray-800 mb-1">Monthly Revenue (ETB)</h2>
            <p className="text-gray-400 text-xs mb-4">Last 6 months</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.monthly_sales.map(m=>({...m, name: monthNames[m.month]||m.month}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:12}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v)=>[`${v?.toLocaleString()} ETB`,'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#C8920A" strokeWidth={3} dot={{fill:'#C8920A', r:5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product breakdown table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-heading font-bold text-gray-800">Sales by Product</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Product</th>
                  <th className="table-th">Orders</th>
                  <th className="table-th">Bags Sold</th>
                  <th className="table-th">Revenue (ETB)</th>
                  <th className="table-th">Share</th>
                </tr>
              </thead>
              <tbody>
                {data.sales_by_product.map((p,i) => {
                  const totalBags = data.sales_by_product.reduce((s,x)=>s+x.total_qty,0);
                  const share = totalBags > 0 ? ((p.total_qty/totalBags)*100).toFixed(1) : 0;
                  return (
                    <tr key={p.product_name} className="hover:bg-gray-50">
                      <td className="table-td font-semibold">{p.product_name}</td>
                      <td className="table-td">{p.order_count}</td>
                      <td className="table-td font-bold text-green-900">{p.total_qty}</td>
                      <td className="table-td font-bold">{p.total_revenue?.toLocaleString()}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{width:`${share}%`, background: COLORS[i%COLORS.length]}} />
                          </div>
                          <span className="text-xs text-gray-500">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── USERS PAGE ───
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', username:'', password:'', role:'staff', phone:'', email:'' });
  const [saving, setSaving] = useState(false);
  const { user: me } = useAuth();

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => {
    setLoading(true);
    try { const { data } = await api.get('/users'); setUsers(data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) return toast.error('Name, username and password required');
    setSaving(true);
    try {
      await api.post('/users', form);
      toast.success('User created successfully');
      setShowForm(false);
      setForm({ name:'', username:'', password:'', role:'staff', phone:'', email:'' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to create user'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (u) => {
    if (u.id === me?.id) return toast.error('Cannot delete your own account');
    if (!confirm(`Delete user "${u.name}"?`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout stats={{}}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-800">Staff Users</h1>
            <p className="text-gray-500 text-sm mt-1">Manage admin and staff access to this dashboard.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 py-2.5">
            <Plus size={17} /> Add User
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-th">Name</th>
                <th className="table-th">Username</th>
                <th className="table-th">Role</th>
                <th className="table-th">Email</th>
                <th className="table-th">Created</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center text-white font-bold text-sm">{u.name[0]}</div>
                      <span className="font-semibold text-sm">{u.name}</span>
                      {u.id === me?.id && <span className="badge bg-green-100 text-green-700">You</span>}
                    </div>
                  </td>
                  <td className="table-td font-mono text-sm text-gray-600">{u.username}</td>
                  <td className="table-td">
                    <span className={`badge ${u.role==='admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="table-td text-sm text-gray-500">{u.email || '—'}</td>
                  <td className="table-td text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="table-td">
                    {u.id !== me?.id && (
                      <button onClick={() => handleDelete(u)} className="btn-sm bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading font-black text-xl text-gray-800">Add Staff User</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Username *</label><input className="input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="johndoe" required /></div>
                <div><label className="label">Password *</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 chars" required /></div>
              </div>
              <div><label className="label">Role</label>
                <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="staff">Staff (limited access)</option>
                  <option value="admin">Admin (full access)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+251..." /></div>
                <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Optional" /></div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-60">{saving ? 'Creating...' : 'Create User'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── SETTINGS PAGE ───
export function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [pwSaving, setPwSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/settings').then(r => { setSettings(r.data); setLoading(false); });
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings saved successfully');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setPwSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to change password'); }
    finally { setPwSaving(false); }
  };

  if (loading) return <AdminLayout stats={{}}><div className="flex items-center justify-center h-96 text-gray-400">Loading settings...</div></AdminLayout>;

  const FIELDS = [
    { key:'company_name',    label:'Company Name' },
    { key:'company_tagline', label:'Tagline / Slogan' },
    { key:'company_phone1',  label:'Phone Number 1' },
    { key:'company_phone2',  label:'Phone Number 2' },
    { key:'company_phone3',  label:'Phone Number 3' },
    { key:'company_email',   label:'Email Address' },
    { key:'company_address', label:'Physical Address' },
    { key:'working_hours',   label:'Working Hours' },
  ];

  return (
    <AdminLayout stats={{}}>
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="font-heading font-black text-2xl text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage company information and account settings.</p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-gray-800 mb-5">Company Information</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input className="input" value={settings[f.key]||''} onChange={e=>setSettings({...settings,[f.key]:e.target.value})} />
              </div>
            ))}
            <div>
              <label className="label">About Us Text</label>
              <textarea className="input h-28 resize-none" value={settings.about_text||''} onChange={e=>setSettings({...settings,about_text:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Shelf Life (months)</label>
                <input className="input" type="number" value={settings.shelf_life_months||6} onChange={e=>setSettings({...settings,shelf_life_months:e.target.value})} />
              </div>
              <div>
                <label className="label">Currency</label>
                <input className="input" value={settings.currency||'ETB'} onChange={e=>setSettings({...settings,currency:e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 rounded-xl disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Company Settings'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-gray-800 mb-1">Change Your Password</h2>
          <p className="text-gray-400 text-sm mb-5">Logged in as <strong>{user?.username}</strong> ({user?.role})</p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input className="input" type="password" value={pwForm.currentPassword} onChange={e=>setPwForm({...pwForm,currentPassword:e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">New Password</label>
                <input className="input" type="password" value={pwForm.newPassword} onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} required />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input className="input" type="password" value={pwForm.confirmPassword} onChange={e=>setPwForm({...pwForm,confirmPassword:e.target.value})} required />
              </div>
            </div>
            <button type="submit" disabled={pwSaving} className="btn-secondary py-3 px-8 rounded-xl disabled:opacity-60">
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
