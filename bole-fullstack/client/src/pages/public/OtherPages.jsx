import { useState } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Phone, MapPin, Clock, Mail, Search } from 'lucide-react';

// ─── ABOUT PAGE ───
export function AboutPage() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-green-950 to-green-900 py-16 text-center text-white">
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">Our Story</span>
        <h1 className="font-heading font-black text-5xl mb-4">About Bole Animal Feed</h1>
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
                {[['500+','Farmers Served'],['5','Product Varieties'],['50kg','Standard Pack'],['6 Mo','Shelf Life']].map(([n,l])=>(
                  <div key={l} className="bg-green-50 rounded-2xl p-5">
                    <div className="font-heading font-black text-3xl text-green-900 mb-1">{n}</div>
                    <div className="text-gray-500 text-sm">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-3xl p-10 text-white text-center">
              <div className="text-7xl mb-6">🏭</div>
              <h3 className="font-heading font-black text-2xl mb-3">Our Facility</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-5">Located at Bole Michael, Addis Ababa — our modern production facility uses quality-controlled processes to ensure every batch meets our strict nutritional standards.</p>
              <div className="bg-white/10 rounded-2xl p-5">
                <div className="font-bold text-gold-300 mb-3">Quality Promise</div>
                {['Lab-tested every batch','Guaranteed analysis on all bags','Clear batch & expiry dates','6-month shelf life standard'].map(i=>(
                  <div key={i} className="flex items-center gap-2 text-sm text-white/80 mb-2">✅ {i}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission / Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-cream rounded-3xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-heading font-black text-xl text-green-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">To provide Ethiopian farmers with the highest quality, scientifically balanced animal feed that maximizes productivity, health, and profitability at every stage of the production cycle.</p>
            </div>
            <div className="bg-cream rounded-3xl p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-heading font-black text-xl text-green-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">To be the leading animal nutrition company in Ethiopia, empowering farmers with innovative feed solutions that drive sustainable agricultural development across the nation.</p>
            </div>
          </div>

          {/* Products summary */}
          <div className="text-center mb-10">
            <h2 className="section-title text-3xl mb-3">Our Product Range</h2>
            <p className="text-gray-500">Complete nutritional solutions for all your animals</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[['🐔','Layer Feed Phase 1','18–45 weeks'],['🥚','Layer Feed Phase 2','46+ weeks'],['🐣','Broiler Starter','0–3 weeks'],['🍗','Broiler Finisher','4–7 weeks'],['🐄','Dairy Feed','Lactating cows']].map(([e,n,t])=>(
              <div key={n} className="bg-green-900 rounded-2xl p-5 text-center text-white">
                <div className="text-4xl mb-3">{e}</div>
                <div className="font-heading font-bold text-sm mb-1">{n}</div>
                <div className="text-white/60 text-xs">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

// ─── CONTACT PAGE ───
export function ContactPage() {
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
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">Get In Touch</span>
        <h1 className="font-heading font-black text-5xl mb-4">Contact Us</h1>
        <p className="text-white/70 max-w-xl mx-auto">We're here to help. Call us, visit us, or send a message below.</p>
      </div>

      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-heading font-black text-2xl text-green-900 mb-8">Reach Us Directly</h2>
            <div className="space-y-5 mb-10">
              {[
                { icon: Phone, label:'Phone', value:'+251 939 277 772\n+251 939 377 773\n+251 711 277 771', href:'tel:+251939277772' },
                { icon: MapPin, label:'Address', value:'Bole Michael, Addis Ababa, Ethiopia' },
                { icon: Mail,  label:'Email',   value:'info@boleanimalfeed.com', href:'mailto:info@boleanimalfeed.com' },
                { icon: Clock, label:'Hours',   value:'Mon–Sat: 8:00 AM – 6:00 PM\nSun: 9:00 AM – 1:00 PM' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-green-900" />
                  </div>
                  <div>
                    <div className="font-bold text-green-900 text-sm mb-1">{label}</div>
                    {href
                      ? <a href={href} className="text-gray-600 text-sm hover:text-green-700 whitespace-pre-line">{value}</a>
                      : <p className="text-gray-600 text-sm whitespace-pre-line">{value}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-900 rounded-3xl p-7 text-white">
              <h3 className="font-heading font-bold text-lg mb-2">🚀 Quick Order</h3>
              <p className="text-white/70 text-sm mb-4">Want to order directly? Call us and our team will take your order immediately.</p>
              <a href="tel:+251939277772" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                <Phone size={16} /> Call Now: +251 939 277 772
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-heading font-black text-2xl text-green-900 mb-3">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We've received your message and will get back to you as soon as possible.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', phone:'', email:'', subject:'Product Inquiry', message:'' }); }}
                  className="btn-secondary px-6 py-2.5">Send Another Message</button>
              </div>
            ) : (
              <>
                <h2 className="font-heading font-black text-2xl text-green-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Full Name *</label><input className="input" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                    <div><label className="label">Phone *</label><input className="input" placeholder="+251 9..." value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required /></div>
                  </div>
                  <div><label className="label">Email</label><input className="input" type="email" placeholder="Optional" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                  <div>
                    <label className="label">Subject</label>
                    <select className="input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                      {['Product Inquiry','Bulk Order','Delivery Question','Technical Support','Price Quote','Other'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Message *</label><textarea className="input h-32 resize-none" placeholder="Tell us what you need..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required /></div>
                  <button type="submit" disabled={sending} className="w-full btn-primary py-4 rounded-xl disabled:opacity-60 text-base">
                    {sending ? 'Sending...' : 'Send Message →'}
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
  const [ref, setRef] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const STATUS_STEPS = ['pending','confirmed','processing','delivered'];
  const STATUS_LABELS = { pending:'Order Received', confirmed:'Confirmed', processing:'In Progress', delivered:'Delivered', cancelled:'Cancelled' };

  const search = async (e) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${ref.trim().toUpperCase()}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found');
    } finally { setLoading(false); }
  };

  const stepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-green-950 to-green-900 py-16 text-center text-white">
        <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">Order Status</span>
        <h1 className="font-heading font-black text-5xl mb-4">Track Your Order</h1>
        <p className="text-white/70">Enter your order reference number to check the status.</p>
      </div>

      <section className="py-20 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <form onSubmit={search} className="flex gap-3 mb-10">
            <input className="input flex-1 text-lg" placeholder="e.g. BOLE-0001" value={ref} onChange={e=>setRef(e.target.value)} />
            <button type="submit" className="btn-primary px-6 flex items-center gap-2 whitespace-nowrap" disabled={loading}>
              <Search size={18} /> {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 text-center mb-6">{error}</div>}

          {order && (
            <div className="card p-8 fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-heading font-black text-2xl text-green-900">{order.order_ref}</div>
                  <div className="text-gray-500 text-sm mt-1">Placed: {new Date(order.created_at).toLocaleDateString('en-ET', { year:'numeric',month:'long',day:'numeric' })}</div>
                </div>
                <span className={`badge badge-${order.status}`}>{order.status.charAt(0).toUpperCase()+order.status.slice(1)}</span>
              </div>

              {/* Progress bar */}
              {order.status !== 'cancelled' && (
                <div className="mb-8">
                  <div className="flex justify-between mb-3">
                    {STATUS_STEPS.map((s,i) => (
                      <div key={s} className={`flex-1 text-center text-xs font-bold ${i <= stepIdx ? 'text-green-900' : 'text-gray-300'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${i < stepIdx ? 'bg-green-700 text-white' : i === stepIdx ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {i < stepIdx ? '✓' : i+1}
                        </div>
                        {STATUS_LABELS[s]}
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-700 rounded-full transition-all" style={{width:`${stepIdx < 0 ? 0 : ((stepIdx+1)/STATUS_STEPS.length)*100}%`}} />
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Customer', order.customer_name],
                  ['Phone', order.customer_phone],
                  ['Product', order.product_name],
                  ['Quantity', `${order.quantity} bag(s)`],
                  ['Total', `${order.total_price?.toLocaleString()} ETB`],
                  ['Payment', order.payment_status],
                  ['Delivery', order.delivery_method === 'pickup' ? 'Pickup from Bole Michael' : `Delivery to: ${order.delivery_address}`],
                  ['Last Update', new Date(order.updated_at).toLocaleDateString()],
                ].map(([k,v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{k}</div>
                    <div className="font-semibold text-green-900 text-sm">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                Questions about your order?{' '}
                <a href="tel:+251939277772" className="text-green-700 font-bold hover:underline">Call +251 939 277 772</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
