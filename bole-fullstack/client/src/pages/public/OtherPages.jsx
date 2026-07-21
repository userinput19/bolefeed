import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Phone, MapPin, Clock, Mail, Search, MessageSquare } from 'lucide-react';
import { QRCodeDisplay } from '../../components/QRCodeGenerator';
import InvoiceModal from '../../components/InvoiceModal';
import { useLanguage } from '../../context/LanguageContext';

// ─── ABOUT PAGE ───
export function AboutPage() {
  const { t } = useLanguage();

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-green-950 to-green-900 py-16 text-center text-white">
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">{t('companyName')}</span>
        <h1 className="font-heading font-black text-5xl mb-4">{t('navAbout')}</h1>
        <p className="text-white/70 max-w-xl mx-auto">Ethiopia's trusted manufacturer of scientifically balanced animal nutrition products.</p>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="section-label">Who We Are</span>
              <h2 className="section-title text-4xl mb-6">Committed to Animal Nutrition Excellence</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bole Animal Feed Processing is a leading animal nutrition company based in Bole Michael, Addis Ababa, Ethiopia. We specialize in manufacturing scientifically balanced feed products for poultry, dairy and livestock farmers across the country.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our commitment to quality ingredients, rigorous testing, and expert nutritional formulation ensures every bag delivers consistent, measurable results for your farm. We believe that better feed means better animal health, better productivity, and better livelihoods for Ethiopian farmers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[['500+','Farmers Served'],['5','Product Varieties'],['50kg','Standard Pack'],['6 Mo','Shelf Life Guarantee']].map(([n,l])=>(
                  <div key={l} className="bg-green-50 rounded-2xl p-5 border border-green-100">
                    <div className="font-heading font-black text-3xl text-green-900 mb-1">{n}</div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-3xl p-10 text-white text-center shadow-xl">
              <div className="text-7xl mb-6">🏭</div>
              <h3 className="font-heading font-black text-2xl mb-3">Our Facility</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-5">Located at Bole Michael, Addis Ababa — our modern production facility uses quality-controlled processes to ensure every batch meets our strict nutritional standards.</p>
              <div className="bg-white/10 rounded-2xl p-5 text-left border border-white/15">
                <div className="font-bold text-gold-300 mb-3 text-center">Quality Promise</div>
                {['Lab-tested every batch','Guaranteed analysis on all bags','Clear batch & expiry dates','6-month shelf life standard'].map(i=>(
                  <div key={i} className="flex items-center gap-2 text-xs text-white/90 mb-2 font-medium">✅ {i}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

// ─── CONTACT PAGE ───
export function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name:'', phone:'', email:'', subject:'Product Inquiry', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return toast.error('Name, phone and message are required');
    setSending(true);
    try {
      await api.post('/messages', form);
      setSent(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally { setSending(false); }
  };

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-green-950 to-green-900 py-16 text-center text-white">
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">{t('companyName')}</span>
        <h1 className="font-heading font-black text-5xl mb-4">{t('navContact')}</h1>
        <p className="text-white/70 max-w-xl mx-auto">{t('contactSubtitle')}</p>
      </div>

      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-heading font-black text-2xl text-green-900 mb-8">{t('contactTitle')}</h2>
            <div className="space-y-5 mb-10">
              {[
                { icon: Phone, label:t('customerPhone'), value:'+251 939 277 772\n+251 939 377 773', href:'tel:+251939277772' },
                { icon: MapPin, label:'Address', value:'Bole Michael, Addis Ababa, Ethiopia' },
                { icon: Mail,  label:'Email',   value:'info@boleanimalfeed.com', href:'mailto:info@boleanimalfeed.com' },
                { icon: Clock, label:'Hours',   value:'Mon–Sat: 8:00 AM – 6:00 PM\nSun: 9:00 AM – 1:00 PM' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-green-900" />
                  </div>
                  <div>
                    <div className="font-bold text-green-900 text-xs uppercase tracking-wider mb-1">{label}</div>
                    {href
                      ? <a href={href} className="text-gray-700 font-semibold text-sm hover:text-green-700 whitespace-pre-line">{value}</a>
                      : <p className="text-gray-700 font-semibold text-sm whitespace-pre-line">{value}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-heading font-black text-2xl text-green-900 mb-3">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We've received your message and will get back to you within 2 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', phone:'', email:'', subject:'Product Inquiry', message:'' }); }}
                  className="btn-secondary px-6 py-2.5">Send Another Message</button>
              </div>
            ) : (
              <>
                <h2 className="font-heading font-black text-2xl text-green-900 mb-6">{t('sendMessage')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">{t('customerName')} *</label><input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                    <div><label className="label">{t('customerPhone')} *</label><input className="input" placeholder="+251 9..." value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required /></div>
                  </div>
                  <div><label className="label">Email</label><input className="input" type="email" placeholder="Optional" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                  <div><label className="label">Message *</label><textarea className="input h-32 resize-none" placeholder="Tell us what feed or quantity you require..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required /></div>
                  <button type="submit" disabled={sending} className="w-full btn-primary py-4 rounded-xl disabled:opacity-60 text-base font-bold shadow-md">
                    {sending ? 'Sending...' : `${t('sendMessage')} →`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

// ─── TRACK ORDER PAGE ───
export function TrackOrderPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const [ref, setRef] = useState(() => searchParams.get('ref') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const STATUS_STEPS = ['pending','confirmed','processing','delivered'];

  const fetchOrder = async (orderRefCode) => {
    if (!orderRefCode.trim()) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${orderRefCode.trim().toUpperCase()}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Order reference code not found');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const queryRef = searchParams.get('ref');
    if (queryRef) {
      setRef(queryRef);
      fetchOrder(queryRef);
    }
  }, [searchParams]);

  const search = (e) => {
    e.preventDefault();
    fetchOrder(ref);
  };

  const stepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const trackingUrl = `${window.location.origin}/track?ref=${order?.order_ref}`;

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-green-950 to-green-900 py-16 text-center text-white">
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">{t('companyName')}</span>
        <h1 className="font-heading font-black text-5xl mb-4">{t('trackTitle')}</h1>
        <p className="text-white/70 max-w-xl mx-auto">{t('trackSubtitle')}</p>
      </div>

      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <form onSubmit={search} className="flex gap-3 mb-10">
            <input className="input flex-1 text-lg font-mono tracking-wider uppercase font-bold" placeholder="e.g. BOLE-0001" value={ref} onChange={e=>setRef(e.target.value)} />
            <button type="submit" className="btn-primary px-8 flex items-center gap-2 font-bold whitespace-nowrap shadow-lg" disabled={loading}>
              <Search size={18} /> {loading ? 'Searching...' : t('searchBtn')}
            </button>
          </form>

          {error && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-5 text-center font-semibold mb-6">{error}</div>}

          {order && (
            <div className="card p-8 fade-in shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                <div>
                  <span className="text-xs text-gray-400 font-mono">Order Ref:</span>
                  <div className="font-heading font-black text-3xl text-green-900">{order.order_ref}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Placed on: {new Date(order.created_at).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', { year:'numeric', month:'long', day:'numeric' })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge badge-${order.status} uppercase tracking-wider text-xs px-4 py-1.5`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    🖨️ {t('printInvoice')}
                  </button>
                </div>
              </div>

              {/* Progress Timeline */}
              {order.status !== 'cancelled' && (
                <div className="mb-8 bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <h4 className="text-xs font-bold text-green-950 uppercase tracking-wider mb-4">{t('statusTimeline')}</h4>
                  <div className="flex justify-between mb-3">
                    {STATUS_STEPS.map((s,i) => (
                      <div key={s} className={`flex-1 text-center text-xs font-bold ${i <= stepIdx ? 'text-green-900' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${i < stepIdx ? 'bg-green-800 text-white' : i === stepIdx ? 'bg-gold-600 text-white ring-4 ring-gold-200' : 'bg-gray-200 text-gray-400'}`}>
                          {i < stepIdx ? '✓' : i+1}
                        </div>
                        {s === 'pending' ? t('statusPending') : s === 'confirmed' ? t('statusConfirmed') : s === 'processing' ? t('statusProcessing') : t('statusDelivered')}
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-800 rounded-full transition-all" style={{width:`${stepIdx < 0 ? 0 : ((stepIdx+1)/STATUS_STEPS.length)*100}%`}} />
                  </div>
                </div>
              )}

              {/* Order Info & Verification QR */}
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  {[
                    ['Customer', order.customer_name],
                    ['Phone', order.customer_phone],
                    ['Feed Product', order.product_name],
                    ['Quantity', `${order.quantity} bag(s)`],
                    ['Total Amount', `${order.total_price?.toLocaleString()} ETB`],
                    ['Payment Status', order.payment_status?.toUpperCase()],
                    ['Payment Method', order.payment_method || 'Cash / Bank'],
                    ['Fulfillment', order.delivery_method === 'pickup' ? 'Pickup at Factory' : `Delivery`],
                  ].map(([k,v]) => (
                    <div key={k} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{k}</div>
                      <div className="font-bold text-gray-900 text-xs truncate">{v}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center">
                  <QRCodeDisplay
                    value={trackingUrl}
                    size={110}
                    logoText="BOLE"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Official Verification QR</p>
                </div>
              </div>

              {/* Simulated SMS Dispatch Notification Log */}
              <div className="bg-indigo-950 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-3">
                  <MessageSquare size={16} /> {t('smsLogTitle')}
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-indigo-900/60 p-3 rounded-xl border border-indigo-700/40">
                    <span className="text-gold-400 font-bold">[SMS SENT]</span> to {order.customer_phone}:
                    <p className="text-white/90 font-sans text-xs mt-1">
                      "Bole Feed Alert: Order {order.order_ref} ({order.quantity} bags {order.product_name}) status updated to [{order.status.toUpperCase()}]. Track at bolefeed.com/track?ref={order.order_ref}"
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Invoice Modal */}
      {showInvoiceModal && order && (
        <InvoiceModal order={order} onClose={() => setShowInvoiceModal(false)} />
      )}
    </PublicLayout>
  );
}
