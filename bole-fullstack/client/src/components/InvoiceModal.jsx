import { QRCodeDisplay } from './QRCodeGenerator';
import { X, Printer, CheckCircle2, Building2, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InvoiceModal({ order, onClose }) {
  const { t, lang } = useLanguage();
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const trackingUrl = `${window.location.origin}/track?ref=${order.order_ref || `BOLE-${String(order.id).padStart(4, '0')}`}`;
  const orderRef = order.order_ref || `BOLE-${String(order.id).padStart(4, '0')}`;
  const createdDate = order.created_at ? new Date(order.created_at).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      {/* Modal Actions Header */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-xl transition-all hover:scale-105"
        >
          <Printer size={18} /> {t('printInvoice')}
        </button>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Invoice Container */}
      <div className="bg-white text-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl p-8 sm:p-12 my-8 print:m-0 print:p-6 print:shadow-none print:w-full print:max-w-none">
        
        {/* Printable Letterhead Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-green-900 pb-6 mb-6 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-900 rounded-2xl flex items-center justify-center text-3xl text-gold-300 shadow-md">
              🐄
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl text-green-950 tracking-tight">
                {t('companyName')}
              </h1>
              <p className="text-gold-700 font-bold text-xs tracking-widest uppercase">
                {t('companySubtitle')}
              </p>
              <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                <p className="flex items-center gap-1.5"><MapPin size={12} className="text-green-800" /> Bole Michael, Addis Ababa, Ethiopia</p>
                <p className="flex items-center gap-1.5"><Phone size={12} className="text-green-800" /> +251 939 277 772 / +251 939 377 773</p>
                <p className="flex items-center gap-1.5"><Building2 size={12} className="text-green-800" /> {t('companyTin')}</p>
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto bg-green-50/60 p-4 rounded-xl border border-green-100">
            <span className="inline-block bg-green-900 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-2">
              {t('invoiceTitle')}
            </span>
            <div className="text-sm font-mono font-bold text-green-950">{orderRef}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
              <Calendar size={12} /> {createdDate}
            </div>
            <div className="mt-2">
              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                order.payment_status === 'partial' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {order.payment_status === 'paid' ? t('paid') : order.payment_status === 'partial' ? t('partial') : t('unpaid')}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Fulfillment Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-200/80 mb-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t('billTo')}
            </h3>
            <p className="font-bold text-gray-900 text-base">{order.customer_name}</p>
            <p className="text-xs font-mono text-gray-700 mt-1">📞 {order.customer_phone}</p>
            {order.customer_email && <p className="text-xs text-gray-600">✉️ {order.customer_email}</p>}
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t('deliveryMethod')} & Payment:
            </h3>
            <p className="text-xs font-semibold text-gray-800">
              🚚 {order.delivery_method === 'delivery' ? t('deliveryHome') : t('deliveryPickup')}
            </p>
            {order.delivery_address && (
              <p className="text-xs text-gray-600 mt-1">📍 {order.delivery_address}</p>
            )}
            <p className="text-xs font-medium text-gray-700 mt-2">
              💳 Payment Method: <span className="font-bold uppercase">{order.payment_method || 'Cash / Transfer'}</span>
            </p>
            {order.payment_txn_ref && (
              <p className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                Txn Ref: {order.payment_txn_ref}
              </p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-900 text-white text-xs uppercase font-bold">
                <th className="p-3 rounded-l-lg">{t('item')}</th>
                <th className="p-3 text-center">{t('quantity')}</th>
                <th className="p-3 text-right">{t('unitPrice')}</th>
                <th className="p-3 text-right rounded-r-lg">{t('totalAmount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              <tr>
                <td className="p-3 font-semibold text-gray-900">
                  {order.product_name}
                  <span className="block text-xs font-normal text-gray-500">Net Weight: 50kg Bag</span>
                </td>
                <td className="p-3 text-center font-bold text-gray-800">{order.quantity} {t('bags')}</td>
                <td className="p-3 text-right font-mono text-gray-700">{Number(order.unit_price).toLocaleString()} ETB</td>
                <td className="p-3 text-right font-mono font-bold text-gray-900">{Number(order.total_price).toLocaleString()} ETB</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Verification QR Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center border-t border-gray-200 pt-6">
          <div className="flex items-center gap-4 bg-green-50/50 p-4 rounded-xl border border-green-100">
            <QRCodeDisplay
              value={trackingUrl}
              size={90}
              logoText="BOLE"
            />
            <div>
              <p className="text-xs font-bold text-green-950">{t('orderQrVerification')}</p>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">{t('scanToVerifyInvoice')}</p>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{t('subtotal')}:</span>
              <span className="font-mono font-semibold">{Number(order.total_price).toLocaleString()} ETB</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{t('deliveryFee')}:</span>
              <span className="font-mono font-semibold">0.00 ETB (Included)</span>
            </div>
            <div className="flex justify-between text-base font-bold text-green-950 border-t border-gray-300 pt-2">
              <span>{t('grandTotal')}:</span>
              <span className="font-mono text-xl text-green-900">{Number(order.total_price).toLocaleString()} ETB</span>
            </div>
          </div>
        </div>

        {/* Stamp & Footer Authorization */}
        <div className="mt-10 pt-6 border-t border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-gray-500">
          <div>
            <p className="font-bold text-gray-700">Bole Animal Feed Processing PLC</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Thank you for trusting us with your farm's nutrition.</p>
          </div>

          <div className="text-center sm:text-right border-t border-gray-400 pt-2 w-48">
            <p className="font-semibold text-gray-800">{t('authorizedSignature')}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Official Factory Dispatch</p>
          </div>
        </div>

      </div>
    </div>
  );
}
