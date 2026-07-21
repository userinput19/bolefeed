import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle, Phone, ChevronRight, QrCode } from 'lucide-react';
import { TelebirrPaymentQR, CBEPaymentQR } from '../../components/QRCodeGenerator';
import InvoiceModal from '../../components/InvoiceModal';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORIES = ['All', 'Layer Feed', 'Broiler Feed', 'Dairy Feed'];

export function ProductsPage() {
  const { t } = useLanguage();
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
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">{t('companyName')}</span>
        <h1 className="font-heading font-black text-5xl mb-4">{t('navProducts')}</h1>
        <p className="text-white/70 max-w-xl mx-auto">{t('heroSubtitle')}</p>
      </div>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  cat === c ? 'bg-green-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}>
                {c === 'All' ? t('categoryAll') : c === 'Layer Feed' ? t('categoryLayer') : c === 'Broiler Feed' ? t('categoryBroiler') : t('categoryDairy')}
              </button>
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
                    <span className="bg-gold-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">{p.weight_kg} KG</span>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">{p.description}</p>

                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Guaranteed Analysis</div>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {[[t('protein'),p.protein],[t('fiber'),p.fiber],[t('fat'),p.fat],[t('calcium'),p.calcium],[t('moisture'),p.moisture],[t('energy'),p.energy]].map(([k,v])=>(
                        <div key={k} className="flex justify-between text-sm border-b border-gray-100 py-1.5">
                          <span className="text-gray-500">{k}</span>
                          <span className="font-bold text-green-900">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-green-900">{p.price_etb?.toLocaleString()} <span className="text-sm font-medium text-gray-400">ETB / {t('bags')}</span></span>
                    </div>
                    <Link to={`/products/${p.id}`} className="w-full bg-green-900 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors block text-center shadow-md">
                      {t('navOrderNow')} →
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
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    customer_name:'', customer_phone:'', customer_email:'', quantity:1,
    delivery_method:'delivery', delivery_address:'', payment_method:'telebirr',
    payment_txn_ref:'', notes:''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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
      toast.success(t('orderSuccess'));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally { setSubmitting(false); }
  };

  if (loading) return <PublicLayout><div className="py-32 text-center text-gray-400">Loading...</div></PublicLayout>;
  if (!product) return null;

  const totalAmount = product.price_etb * Number(form.quantity || 1);
  const benefits = Array.isArray(product.benefits) ? product.benefits : (product.benefits||'').split(',').map(b=>b.trim());

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="bg-green-950 text-white/60 text-sm py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-white">{t('navHome')}</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-white">{t('navProducts')}</Link>
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
                <span className="bg-gold-600 text-white font-bold px-5 py-2 rounded-full">{product.weight_kg} KG</span>
              </div>
              <div className="p-8">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">{product.category}</span>
                <h1 className="font-heading font-black text-3xl text-green-900 mt-3 mb-2">{product.name}</h1>
                <p className="text-gray-500 text-sm mb-1 font-medium">{t('targetAnimal')}: {product.target_animal}</p>
                <div className="text-3xl font-black text-green-900 mt-4 mb-6">{product.price_etb?.toLocaleString()} <span className="text-base font-medium text-gray-400">ETB / {t('bags')}</span></div>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                {/* Analysis */}
                <div className="mb-6">
                  <div className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Guaranteed Analysis</div>
                  <div className="grid grid-cols-2 gap-y-0 border border-gray-200 rounded-xl overflow-hidden">
                    {[[t('protein'),product.protein],[t('fiber'),product.fiber],[t('fat'),product.fat],[t('calcium'),product.calcium],[t('moisture'),product.moisture],[t('energy'),product.energy]].map(([k,v],i)=>(
                      <div key={k} className={`flex justify-between px-4 py-3 text-sm ${i%2===0?'bg-white':'bg-gray-50'}`}>
                        <span className="text-gray-600">{k}</span>
                        <span className="font-black text-green-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <div className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">{t('benefits')}</div>
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
                    <div className="font-bold text-green-900 mb-1 text-sm">🌿 {t('feedingGuide')}</div>
                    <p className="text-sm text-green-800">{product.feeding_guide}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Form & Payment QR */}
          <div>
            {success ? (
              <div className="card p-8 text-center fade-in">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="font-heading font-black text-2xl text-green-900 mb-2">{t('orderSuccess')}</h2>
                <p className="text-gray-600 mb-4">{t('orderRefCode')}</p>
                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 mb-6 shadow-sm">
                  <div className="font-heading font-black text-3xl text-green-900 mb-2">{success.order_ref}</div>
                  <div className="text-gray-600 text-xs">{t('keepRefNotice')}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700">
                  <strong>Total Amount:</strong> {success.total_price?.toLocaleString()} ETB<br />
                  We will contact you within 2 hours to confirm your feed delivery.
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setShowInvoiceModal(true)} className="btn-primary py-3.5 text-center rounded-xl flex items-center justify-center gap-2 font-bold">
                    🖨️ {t('printInvoice')}
                  </button>
                  <Link to={`/track?ref=${success.order_ref}`} className="btn-secondary py-3 text-center rounded-xl font-bold">
                    {t('heroBtnTrack')} →
                  </Link>
                  <button onClick={() => setSuccess(null)} className="text-gray-500 hover:text-gray-700 text-sm mt-2">
                    Place Another Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-8 shadow-xl">
                <h2 className="font-heading font-black text-2xl text-green-900 mb-1">{t('orderModalTitle')}</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your details and select mobile payment or cash on delivery.</p>

                <form onSubmit={handleOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('customerName')} *</label>
                      <input className="input" placeholder="Name" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})} required />
                    </div>
                    <div>
                      <label className="label">{t('customerPhone')} *</label>
                      <input className="input" placeholder="+251 9..." value={form.customer_phone} onChange={e=>setForm({...form,customer_phone:e.target.value})} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('quantity')} *</label>
                      <input className="input" type="number" min="1" max={product.stock_qty} value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required />
                    </div>
                    <div>
                      <label className="label">{t('deliveryMethod')} *</label>
                      <select className="input" value={form.delivery_method} onChange={e=>setForm({...form,delivery_method:e.target.value})}>
                        <option value="delivery">{t('deliveryHome')}</option>
                        <option value="pickup">{t('deliveryPickup')}</option>
                      </select>
                    </div>
                  </div>

                  {form.delivery_method === 'delivery' && (
                    <div>
                      <label className="label">{t('deliveryAddress')} *</label>
                      <input className="input" placeholder="e.g. Bole Sub-City, Woreda 03, Addis Ababa" value={form.delivery_address} onChange={e=>setForm({...form,delivery_address:e.target.value})} required />
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div>
                    <label className="label">{t('paymentMethod')} *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'telebirr', name: 'Telebirr QR', icon: '📱' },
                        { id: 'cbe', name: 'CBE Birr', icon: '🏦' },
                        { id: 'cash', name: 'Cash / Delivery', icon: '💵' }
                      ].map(pm => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setForm({ ...form, payment_method: pm.id })}
                          className={`p-3 rounded-xl border text-center transition-all text-xs font-bold ${
                            form.payment_method === pm.id
                              ? 'border-green-800 bg-green-50 text-green-950 shadow-sm ring-2 ring-green-700/20'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-xl mb-1">{pm.icon}</div>
                          {pm.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Payment QR Code Display */}
                  {form.payment_method === 'telebirr' && (
                    <div className="mt-3">
                      <TelebirrPaymentQR amount={totalAmount} />
                    </div>
                  )}

                  {form.payment_method === 'cbe' && (
                    <div className="mt-3">
                      <CBEPaymentQR amount={totalAmount} />
                    </div>
                  )}

                  {/* Transaction Ref Code Entry */}
                  {(form.payment_method === 'telebirr' || form.payment_method === 'cbe') && (
                    <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200">
                      <label className="label text-amber-900">{t('txnRef')}</label>
                      <input
                        className="input bg-white border-amber-300 font-mono text-sm"
                        placeholder="e.g. TXN98273610 or FT240981"
                        value={form.payment_txn_ref}
                        onChange={e => setForm({ ...form, payment_txn_ref: e.target.value })}
                      />
                      <p className="text-[11px] text-amber-700 mt-1">{t('txnRefHelp')}</p>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-green-900 text-white rounded-2xl p-5 shadow-inner">
                    <div className="flex justify-between text-xs text-white/80 mb-1">
                      <span>{product.name} ({form.quantity} × {product.price_etb?.toLocaleString()} ETB)</span>
                    </div>
                    <div className="flex justify-between items-center font-black text-xl border-t border-white/20 pt-3 mt-2">
                      <span>{t('grandTotal')}:</span>
                      <span className="text-gold-300 font-mono text-2xl">{totalAmount?.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full btn-primary py-4 text-base rounded-xl font-bold shadow-lg disabled:opacity-60">
                    {submitting ? 'Submitting Order...' : '🛒 Confirm & Submit Feed Order'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Invoice Printable Modal */}
      {showInvoiceModal && success && (
        <InvoiceModal order={success} onClose={() => setShowInvoiceModal(false)} />
      )}
    </PublicLayout>
  );
}
