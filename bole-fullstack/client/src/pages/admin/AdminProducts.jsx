import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const EMPTY = {
  name:'', category:'Layer Feed', description:'', weight_kg:50, price_etb:'',
  protein:'', fat:'', fiber:'', calcium:'', moisture:'', energy:'',
  target_animal:'', benefits:'', feeding_guide:'', emoji:'🌾',
  stock_qty:0, min_stock_alert:100, featured:false
};

const CATEGORIES = ['Layer Feed','Broiler Feed','Dairy Feed','Starter Feed'];
const EMOJIS = ['🐔','🥚','🐣','🍗','🐄','🌾','🐓','🐑','🐖'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin/all');
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...p,
      benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits || ''
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price_etb) return toast.error('Name and price are required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price_etb: parseFloat(form.price_etb),
        weight_kg: parseFloat(form.weight_kg) || 50,
        stock_qty: parseInt(form.stock_qty) || 0,
        min_stock_alert: parseInt(form.min_stock_alert) || 100,
        benefits: form.benefits,
      };
      if (editing) {
        await api.put(`/products/${editing.id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      closeForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Archive product "${p.name}"? It will no longer appear on the website.`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      toast.success('Product archived');
      fetchProducts();
    } catch { toast.error('Failed to archive product'); }
  };

  const toggleActive = async (p) => {
    try {
      await api.put(`/products/${p.id}`, { active: !p.active });
      toast.success(p.active ? 'Product hidden from website' : 'Product now visible');
      fetchProducts();
    } catch { toast.error('Update failed'); }
  };

  return (
    <AdminLayout stats={{}}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-800">Products</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your product catalog, prices and nutritional specs.</p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 py-2.5">
            <Plus size={17} /> Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Product</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Price (ETB)</th>
                  <th className="table-th">Protein</th>
                  <th className="table-th">Stock</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Featured</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">Loading products...</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!p.active ? 'opacity-50' : ''}`}>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji}</span>
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.target_animal}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td text-sm text-gray-600">{p.category}</td>
                    <td className="table-td font-bold text-green-900">{p.price_etb?.toLocaleString()}</td>
                    <td className="table-td text-sm">{p.protein}</td>
                    <td className="table-td">
                      <span className={`font-bold text-sm ${p.stock_qty <= p.min_stock_alert ? 'text-red-600' : 'text-green-700'}`}>
                        {p.stock_qty} bags
                      </span>
                      {p.stock_qty <= p.min_stock_alert && <div className="text-xs text-red-400">⚠ Low stock</div>}
                    </td>
                    <td className="table-td">
                      <button onClick={() => toggleActive(p)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.active ? 'bg-green-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="table-td">
                      <button onClick={() => api.put(`/products/${p.id}`, { featured: !p.featured }).then(fetchProducts)}
                        className={`text-lg ${p.featured ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>⭐</button>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => handleDelete(p)} className="btn-sm bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1">
                          <Trash2 size={13} /> Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading font-black text-xl text-gray-800">
                {editing ? `Edit: ${editing.name}` : 'Add New Product'}
              </h2>
              <button onClick={closeForm} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Emoji picker */}
              <div>
                <label className="label">Product Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map(e => (
                    <button key={e} type="button" onClick={() => setForm({...form, emoji:e})}
                      className={`w-10 h-10 text-xl rounded-xl border-2 transition-all ${form.emoji===e ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Product Name *</label>
                  <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Layer Super Phase 1 Feed" required />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Target Animal</label>
                  <input className="input" value={form.target_animal} onChange={e=>setForm({...form,target_animal:e.target.value})} placeholder="e.g. Laying hens 18–45 weeks" />
                </div>
                <div>
                  <label className="label">Price (ETB) *</label>
                  <input className="input" type="number" value={form.price_etb} onChange={e=>setForm({...form,price_etb:e.target.value})} placeholder="2800" required />
                </div>
                <div>
                  <label className="label">Weight (kg)</label>
                  <input className="input" type="number" value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})} />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea className="input h-24 resize-none" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Full product description..." />
              </div>

              {/* Nutritional Analysis */}
              <div>
                <div className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide">Guaranteed Analysis</div>
                <div className="grid grid-cols-2 gap-3">
                  {[['protein','Crude Protein','Min 16.5%'],['fat','Crude Fat','Min 5.0%'],['fiber','Crude Fiber','Max 7.0%'],['calcium','Calcium','Min 3.75%'],['moisture','Moisture','Max 10.0%'],['energy','Energy (Kcal/kg)','Min 2500 Kcal/Kg']].map(([k,l,ph])=>(
                    <div key={k}>
                      <label className="label">{l}</label>
                      <input className="input" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Key Benefits (comma-separated)</label>
                <input className="input" value={form.benefits} onChange={e=>setForm({...form,benefits:e.target.value})} placeholder="High Egg Production, Strong Eggshell, Balanced Nutrition" />
              </div>

              <div>
                <label className="label">Feeding Guide / Recommendation</label>
                <textarea className="input h-20 resize-none" value={form.feeding_guide} onChange={e=>setForm({...form,feeding_guide:e.target.value})} placeholder="e.g. Provide 110–120g per bird per day..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Initial Stock (bags)</label>
                  <input className="input" type="number" value={form.stock_qty} onChange={e=>setForm({...form,stock_qty:e.target.value})} />
                </div>
                <div>
                  <label className="label">Low Stock Alert (bags)</label>
                  <input className="input" type="number" value={form.min_stock_alert} onChange={e=>setForm({...form,min_stock_alert:e.target.value})} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={!!form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-green-700" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Show as featured product on homepage</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                  <Save size={16} /> {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Product'}
                </button>
                <button type="button" onClick={closeForm} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
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
