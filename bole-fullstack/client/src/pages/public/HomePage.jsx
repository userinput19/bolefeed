import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import { Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true').then(r => setProducts(r.data.slice(0,3))).catch(()=>{});
  }, []);

  const benefitsList = [
    { icon: '🔬', title: t('protein') + ' & Analysis', desc: 'Lab-tested for protein, fiber, fat, calcium, moisture and metabolizable energy content.' },
    { icon: '🌽', title: 'Quality Ingredients', desc: 'Made from premium locally sourced grains, minerals and supplements for maximum value.' },
    { icon: '📦', title: 'Batch Tracking', desc: 'Clear batch numbers and manufacturing dates. 6-month shelf life guaranteed.' },
    { icon: '🥚', title: 'Proven Results', desc: 'Supports high egg production, strong eggshell formation, and rapid weight gain.' },
    { icon: '🚚', title: 'Delivery Service', desc: 'Fast delivery across Addis Ababa and surrounding regions for commercial farms.' },
    { icon: '📞', title: 'Expert Support', desc: 'Our team provides feeding recommendations tailored to your flock\'s age.' },
  ];

  const stepsList = [
    { n: '1', title: 'Choose Product', desc: 'Browse our feed catalog for poultry or livestock.' },
    { n: '2', title: 'Place Order', desc: 'Order online with Telebirr QR, CBE Birr, or cash on delivery.' },
    { n: '3', title: 'Receive Invoice & QR', desc: 'Get your official receipt and order tracking reference.' },
    { n: '4', title: 'Receive Feed', desc: 'Fresh feed delivered to your farm or collected from Bole Michael.' },
  ];

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 50%, #C8920A 0%, transparent 60%)'}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-gold-600/20 border border-gold-500/40 text-gold-300 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-wider uppercase">
              🌿 {t('companyName')} {t('companySubtitle')}
            </div>
            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5">
              {t('heroTitle')}
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/products" className="btn-primary text-base px-8 py-3.5 shadow-lg hover:scale-105 transition-all">{t('heroBtnProducts')} →</Link>
              <Link to="/track" className="btn-outline text-base px-8 py-3.5 hover:scale-105 transition-all">{t('heroBtnTrack')}</Link>
            </div>
            <div className="flex gap-8">
              {[['5+', t('categoryAll')],['50 KG', t('weight')],['6 Mo', 'Shelf Life']].map(([n,l])=>(
                <div key={l}>
                  <div className="font-heading font-black text-3xl text-gold-400">{n}</div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero product card */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl">
              <div className="text-7xl mb-4">🐔</div>
              <div className="font-heading font-black text-gold-300 text-lg mb-1">LAYER SUPER PHASE 1</div>
              <div className="text-white font-black text-3xl mb-5">50 KG</div>
              <div className="grid grid-cols-2 gap-2 text-left">
                {[['16.5%', t('protein')],['3.75%', t('calcium')],['5.0%', t('fat')],['2500', t('energy')]].map(([v,l])=>(
                  <div key={l} className="bg-white/10 rounded-xl p-3">
                    <div className="text-gold-300 font-black text-base leading-none">{v}</div>
                    <div className="text-white/60 text-[11px] mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-gold-600 text-white text-xs font-bold py-2.5 rounded-xl uppercase tracking-widest shadow">
                Scientifically Formulated ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-green-900 text-white py-4 border-t border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center md:justify-between items-center gap-4 text-xs font-semibold">
          {['✅ Lab-Tested Every Batch', '📦 50kg Standard Bags', '📱 Telebirr & CBE Payment QR', '🚚 Farm Delivery Available', '⭐ Trusted by 500+ Farmers'].map(t=>(
            <span key={t} className="text-white/80">{t}</span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">{t('companyName')}</span>
            <h2 className="section-title text-4xl mb-4">{t('navProducts')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('heroSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {products.map(p => (
              <div key={p.id} className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-gradient-to-br from-green-900 to-green-700 p-8 text-center">
                  <div className="text-6xl mb-3">{p.emoji}</div>
                  <h3 className="font-heading font-black text-white text-lg mb-1">{p.name}</h3>
                  <div className="text-white/70 text-sm mb-3">{p.target_animal}</div>
                  <span className="bg-gold-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">{p.weight_kg} KG</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[[t('protein'),p.protein],[t('calcium'),p.calcium],[t('fat'),p.fat],[t('energy'),p.energy]].map(([k,v])=>(
                      <div key={k} className="bg-green-50 rounded-lg p-2.5">
                        <div className="text-green-900 font-black text-sm">{v}</div>
                        <div className="text-gray-500 text-[11px]">{k}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-green-900">{p.price_etb?.toLocaleString()} <span className="text-sm font-medium text-gray-500">ETB</span></span>
                    <span className="text-xs text-gray-400">per 50kg bag</span>
                  </div>
                  <Link to={`/products/${p.id}`} className="w-full bg-green-900 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors block text-center shadow">
                    {t('navOrderNow')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-secondary px-10 py-3.5 text-base shadow-md">{t('heroBtnProducts')} →</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Quality Standard</span>
            <h2 className="section-title text-4xl mb-4">Scientifically Balanced Formulation</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every bag of Bole Animal Feed is produced with precision and delivered fresh from our Addis Ababa facility.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsList.map(b => (
              <div key={b.title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-heading font-bold text-green-950 text-lg mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="py-20 bg-green-900 relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase mb-2 block">Simple Process</span>
            <h2 className="font-heading font-black text-4xl mb-4">How to Order Feed</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsList.map((s) => (
              <div key={s.n} className="text-center relative bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="w-14 h-14 bg-gold-600 rounded-full flex items-center justify-center text-white font-heading font-black text-2xl mx-auto mb-4 shadow-lg">{s.n}</div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary px-10 py-3.5 text-base shadow-xl">{t('navOrderNow')} →</Link>
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">{t('navContact')}</span>
          <h2 className="section-title text-4xl mb-4">{t('contactTitle')}</h2>
          <p className="text-gray-500 text-lg mb-8">{t('contactSubtitle')}</p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a href="tel:+251939277772" className="btn-secondary px-8 py-3.5 text-base flex items-center gap-2 font-bold"><Phone size={18} /> +251 939 277 772</a>
            <Link to="/contact" className="btn-primary px-8 py-3.5 text-base font-bold">{t('sendMessage')} →</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
