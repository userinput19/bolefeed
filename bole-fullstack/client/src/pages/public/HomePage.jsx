import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import { CheckCircle, Phone, Star, TrendingUp, Shield, Truck, Award } from 'lucide-react';

const BENEFITS = [
  { icon: '🔬', title: 'Guaranteed Analysis', desc: 'Every product is lab-tested for protein, fiber, fat, calcium, moisture and energy content.' },
  { icon: '🌽', title: 'Quality Ingredients', desc: 'Made from premium locally sourced grains, minerals and supplements for maximum nutritional value.' },
  { icon: '📦', title: 'Batch Tracking', desc: 'Clear batch numbers and manufacturing dates. 6-month shelf life guaranteed on every bag.' },
  { icon: '🥚', title: 'Proven Results', desc: 'Supports high egg production, strong eggshell formation, healthy growth and improved feed conversion.' },
  { icon: '🚚', title: 'Delivery Service', desc: 'Fast delivery across Addis Ababa and surrounding regions. Bulk orders always welcome.' },
  { icon: '📞', title: 'Expert Support', desc: 'Our team provides feeding recommendations tailored to your flock\'s age and production stage.' },
];

const STEPS = [
  { n: '1', title: 'Choose Product', desc: 'Browse our product range and select the right feed for your animals\' breed, age and production stage.' },
  { n: '2', title: 'Place Order', desc: 'Fill in your details online or call us directly. We confirm all orders within 2 hours.' },
  { n: '3', title: 'Make Payment', desc: 'Pay on delivery or via bank transfer. Flexible payment options available for bulk buyers.' },
  { n: '4', title: 'Receive Feed', desc: 'Fresh feed delivered to your farm or collect from our facility in Bole Michael.' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?featured=true').then(r => setProducts(r.data.slice(0,3))).catch(()=>{});
  }, []);

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 50%, #C8920A 0%, transparent 60%)'}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-gold-700/20 border border-gold-700/40 text-gold-300 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-wider uppercase">
              🌿 Ethiopia's Trusted Feed Brand
            </div>
            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5">
              Quality Feed for<br /><span className="text-gold-400">Better Results</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
              Scientifically formulated poultry and livestock feed manufactured at Bole Michael, Addis Ababa — trusted by farmers across Ethiopia.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/products" className="btn-primary text-base px-8 py-3.5">Browse Products →</Link>
              <a href="tel:+251939277772" className="btn-outline text-base px-8 py-3.5">📞 Call Now</a>
            </div>
            <div className="flex gap-8">
              {[['5+','Feed Varieties'],['50 KG','Standard Pack'],['6 Mo','Shelf Life']].map(([n,l])=>(
                <div key={l}>
                  <div className="font-heading font-black text-3xl text-gold-400">{n}</div>
                  <div className="text-white/50 text-sm mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero product card */}
          <div className="hidden md:flex justify-center">
            <div className="float bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl p-8 max-w-xs w-full text-center">
              <div className="text-7xl mb-4">🐔</div>
              <div className="font-heading font-black text-gold-300 text-lg mb-1">LAYER SUPER PHASE 1</div>
              <div className="text-white font-black text-3xl mb-5">50 KG</div>
              <div className="grid grid-cols-2 gap-2 text-left">
                {[['16.5%','Crude Protein'],['3.75%','Calcium'],['5.0%','Crude Fat'],['2500','Kcal/Kg']].map(([v,l])=>(
                  <div key={l} className="bg-white/10 rounded-xl p-3">
                    <div className="text-gold-300 font-black text-lg leading-none">{v}</div>
                    <div className="text-white/60 text-xs mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-gold-700 text-white text-sm font-bold py-2.5 rounded-xl">
                Balanced Nutrition ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-green-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm">
          {['✅ Lab-Tested Every Batch', '📦 50kg Standard Bags', '🚚 Delivery to Your Farm', '📞 Same-Day Order Confirmation', '⭐ Trusted by 500+ Farmers'].map(t=>(
            <span key={t} className="text-white/80 font-medium">{t}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Our Range</span>
            <h2 className="section-title text-4xl mb-4">Featured Feed Products</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Scientifically balanced nutrition for every stage of your animals' productive lives.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {products.map(p => (
              <div key={p.id} className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-green-900 to-green-700 p-8 text-center">
                  <div className="text-6xl mb-3">{p.emoji}</div>
                  <h3 className="font-heading font-black text-white text-lg mb-1">{p.name}</h3>
                  <div className="text-white/70 text-sm mb-3">{p.target_animal}</div>
                  <span className="bg-gold-700 text-white text-sm font-bold px-4 py-1.5 rounded-full">{p.weight_kg} KG</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[['Protein',p.protein],['Calcium',p.calcium],['Fat',p.fat],['Energy',p.energy]].map(([k,v])=>(
                      <div key={k} className="bg-green-50 rounded-lg p-2.5">
                        <div className="text-green-900 font-black text-sm">{v}</div>
                        <div className="text-gray-500 text-xs">{k}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(Array.isArray(p.benefits) ? p.benefits : (p.benefits||'').split(',')).slice(0,3).map(b=>(
                      <span key={b} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{b.trim()}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-green-900">{p.price_etb?.toLocaleString()} <span className="text-sm font-medium text-gray-500">ETB</span></span>
                    <span className="text-xs text-gray-400">per 50kg bag</span>
                  </div>
                  <Link to={`/products/${p.id}`} className="w-full bg-green-900 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors block text-center">
                    View & Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-secondary px-10 py-3.5 text-base">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title text-4xl mb-4">Quality You Can Count On</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every bag of Bole Animal Feed is produced with precision, tested for accuracy, and delivered fresh from our Addis Ababa facility.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-heading font-bold text-green-900 text-lg mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO ORDER ── */}
      <section className="py-20 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 20% 80%, #F0B429, transparent 50%)'}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase mb-2 block">Simple Process</span>
            <h2 className="font-heading font-black text-4xl text-white mb-4">How to Order</h2>
            <p className="text-white/60 max-w-lg mx-auto">Getting quality feed for your farm is simple and fast. Follow these steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="text-center relative">
                {i < STEPS.length - 1 && <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gold-700/30" />}
                <div className="w-16 h-16 bg-gold-700 rounded-full flex items-center justify-center text-white font-heading font-black text-2xl mx-auto mb-5 relative z-10 shadow-lg">{s.n}</div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary px-10 py-3.5 text-base">Start Your Order →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title text-4xl mb-4">Ready to Improve Your Farm's Performance?</h2>
          <p className="text-gray-500 text-lg mb-8">Call us today or place your order online. Our team is ready to help you choose the right feed.</p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a href="tel:+251939277772" className="btn-secondary px-8 py-3.5 text-base flex items-center gap-2"><Phone size={18} /> +251 939 277 772</a>
            <Link to="/contact" className="btn-primary px-8 py-3.5 text-base">Send a Message →</Link>
          </div>
          <div className="bg-cream rounded-3xl p-8 grid sm:grid-cols-3 gap-6 text-center">
            {[['📍','Address','Bole Michael, Addis Ababa'],['⏰','Working Hours','Mon–Sat 8AM–6PM | Sun 9AM–1PM'],['📅','Shelf Life','6 Months from Manufacturing Date']].map(([icon,title,val])=>(
              <div key={title}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-heading font-bold text-green-900 text-sm mb-1">{title}</div>
                <div className="text-gray-500 text-sm">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
