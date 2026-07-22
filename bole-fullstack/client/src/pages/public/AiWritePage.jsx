import { useState } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Copy, Download, RefreshCw, Send, Check, FileText } from 'lucide-react';

export default function AiWritePage() {
  const { t, lang } = useLanguage();
  const [templateType, setTemplateType] = useState('feed_schedule'); // feed_schedule, proposal, complaint, custom
  const [tone, setTone] = useState('professional');
  const [writeLang, setWriteLang] = useState(lang); // default to current site language
  const [prompt, setPrompt] = useState('');
  
  // Custom metadata fields
  const [animal, setAnimal] = useState('Layers');
  const [flockSize, setFlockSize] = useState('500');
  const [recipientName, setRecipientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Refinement fields
  const [refineInstruction, setRefineInstruction] = useState('');
  const [refining, setRefining] = useState(false);

  const templates = [
    { id: 'feed_schedule', emoji: '🐔', title: t('aiWriteTemplateFeed'), desc: 'Weekly guidelines & feed weights' },
    { id: 'proposal', emoji: '📄', title: t('aiWriteTemplateProposal'), desc: 'Bulk supply requests & partnerships' },
    { id: 'complaint', emoji: '💬', title: t('aiWriteTemplateComplaint'), desc: 'Quality feedback or issue reporting' },
    { id: 'custom', emoji: '✏️', title: t('aiWriteTemplateCustom'), desc: 'Write anything else about farming' }
  ];

  const tones = [
    { id: 'professional', label: t('aiWriteToneProfessional') },
    { id: 'friendly', label: t('aiWriteToneFriendly') },
    { id: 'urgent', label: t('aiWriteToneUrgent') },
    { id: 'informative', label: t('aiWriteToneInformative') }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (templateType === 'custom' && !prompt.trim()) {
      return toast.error(writeLang === 'am' ? 'እባክዎን ዋናውን ርዕስ ወይም ዝርዝር ጉዳይ ያስገቡ' : 'Please enter a description or prompt');
    }

    setLoading(true);
    try {
      const details = {};
      if (templateType === 'feed_schedule') {
        details.animal = animal;
        details.size = flockSize;
      } else if (templateType === 'proposal') {
        details.name = recipientName;
        details.company = companyName;
      } else if (templateType === 'complaint') {
        details.name = customerName;
      }

      const res = await api.post('/ai/write', {
        prompt,
        templateType,
        tone,
        lang: writeLang,
        details
      });

      setOutput(res.data.reply);
      toast.success(writeLang === 'am' ? 'ጽሑፉ በተሳካ ሁኔታ ተዘጋጅቷል!' : 'Document generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (e) => {
    e.preventDefault();
    if (!refineInstruction.trim()) return;

    setRefining(true);
    try {
      const res = await api.post('/ai/refine', {
        previousText: output,
        instruction: refineInstruction,
        lang: writeLang,
        tone
      });

      setOutput(res.data.reply);
      setRefineInstruction('');
      toast.success(writeLang === 'am' ? 'ጽሑፉ በተሳካ ሁኔታ ተሻሽሏል!' : 'Document refined successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to refine document');
    } finally {
      setRefining(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(writeLang === 'am' ? 'በቅንጥብ ሰሌዳው ላይ ተገልብጧል!' : 'Copied to clipboard!');
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bole-ai-${templateType}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <PublicLayout>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C8920A 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <span className="text-gold-300 text-xs font-bold tracking-[3px] uppercase block mb-3">
            ✨ {t('companyName')} AI
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl mb-4">
            {t('aiWriteTitle')}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {t('aiWriteSubtitle')}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <section className="py-12 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Controls Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <form onSubmit={handleGenerate} className="space-y-6">
                
                {/* Template Selection */}
                <div>
                  <label className="block text-green-950 font-black text-xs uppercase tracking-wider mb-3">
                    {t('aiWriteTemplate')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map(tpl => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setTemplateType(tpl.id)}
                        className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                          templateType === tpl.id
                            ? 'bg-green-50 border-green-900 text-green-950 ring-2 ring-green-900/10 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50/30'
                        }`}
                      >
                        <span className="text-2xl mb-1.5">{tpl.emoji}</span>
                        <span className="font-heading font-bold text-xs leading-snug">{tpl.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Fields based on template */}
                {templateType === 'feed_schedule' && (
                  <div className="grid grid-cols-2 gap-4 bg-green-50/50 p-4 rounded-2xl border border-green-100/60 animate-fadeIn">
                    <div>
                      <label className="label text-green-900 font-bold text-xs">{t('aiWriteDetailAnimal')}</label>
                      <select
                        value={animal}
                        onChange={(e) => setAnimal(e.target.value)}
                        className="input bg-white text-sm"
                      >
                        <option value="Layers">{writeLang === 'am' ? 'የእንቁላል ዶሮ' : 'Layers'}</option>
                        <option value="Broilers">{writeLang === 'am' ? 'የስጋ ዶሮ' : 'Broilers'}</option>
                        <option value="Dairy Cows">{writeLang === 'am' ? 'የወተት ላም' : 'Dairy Cows'}</option>
                        <option value="Beef Cattle">{writeLang === 'am' ? 'የስጋ ከብት' : 'Beef Cattle'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="label text-green-900 font-bold text-xs">{t('aiWriteDetailFlockSize')}</label>
                      <input
                        type="number"
                        value={flockSize}
                        onChange={(e) => setFlockSize(e.target.value)}
                        className="input bg-white text-sm"
                        placeholder="500"
                      />
                    </div>
                  </div>
                )}

                {templateType === 'proposal' && (
                  <div className="space-y-4 bg-green-50/50 p-4 rounded-2xl border border-green-100/60 animate-fadeIn">
                    <div>
                      <label className="label text-green-900 font-bold text-xs">{t('aiWriteDetailName')}</label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="input bg-white text-sm"
                        placeholder={writeLang === 'am' ? 'ምሳሌ፡ የድርጅቱ ሥራ አስኪያጅ' : 'e.g. Cooperative Manager'}
                      />
                    </div>
                    <div>
                      <label className="label text-green-900 font-bold text-xs">{t('aiWriteDetailCompany')}</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="input bg-white text-sm"
                        placeholder={writeLang === 'am' ? 'ምሳሌ፡ የእኛ እርሻ ስም' : 'e.g. Green Valley Farm'}
                      />
                    </div>
                  </div>
                )}

                {templateType === 'complaint' && (
                  <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/60 animate-fadeIn">
                    <label className="label text-green-900 font-bold text-xs">{t('customerName')}</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input bg-white text-sm"
                      placeholder={writeLang === 'am' ? 'ምሳሌ፡ ደበበ በቀለ' : 'e.g. Debebe Bekele'}
                    />
                  </div>
                )}

                {/* Tone Select */}
                <div>
                  <label className="block text-green-950 font-black text-xs uppercase tracking-wider mb-2">
                    {t('aiWriteTone')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {tones.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all ${
                          tone === t.id
                            ? 'bg-green-900 border-green-900 text-white shadow'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output/Generation Language Option */}
                <div>
                  <label className="block text-green-950 font-black text-xs uppercase tracking-wider mb-2">
                    Output Language
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWriteLang('en')}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        writeLang === 'en'
                          ? 'bg-gold-600 border-gold-600 text-white shadow'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      type="button"
                      onClick={() => setWriteLang('am')}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        writeLang === 'am'
                          ? 'bg-gold-700 border-gold-700 text-white shadow'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      🇪🇹 አማርኛ
                    </button>
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-green-950 font-black text-xs uppercase tracking-wider mb-2">
                    {t('aiWritePrompt')}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input h-32 resize-none text-sm placeholder-gray-400 border-gray-200 focus:border-green-600"
                    placeholder={
                      templateType === 'feed_schedule'
                        ? (writeLang === 'am' ? 'ምሳሌ፡ ለ 500 ጫጩቶች ከመጀመሪያው ሳምንት ጀምሮ የተሟላ የአመጋገብ ሰንጠረዥ...' : 'e.g. Detailed schedule for 500 layers from week 1 to 20 including weight recommendations')
                        : templateType === 'proposal'
                        ? (writeLang === 'am' ? 'ምሳሌ፡ የጅምላ መኖ በቅናሽ ዋጋ እንዲቀርብልን የሚጠይቅ ደብዳቤ...' : 'e.g. Letter requesting wholesale feed supply and a meeting to align on logistics')
                        : templateType === 'complaint'
                        ? (writeLang === 'am' ? 'ምሳሌ፡ ባለፈው ሳምንት የገዛነው የዶሮ መኖ የእንቁላል መጠን ቀንሷል...' : 'e.g. A quality feedback reporting that the last feed batch led to a slight dip in egg production')
                        : t('aiWritePromptPlaceholder')
                    }
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-900 hover:bg-green-800 text-white font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>{t('aiWriteBtnLoading')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="text-gold-300" />
                      <span>{t('aiWriteBtn')}</span>
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Right Side: Output Paper Terminal */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                
                {/* Paper Header / Toolbar */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="ml-2 font-heading font-black text-xs text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <FileText size={12} /> {t('aiWriteOutputTitle')}
                    </span>
                  </div>

                  {output && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                        title={t('aiWriteCopy')}
                      >
                        {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                        <span>{copied ? (writeLang === 'am' ? 'ተገልብጧል' : 'Copied') : t('aiWriteCopy')}</span>
                      </button>
                      
                      <button
                        onClick={handleDownload}
                        className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                        title={t('aiWriteDownload')}
                      >
                        <Download size={13} />
                        <span>{t('aiWriteDownload')}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Notepad Content Area */}
                <div className="p-8 min-h-[350px] relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                  {output ? (
                    <div className="prose prose-green max-w-none text-gray-800 font-body text-sm sm:text-base leading-relaxed whitespace-pre-wrap select-text selection:bg-green-100">
                      {output}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/60 backdrop-blur-[1px]">
                      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100 shadow-sm">
                        <Sparkles size={28} className="text-green-800" />
                      </div>
                      <h3 className="font-heading font-black text-gray-700 text-lg mb-1">
                        {writeLang === 'am' ? 'ለመጀመር ጽሑፍ ያመንጩ' : 'Ready to write'}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm max-w-sm">
                        {t('aiWriteOutputPlaceholder')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Status bar */}
                <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3.5 flex justify-between items-center text-xs text-gray-400">
                  <span>Characters: {output.length}</span>
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-900/60 bg-green-50 border border-green-900/10 px-2 py-0.5 rounded">
                    ⚡ Gemini Powered
                  </span>
                </div>
              </div>

              {/* Refinement Widget */}
              {output && (
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-green-950">
                    <Sparkles size={16} className="text-gold-600 animate-bounce" />
                    <h4 className="font-heading font-bold text-sm uppercase tracking-wider">{t('aiWriteRefineTitle')}</h4>
                  </div>
                  
                  <form onSubmit={handleRefine} className="flex gap-2">
                    <input
                      type="text"
                      value={refineInstruction}
                      onChange={(e) => setRefineInstruction(e.target.value)}
                      placeholder={t('aiWriteRefinePlaceholder')}
                      className="input flex-1 text-sm bg-gray-50 border-gray-200 focus:border-green-600"
                      disabled={refining}
                      required
                    />
                    
                    <button
                      type="submit"
                      disabled={refining || !refineInstruction.trim()}
                      className="bg-green-900 hover:bg-green-800 text-white font-bold px-5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow disabled:opacity-50"
                    >
                      {refining ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      <span className="hidden sm:inline">{refining ? t('aiWriteRefineLoading') : t('aiWriteRefineBtn')}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
