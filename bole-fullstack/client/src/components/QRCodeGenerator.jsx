import { QRCodeSVG } from 'qrcode.react';

export function QRCodeDisplay({ value, size = 160, title, subtitle, logoText = "BOLE FEED" }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-md text-center">
      <div className="p-3 bg-green-50 rounded-xl border border-green-100 shadow-inner mb-3 relative">
        <QRCodeSVG
          value={value || 'https://boleanimalfeed.com'}
          size={size}
          bgColor="#ffffff"
          fgColor="#1B4D2E"
          level="H"
          includeMargin={true}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-green-900 text-gold-300 text-[9px] font-black px-1.5 py-0.5 rounded shadow border border-gold-400">
            {logoText}
          </span>
        </div>
      </div>
      {title && <h4 className="text-sm font-bold text-gray-900 leading-tight">{title}</h4>}
      {subtitle && <p className="text-xs text-gray-500 mt-1 max-w-xs">{subtitle}</p>}
    </div>
  );
}

export function TelebirrPaymentQR({ amount, merchantNo = "+251 939 277 772" }) {
  const qrPayload = `telebirr://pay?merchant=${merchantNo}&amount=${amount || 0}&currency=ETB`;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl text-center">
      <div className="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-3 border border-blue-400/30">
        <span>📱 Telebirr QR Express Payment</span>
      </div>
      
      <div className="flex justify-center my-2">
        <div className="p-3 bg-white rounded-xl shadow-2xl">
          <QRCodeSVG
            value={qrPayload}
            size={170}
            bgColor="#ffffff"
            fgColor="#005B94"
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-blue-200">Merchant / Telebirr No:</p>
        <p className="text-base font-black text-white tracking-widest font-mono">{merchantNo}</p>
        {amount > 0 && (
          <p className="text-xs font-bold text-amber-300 mt-1">Amount to Pay: {amount.toLocaleString()} ETB</p>
        )}
      </div>
    </div>
  );
}

export function CBEPaymentQR({ amount, accountNo = "1000123456789" }) {
  const qrPayload = `cbe://transfer?acc=${accountNo}&amount=${amount || 0}&name=Bole+Animal+Feed`;

  return (
    <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white p-5 rounded-2xl shadow-xl text-center">
      <div className="inline-flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-3 border border-amber-400/30">
        <span>🏦 CBE Birr / Mobile Banking QR</span>
      </div>
      
      <div className="flex justify-center my-2">
        <div className="p-3 bg-white rounded-xl shadow-2xl">
          <QRCodeSVG
            value={qrPayload}
            size={170}
            bgColor="#ffffff"
            fgColor="#7B1FA2"
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-amber-200">CBE Account Number:</p>
        <p className="text-base font-black text-white tracking-widest font-mono">{accountNo}</p>
        <p className="text-[11px] text-amber-200/80">Name: Bole Animal Feed Processing PLC</p>
      </div>
    </div>
  );
}
