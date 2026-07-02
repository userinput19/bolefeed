import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle, ShoppingCart, Phone, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Layer Feed', 'Broiler Feed', 'Dairy Feed'];

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(r => { setProducts(r.data); setLoading(false); });
  }, []);

  const filtered = cat === 'All' ? products : products.filter(p => p.category === cat);

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-green-950 to-green-900 py-16 text-center text-white">
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">Our Range</span>
        <h1 className="font-heading font-black text-5xl mb-4">Feed Products</h1>
        <p className="text-white/70 max-w-xl mx-auto">Complete, balanced nutrition for every stage of your animals' lives — formulated for maximum productivity.</p>
      </div>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  cat === c ? 'bg-green-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading products...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(p => (
                <div key={p.id} className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-gradient-to-br from-green-900 to-green-700 p-8 text-center">
                    <div className="text-6xl mb-3">{p.emoji}</div>
                    <h3 className="font-heading font-black text-white text-lg mb-1">{p.name}</h3>
                    <div className="text-white/70 text-sm mb-3">{p.target_animal}</div>
                    <span className="bg-gold-700 text-white text-sm font-bold px-4 py-1.5 rounded-full">{p.weight_kg} KG</span>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">{p.description}</p>

                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Guaranteed Analysis</div>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {[['Crude Protein',p.protein],['Crude Fiber',p.fiber],['Crude Fat',p.fat],['Calcium',p.calcium],['Moisture',p.moisture],['Energy',p.energy]].map(([k,v])=>(
                        <div key={k} className="flex justify-between text-sm border-b border-gray-100 py-1.5">
                          <span className="text-gray-500">{k}</span>
                          <span className="font-bold text-green-900">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(Array.isArray(p.benefits) ? p.benefits : (p.benefits||'').split(',')).map(b=>(
                        <span key={b} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{b.trim()}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-green-900">{p.price_etb?.toLocaleString()} <span className="text-sm font-medium text-gray-400">ETB / bag</span></span>
                    </div>
                    <Link to={`/products/${p.id}`} className="w-full bg-green-900 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors block text-center">
                      View Details & Order →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ customer_name:'', customer_phone:'', customer_email:'', quantity:1, delivery_method:'delivery', delivery_address:'', notes:'' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => { setProduct(r.data); setLoading(false); }).catch(() => navigate('/products'));
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone) return toast.error('Name and phone are required');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', { ...form, product_id: id });
      setSuccess(data);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally { setSubmitting(false); }
  };

  if (loading) return <PublicLayout><div className="py-32 text-center text-gray-400">Loading...</div></PublicLayout>;
  if (!product) return null;

  const benefits = Array.isArray(product.benefits) ? product.benefits : (product.benefits||'').split(',').map(b=>b.trim());

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="bg-green-950 text-white/60 text-sm py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-white">Products</Link>
          <ChevronRight size={14} />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
          {/* Product Info */}
          <div>
            <div className="card overflow-visible mb-6">
              <div className="bg-gradient-to-br from-green-900 to-green-700 p-12 text-center rounded-t-2xl">
                <div className="text-8xl mb-4">{product.emoji}</div>
                <span className="bg-gold-700 text-white font-bold px-5 py-2 rounded-full">{product.weight_kg} KG</span>
              </div>
              <div className="p-8">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">{product.category}</span>
                <h1 className="font-heading font-black text-3xl text-green-900 mt-3 mb-2">{product.name}</h1>
                <p className="text-gray-500 text-sm mb-1 font-medium">For: {product.target_animal}</p>
                <div className="text-3xl font-black text-green-900 mt-4 mb-6">{product.price_etb?.toLocaleString()} <span className="text-base font-medium text-gray-400">ETB / bag</span></div>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                {/* Analysis */}
                <div className="mb-6">
                  <div className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Guaranteed Analysis</div>
                  <div className="grid grid-cols-2 gap-y-0 border border-gray-200 rounded-xl overflow-hidden">
                    {[['Crude Protein',product.protein],['Crude Fiber',product.fiber],['Crude Fat',product.fat],['Calcium',product.calcium],['Moisture',product.moisture],['Energy',product.energy]].map(([k,v],i)=>(
                      <div key={k} className={`flex justify-between px-4 py-3 text-sm ${i%2===0?'bg-white':'bg-gray-50'}`}>
                        <span className="text-gray-600">{k}</span>
                        <span className="font-black text-green-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <div className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Key Benefits</div>
                  <div className="grid grid-cols-1 gap-2">
                    {benefits.filter(Boolean).map(b => (
                      <div key={b} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feeding guide */}
                {product.feeding_guide && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="font-bold text-green-900 mb-1 text-sm">🌿 Feeding Recommendation</div>
                    <p className="text-sm text-green-800">{product.feeding_guide}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div>
            {success ? (
              <div className="card p-8 text-center fade-in">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="font-heading font-black text-2xl text-green-900 mb-2">Order Placed!</h2>
                <p className="text-gray-600 mb-4">Your order reference number is:</p>
                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 mb-6">
                  <div className="font-heading font-black text-3xl text-green-900 mb-2">{success.order_ref}</div>
                  <div className="text-gray-600 text-sm">Save this reference to track your order</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700">
                  <strong>Total:</strong> {success.total_price?.toLocaleString()} ETB<br />
                  We will contact you within 2 hours to confirm your order.
                </div>
                <div className="flex flex-col gap-3">
                  <Link to="/track" className="btn-secondary py-3 text-center rounded-xl">Track This Order →</Link>
                  <button onClick={() => setSuccess(null)} className="text-gray-500 hover:text-gray-700 text-sm">Place Another Order</button>
                </div>
              </div>
            ) : (
              <div className="card p-8">
                <h2 className="font-heading font-black text-2xl text-green-900 mb-1">Place Your Order</h2>
                <p className="text-gray-500 text-sm mb-6">Fill in your details and we'll confirm within 2 hours.</p>

                <form onSubmit={handleOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input className="input" placeholder="Your name" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})} required />
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input className="input" placeholder="+251 9..." value={form.customer_phone} onChange={e=>setForm({...form,customer_phone:e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input className="input" type="email" placeholder="Optional" value={form.customer_email} onChange={e=>setForm({...form,customer_email:e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Quantity (Bags) *</label>
                      <input className="input" type="number" min="1" max={product.stock_qty} value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required />
                    </div>
                    <div>
                      <label className="label">Payment Method</label>
                      <select className="input" value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})}>
                        <option value="cash">Cash on Delivery</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Delivery Method *</label>
                    <select className="input" value={form.delivery_method} onChange={e=>setForm({...form,delivery_method:e.target.value})}>
                      <option value="delivery">Delivery to my location</option>
                      <option value="pickup">Pickup from Bole Michael</option>
                    </select>
                  </div>
                  {form.delivery_method === 'delivery' && (
                    <div>
                      <label className="label">Delivery Address *</label>
                      <input className="input" placeholder="Your full address" value={form.delivery_address} onChange={e=>setForm({...form,delivery_address:e.target.value})} />
                    </div>
                  )}
                  <div>
                    <label className="label">Notes</label>
                    <textarea className="input h-20 resize-none" placeholder="Any special requests or instructions..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
                  </div>

                  {/* Order summary */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">{product.name}</span>
                      <span className="font-semibold">{product.price_etb?.toLocaleString()} ETB × {form.quantity}</span>
                    </div>
                    <div className="flex justify-between font-black text-green-900 text-lg border-t border-green-200 mt-2 pt-2">
                      <span>Total</span>
                      <span>{(product.price_etb * form.quantity)?.toLocaleString()} ETB</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{product.stock_qty} bags currently in stock</div>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full btn-primary py-4 text-base rounded-xl disabled:opacity-60">
                    {submitting ? 'Placing Order...' : '🛒 Place Order Now'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">By ordering you agree to be contacted by our team for confirmation.</p>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500 mb-2">Prefer to order by phone?</p>
                  <a href="tel:+251939277772" className="font-bold text-green-900 hover:text-green-700 transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} /> +251 939 277 772
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
