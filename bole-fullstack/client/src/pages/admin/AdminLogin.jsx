import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-900 to-green-700 p-8 text-center">
            <div className="w-16 h-16 bg-gold-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🐄</div>
            <h1 className="font-heading font-black text-2xl text-white">Bole Animal Feed</h1>
            <p className="text-white/60 text-sm mt-1">Admin Dashboard — Staff Login</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-5">
              <label className="label">Username</label>
              <input className="input" placeholder="Enter your username" autoComplete="username"
                value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
            </div>
            <div className="mb-6">
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-12" type={showPw ? 'text':'password'} placeholder="Enter your password" autoComplete="current-password"
                  value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base rounded-xl disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          <div className="px-8 pb-8 text-center">
            <p className="text-xs text-gray-400 mb-2">Demo credentials:</p>
            <div className="flex gap-3 justify-center">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-mono">admin / bole2024</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-mono">staff / staff123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          <a href="/" className="hover:text-white/60 transition-colors">← Back to Website</a>
        </p>
      </div>
    </div>
  );
}
