import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();

  const links = [
    { to: '/', label: t('navHome') },
    { to: '/products', label: t('navProducts') },
    { to: '/about', label: t('navAbout') },
    { to: '/contact', label: t('navContact') },
    { to: '/track', label: t('navTrack') },
  ];

  return (
    <nav className="bg-green-900 sticky top-0 z-50 shadow-xl">
      {/* Top bar */}
      <div className="bg-green-950 text-white/70 text-xs py-1.5 px-4 hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone size={11} className="text-gold-400" /> {t('phoneHeader')}</span>
            <span className="flex items-center gap-1.5"><MapPin size={11} className="text-gold-400" /> {t('locationHeader')}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Clock size={11} className="text-gold-400" /> {t('hoursHeader')}</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-gold-600/30 hover:bg-gold-600/50 text-gold-300 border border-gold-500/40 px-2.5 py-0.5 rounded-full font-semibold text-[11px] transition-all hover:scale-105"
            >
              <Globe size={11} /> {lang === 'en' ? '🇪🇹 አማርኛ' : '🇺🇸 English'}
            </button>
          </div>
        </div>
      </div>
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center text-xl shadow-lg group-hover:bg-gold-500 transition-colors">🐄</div>
            <div>
              <div className="text-white font-heading font-black text-sm leading-tight">{t('companyName')}</div>
              <div className="text-gold-300 text-[10px] font-medium tracking-widest uppercase">{t('companySubtitle')}</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === l.to ? 'bg-white/15 text-white font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}>
                {l.label}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className="ml-2 flex items-center gap-1 bg-white/10 hover:bg-white/20 text-gold-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-all border border-gold-500/30"
            >
              <Globe size={13} /> {lang === 'en' ? 'አማርኛ' : 'English'}
            </button>

            <button onClick={() => navigate('/products')}
              className="ml-2 bg-gold-600 hover:bg-gold-500 text-white font-bold px-5 py-2 rounded-lg text-sm transition-all shadow-md hover:scale-105">
              {t('navOrderNow')}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-gold-600/30 text-gold-300 font-bold px-2.5 py-1 rounded-lg text-xs border border-gold-500/40"
            >
              {lang === 'en' ? '🇪🇹' : '🇺🇸'}
            </button>
            <button className="text-white p-2" onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium">
                {l.label}
              </Link>
            ))}
            <button onClick={() => { navigate('/products'); setOpen(false); }}
              className="w-full mt-2 bg-gold-600 text-white font-bold py-3 rounded-lg text-sm">
              {t('navOrderNow')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold-700 rounded-full flex items-center justify-center text-2xl">🐄</div>
              <div>
                <div className="font-heading font-black text-lg">Bole Animal Feed</div>
                <div className="text-gold-300 text-xs tracking-widest uppercase">Processing PLC</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Ethiopia's trusted manufacturer of scientifically balanced animal feed. Serving poultry and livestock farmers across the country with quality products since our founding.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="bg-gold-700/20 border border-gold-700/40 text-gold-300 text-xs px-3 py-1 rounded-full">📅 6-Month Shelf Life Guarantee</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-white">Our Products</h4>
            <ul className="space-y-2">
              {['Layer Super Phase 1','Layer Super Phase 2','Broiler Starter','Broiler Finisher','Dairy Cattle Feed'].map(p => (
                <li key={p}><Link to="/products" className="text-white/60 hover:text-gold-300 text-sm transition-colors">{p}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 text-gold-300" /><div><a href="tel:+251939277772" className="hover:text-gold-300 transition-colors block">+251 939 277 772</a><a href="tel:+251939377773" className="hover:text-gold-300 transition-colors block">+251 939 377 773</a><a href="tel:+251711277771" className="hover:text-gold-300 transition-colors block">+251 711 277 771</a></div></li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-gold-300" /><span>Bole Michael, Addis Ababa, Ethiopia</span></li>
              <li className="flex items-start gap-2"><Clock size={14} className="mt-0.5 text-gold-300" /><span>Mon–Sat: 8AM–6PM<br />Sun: 9AM–1PM</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/40">
          <span>© {new Date().getFullYear()} Bole Animal Feed Processing PLC. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/track" className="hover:text-white/70 transition-colors">Track Order</Link>
            <Link to="/admin/login" className="hover:text-white/70 transition-colors">Staff Login</Link>
            <span>🇪🇹 Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
