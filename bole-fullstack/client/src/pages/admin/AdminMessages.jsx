import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Phone, Mail, Trash2, CheckCheck, Reply, X, Filter } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all'); // all | unread | replied

  useEffect(() => { fetchMessages(); }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === 'unread') params.append('read', 'false');
      if (filter === 'read') params.append('read', 'true');
      const { data } = await api.get(`/messages?${params}`);
      setMessages(data.messages);
      setUnread(data.unread);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  const markRead = async (msg) => {
    if (msg.read) return;
    try {
      await api.put(`/messages/${msg.id}`, { read: true });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const openMessage = (msg) => {
    setSelected(msg);
    setReplyText(msg.admin_reply || '');
    markRead(msg);
  };

  const saveReply = async () => {
    if (!replyText.trim()) return;
    try {
      await api.put(`/messages/${selected.id}`, { admin_reply: replyText, replied: true });
      setMessages(prev => prev.map(m => m.id === selected.id ? { ...m, admin_reply: replyText, replied: true } : m));
      setSelected(prev => ({ ...prev, admin_reply: replyText, replied: true }));
      toast.success('Reply saved');
    } catch { toast.error('Failed to save reply'); }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Message deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout stats={{ unread_messages: unread }}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-800">Messages</h1>
            <p className="text-gray-500 text-sm mt-1">
              Customer inquiries from the website.
              {unread > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} unread</span>}
            </p>
          </div>
          <div className="flex gap-2">
            {[['all','All'],['unread','Unread'],['read','Read']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`btn-sm px-4 py-2 ${filter===v ? 'bg-green-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p>No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map(m => (
                  <div key={m.id}
                    onClick={() => openMessage(m)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === m.id ? 'bg-green-50 border-l-4 border-green-700' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {!m.read && <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0 mt-1" />}
                        <span className={`text-sm font-bold ${m.read ? 'text-gray-700' : 'text-gray-900'}`}>{m.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs font-semibold text-green-700 mb-1 ml-4">{m.subject}</div>
                    <p className="text-xs text-gray-500 line-clamp-2 ml-4">{m.message}</p>
                    <div className="flex gap-2 mt-2 ml-4">
                      {m.replied && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Replied</span>}
                      {m.read && !m.replied && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Read</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-heading font-bold text-gray-800">{selected.subject}</h3>
                <div className="flex gap-2">
                  <button onClick={() => deleteMessage(selected.id)} className="btn-sm bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1">
                    <Trash2 size={13} /> Delete
                  </button>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-5">
                {/* Sender info */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="font-bold text-gray-800 text-lg mb-2">{selected.name}</div>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-green-700 hover:underline font-semibold">
                      <Phone size={14} /> {selected.phone}
                    </a>
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-green-700 hover:underline">
                        <Mail size={14} /> {selected.email}
                      </a>
                    )}
                    <span className="text-gray-400 text-xs">{new Date(selected.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</div>
                  <div className="bg-blue-50 rounded-2xl p-4 text-gray-700 text-sm leading-relaxed">
                    {selected.message}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2">
                  <a href={`tel:${selected.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-900 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm">
                    <Phone size={15} /> Call Customer
                  </a>
                  {selected.email && (
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                      <Mail size={15} /> Send Email
                    </a>
                  )}
                </div>

                {/* Internal reply/notes */}
                <div>
                  <label className="label flex items-center gap-2">
                    <Reply size={14} /> Internal Notes / Reply
                  </label>
                  <textarea
                    className="input h-28 resize-none text-sm"
                    placeholder="Write your internal notes or draft a reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveReply}
                      className="flex-1 flex items-center justify-center gap-2 btn-secondary py-2.5 rounded-xl text-sm">
                      <CheckCheck size={15} /> Save Notes & Mark Replied
                    </button>
                  </div>
                </div>

                {selected.replied && selected.admin_reply && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="text-xs font-bold text-green-700 mb-1">✓ Saved Reply / Notes</div>
                    <div className="text-sm text-gray-700">{selected.admin_reply}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 min-h-[400px]">
              <div className="text-center">
                <div className="text-5xl mb-3">💬</div>
                <p className="font-medium">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
