import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Nav & General
    companyName: "Bole Animal Feed",
    companySubtitle: "Processing PLC",
    navHome: "Home",
    navProducts: "Products",
    navAbout: "About Us",
    navContact: "Contact",
    navTrack: "Track Order",
    navOrderNow: "Order Now",
    navStaffLogin: "Staff Login",
    phoneHeader: "+251 939 277 772",
    locationHeader: "Bole Michael, Addis Ababa",
    hoursHeader: "Mon–Sat: 8AM–6PM",
    
    // Home Hero
    heroTitle: "Scientifically Formulated Feed for Maximum Yield",
    heroSubtitle: "Premium quality animal feed for poultry, dairy, and livestock farmers in Ethiopia. Scientifically balanced ingredients for better growth, higher egg production, and healthy animals.",
    heroBtnProducts: "Explore Products",
    heroBtnTrack: "Track My Order",
    statTonnage: "Monthly Capacity",
    statFarms: "Active Commercial Farms",
    statQuality: "Quality Standard Rate",
    
    // Feed Categories & Product Labels
    categoryAll: "All Feeds",
    categoryLayer: "Layer Feed",
    categoryBroiler: "Broiler Feed",
    categoryDairy: "Dairy Feed",
    weight: "Weight",
    price: "Price",
    stock: "In Stock",
    stockAlert: "Low Stock Alert",
    bags: "bags",
    etb: "ETB",
    protein: "Crude Protein",
    calcium: "Calcium",
    fiber: "Fiber",
    energy: "Energy",
    fat: "Fat",
    moisture: "Moisture",
    targetAnimal: "Target Animal",
    feedingGuide: "Feeding Recommendation",
    benefits: "Key Benefits",
    
    // Order Form & Checkout
    orderModalTitle: "Place Feed Order",
    customerName: "Full Name",
    customerPhone: "Phone Number",
    customerEmail: "Email (Optional)",
    quantity: "Quantity (Bags)",
    deliveryMethod: "Fulfillment Method",
    deliveryHome: "Factory Delivery to Farm",
    deliveryPickup: "Self Pickup at Bole Factory",
    deliveryAddress: "Delivery Address (Sub-City / City / Region)",
    paymentMethod: "Payment Method",
    payCash: "Cash on Delivery / Pickup",
    payTelebirr: "Telebirr Transfer (QR Code)",
    payCbe: "CBE Bank Transfer",
    payWire: "Direct Bank Wire",
    txnRef: "Payment Transaction Ref Code (e.g. TXN982734)",
    txnRefHelp: "Enter your Telebirr or CBE transaction reference after sending payment",
    orderNotes: "Special Notes / Farm Location Instructions",
    submitOrder: "Confirm & Submit Order",
    orderSuccess: "Order Submitted Successfully!",
    orderRefCode: "Your Order Reference Code:",
    keepRefNotice: "Please save this code to track your delivery status.",
    
    // QR System
    scanPaymentQr: "Scan QR Code with Telebirr / CBE App",
    telebirrMerchantNo: "Telebirr Merchant / Phone:",
    cbeAccountNo: "CBE Account Number:",
    accountName: "Account Name: Bole Animal Feed Processing PLC",
    qrScanInstructions: "Open your Mobile Banking or Telebirr App, select QR Scan, and scan this code to complete payment.",
    orderQrVerification: "Order Verification QR Code",
    scanToVerifyInvoice: "Scan this QR code to view and verify official order status online.",
    
    // Invoice
    printInvoice: "Print Invoice",
    invoiceTitle: "OFFICIAL SALES INVOICE & DISPATCH RECEIPT",
    companyTin: "TIN No: 0078912345 | VAT Reg: 98765432",
    billTo: "Bill To (Customer Details):",
    invoiceNo: "Invoice / Ref No:",
    date: "Date:",
    item: "Item / Feed Description",
    unitPrice: "Unit Price",
    totalAmount: "Total Amount",
    subtotal: "Subtotal",
    deliveryFee: "Delivery / Shipping Fee",
    grandTotal: "Grand Total",
    paymentStatus: "Payment Status:",
    authorizedSignature: "Authorized Stamp & Signature",
    
    // Tracking & SMS
    trackTitle: "Track Your Feed Order",
    trackSubtitle: "Enter your 8-character Order Reference (e.g., BOLE-0001) to check live production and delivery status.",
    enterRef: "Order Reference Code",
    searchBtn: "Search Order",
    statusTimeline: "Order Progress & Dispatch Timeline",
    smsLogTitle: "SMS Dispatch Alerts Sent to Phone",
    statusPending: "Pending Confirmation",
    statusProcessing: "Processing Batch",
    statusConfirmed: "Confirmed & Prepared",
    statusDelivered: "Delivered to Customer",
    statusCanceled: "Canceled",
    paid: "PAID",
    unpaid: "UNPAID",
    partial: "PARTIAL PAYMENT",
    
    // Contact
    contactTitle: "Get in Touch with Our Factory",
    contactSubtitle: "Have questions about bulk orders, custom feed mixing, or dealership opportunities? Contact our team today.",
    sendMessage: "Send Message",
    
    // Footer
    footerRights: "Bole Animal Feed Processing PLC. All rights reserved.",
    shelfLifeGuarantee: "6-Month Guaranteed Freshness & Quality",
  },
  am: {
    // Nav & General
    companyName: "ቦሌ እንስሳት መኖ",
    companySubtitle: "ማቀናበሪያ ኃ/የተ/የግ/ማህበር",
    navHome: "መነሻ",
    navProducts: "ምርቶች",
    navAbout: "ስለ እኛ",
    navContact: "ያግኙን",
    navTrack: "ትዕዛዝ ይከታተሉ",
    navOrderNow: "አሁኑኑ ይዘዙ",
    navStaffLogin: "የሰራተኛ መግቢያ",
    phoneHeader: "+251 939 277 772",
    locationHeader: "ቦሌ ሚካኤል፣ አዲስ አበባ",
    hoursHeader: "ሰኞ–ቅዳሜ: 2:00–12:00",
    
    // Home Hero
    heroTitle: "ሳይንሳዊ በሆነ መንገድ የተቀናጀ ጥራት ያለው የእንስሳት መኖ",
    heroSubtitle: "ለዶሮ፣ ላምና እንስሳት እርባታ ከፍተኛ ምርትና ጤንነት የሚያስገኝ ጥራት ያለው መኖ። በአዲሱ ሳይንሳዊ ቀመር የተዘጋጀ።",
    heroBtnProducts: "ምርቶችን ይመልከቱ",
    heroBtnTrack: "ትዕዛዝዎን ይከታተሉ",
    statTonnage: "ወርሃዊ የምርት አቅም",
    statFarms: "ተጠቃሚ የንግድ እርሻዎች",
    statQuality: "የጥራት ደረጃ መጠን",
    
    // Feed Categories & Product Labels
    categoryAll: "ሁሉም መኖዎች",
    categoryLayer: "የእንቁላል ዶሮ መኖ",
    categoryBroiler: "የስጋ ዶሮ መኖ",
    categoryDairy: "የወተት ላም መኖ",
    weight: "ክብደት",
    price: "ዋጋ",
    stock: "በክምችት ያለው",
    stockAlert: "የክምችት ማሳሰቢያ",
    bags: "ከረጢት",
    etb: "ብር",
    protein: "ክሩድ ፕሮቲን",
    calcium: "ካልሲየም",
    fiber: "ፋይበር",
    energy: "ኃይል (ካሎሪ)",
    fat: "ስብ",
    moisture: "እርጥበት",
    targetAnimal: "የሚሰጠው እንስሳ",
    feedingGuide: "የአመጋገብ መመሪያ",
    benefits: "ዋና ጥቅሞች",
    
    // Order Form & Checkout
    orderModalTitle: "የመኖ ትዕዛዝ ማዘዣ",
    customerName: "ሙሉ ስም",
    customerPhone: "ስልክ ቁጥር",
    customerEmail: "ኢሜይል (አማራጭ)",
    quantity: "መጠን (ከረጢት)",
    deliveryMethod: "የርክክብ መንገድ",
    deliveryHome: "ፋብሪካው ወደ እርሻ ቦታ እንዲያደርስ",
    deliveryPickup: "ከቦሌ ፋብሪካ በራስ መውሰድ",
    deliveryAddress: "የማድረሻ አድራሻ (ክፍለ ከተማ / ከተማ)",
    paymentMethod: "የክፍያ መንገድ",
    payCash: "በእጅ ክፍያ / ሲረከቡ",
    payTelebirr: "በቴሌብር (QR ኮድ)",
    payCbe: "በኢትዮጵያ ንግድ ባንክ (CBE)",
    payWire: "ቀጥታ የባንክ ማስተላለፍ",
    txnRef: "የክፍያ ማረጋገጫ ቁጥር (Txn Ref)",
    txnRefHelp: "ክፍያውን ከፈጸሙ በኋላ የተላከውን የክፍያ ቁጥር ያስገቡ",
    orderNotes: "ተጨማሪ ማብራሪያ / የእርሻ ቦታ መመሪያ",
    submitOrder: "ትዕዛዝ አረጋግጥና ላክ",
    orderSuccess: "ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!",
    orderRefCode: "የትዕዛዝዎ መለያ ቁጥር:",
    keepRefNotice: "እባክዎን ይህንን ቁጥር ትዕዛዝዎን ለመከታተል ያስቀምጡት።",
    
    // QR System
    scanPaymentQr: "በቴሌብር ወይም በባንክ መተግበሪያ QR ኮዱን ይቃኙ",
    telebirrMerchantNo: "የቴሌብር ነጋዴ ቁጥር / ስልክ:",
    cbeAccountNo: "የኢትዮጵያ ንግድ ባንክ ሂሳብ ቁጥር:",
    accountName: "የሂሳብ ስም: ቦሌ እንስሳት መኖ ማቀናበሪያ ኃ/የተ/የግ/ማ",
    qrScanInstructions: "የቴሌብር ወይም የባንክ መተግበሪያዎን በመክፈት QR ኮዱን በመቃኘት ክፍያዎን በቅጽበት ይፈጽሙ።",
    orderQrVerification: "የትዕዛዝ ማረጋገጫ QR ኮድ",
    scanToVerifyInvoice: "የትዕዛዝዎን ትክክለኛነትና ሁኔታ በስልክ ለመመልከት ይህንን QR ኮድ ይቃኙ።",
    
    // Invoice
    printInvoice: "ደረሰኝ አትም",
    invoiceTitle: "ህጋዊ የሽያጭ ደረሰኝ እና የእቃ መረከቢያ",
    companyTin: "የግብር ከፋይ መለያ (TIN): 0078912345",
    billTo: "የደንበኛ መረጃ:",
    invoiceNo: "የደረሰኝ ቁጥር:",
    date: "ቀን:",
    item: "የመኖ አይነትና ማብራሪያ",
    unitPrice: "የአንዱ ዋጋ",
    totalAmount: "ጠቅላላ ዋጋ",
    subtotal: "ድምር",
    deliveryFee: "የማጓጓዣ ክፍያ",
    grandTotal: "አጠቃላይ ድምር",
    paymentStatus: "የክፍያ ሁኔታ:",
    authorizedSignature: "የተፈቀደለት ፊርማ እና ማህተም",
    
    // Tracking & SMS
    trackTitle: "የመኖ ትዕዛዝዎን ይከታተሉ",
    trackSubtitle: "የትዕዛዝ መለያ ቁጥርዎን (ምሳሌ: BOLE-0001) በማስገባት የምርትና የስርጭት ሁኔታን ይከታተሉ።",
    enterRef: "የትዕዛዝ መለያ ቁጥር",
    searchBtn: "ፈልግ",
    statusTimeline: "የትዕዛዝ ሂደትና ማድረሻ ደረጃ",
    smsLogTitle: "ወደ ስልክዎ የተላኩ የSMS ማሳወቂያዎች",
    statusPending: "በምልከታ ላይ",
    statusProcessing: "በማዘጋጀት ላይ",
    statusConfirmed: "ተረጋግጦ ተዘጋጅቷል",
    statusDelivered: "ለደንበኛው ደርሷል",
    statusCanceled: "ተሰርዟል",
    paid: "ተከፍሏል",
    unpaid: "ልተከፈለበትም",
    partial: "ከፊል ክፍያ",
    
    // Contact
    contactTitle: "የፋብሪካችንን ቡድን ያግኙ",
    contactSubtitle: "ስለ የጅምላ ትዕዛዞች ወይም የምርት መረጃ ጥያቄ ካለዎት ያግኙን።",
    sendMessage: "መልእክት ላክ",
    
    // Footer
    footerRights: "ቦሌ እንስሳት መኖ ማቀናበሪያ ኃ/የተ/የግ/ማህበር። መብቱ በህግ የተጠበቀ ነው።",
    shelfLifeGuarantee: "የ 6 ወር የጥራት እና የዕድሜ ዋስትና",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('bole_lang') || 'en');

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'am' : 'en';
    setLang(nextLang);
    localStorage.setItem('bole_lang', nextLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
