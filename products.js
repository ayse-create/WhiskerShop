// ===== data/products.js =====

export const CATEGORIES = [
  { id: 'all', label: 'Tümü', emoji: '🐾' },
  { id: 'mama', label: 'Mama & Ödül', emoji: '🍗' },
  { id: 'oyuncak', label: 'Oyuncaklar', emoji: '🧶' },
  { id: 'kum-kap', label: 'Kum & Kap', emoji: '🥣' },
  { id: 'aksesuar', label: 'Aksesuar', emoji: '🎀' },
  { id: 'ev', label: 'Kedi Evleri', emoji: '🏠' },
];

export const CATEGORY_EMOJI = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c.emoji;
  return acc;
}, {});

export const PRODUCTS = [
  // ===== MAMA & ÖDÜL (15-35 🐾) =====
  { id: 1, name: 'Somonlu Tahılsız Kuru Mama 1.5kg', price: 28, category: 'mama', image: '1.png', rating: 4.8, badge: 'Çok Satan' },
  { id: 2, name: 'Tavuklu Ödül Kraker Kutusu', price: 16, category: 'mama', image: '2.png', rating: 4.6 },
  { id: 3, name: 'Yaban Mersinli Kedi Otu Şurubu', price: 22, category: 'mama', image: '3.png', rating: 4.3 },
  { id: 4, name: 'Islak Mama Çeşni Seti (12li)', price: 32, category: 'mama', image: '4.png', rating: 4.9, badge: 'Yeni' },
  { id: 5, name: 'Tavuklu Yetişkin Kuru Mama 3kg', price: 35, category: 'mama', image: '5.png', rating: 4.7 },
  { id: 6, name: 'Ton Balıklı Islak Mama 6lı Paket', price: 20, category: 'mama', image: '6.png', rating: 4.5 },
  { id: 7, name: 'Kedi Naneli Diş Krakeri', price: 15, category: 'mama', image: '7.png', rating: 4.2 },
  { id: 8, name: 'Somonlu Ödül Kreması', price: 18, category: 'mama', image: '8.png', rating: 4.4 },
  { id: 9, name: 'Tavuklu Kedi Sütü Tozu', price: 25, category: 'mama', image: '9.png', rating: 4.1 },
  { id: 10, name: 'Dana Etli Kuru Mama 1kg', price: 30, category: 'mama', image: '10.png', rating: 4.6 },

  // ===== OYUNCAK (20-50 🐾) =====
  { id: 11, name: 'Tüylü Fare Oyuncak (3lü Paket)', price: 22, category: 'oyuncak', image: '11.png', rating: 4.5 },
  { id: 12, name: 'Lazer İşaretçili Oltalı Oyuncak', price: 35, category: 'oyuncak', image: '12.png', rating: 4.7 },
  { id: 13, name: 'Dönen Top Etkileşimli Oyuncak', price: 28, category: 'oyuncak', image: '13.png', rating: 4.4 },
  { id: 14, name: 'Catnip Dolgulu Mini Yastık', price: 20, category: 'oyuncak', image: '14.png', rating: 4.2 },
  { id: 15, name: 'Otomatik Lazer Topu', price: 45, category: 'oyuncak', image: '15.png', rating: 4.8, badge: 'Popüler' },
  { id: 16, name: 'Tünel Tırmalama Seti', price: 50, category: 'oyuncak', image: '16.png', rating: 4.6 },
  { id: 17, name: 'Zıplayan Balık Oyuncak', price: 25, category: 'oyuncak', image: '17.png', rating: 4.3 },
  { id: 18, name: 'Catnip Dolu Scratch Pad', price: 30, category: 'oyuncak', image: '18.png', rating: 4.5 },
  { id: 19, name: 'Kedi Maması Bulmaca Oyuncak', price: 38, category: 'oyuncak', image: '19.png', rating: 4.7 },
  { id: 20, name: 'Tüylü Kuş Oyuncak (2li)', price: 24, category: 'oyuncak', image: '20.png', rating: 4.3 },

  // ===== KUM & KAP (30-80 🐾) =====
  { id: 21, name: 'Kendinden Temizlenen Kum Kabı', price: 70, category: 'kum-kap', image: '21.png', rating: 4.6, badge: 'Popüler' },
  { id: 22, name: 'Topaklaşan Bentonit Kedi Kumu 10L', price: 30, category: 'kum-kap', image: '22.png', rating: 4.5 },
  { id: 23, name: 'Paslanmaz Çift Gözlü Mama Kabı', price: 35, category: 'kum-kap', image: '23.png', rating: 4.3 },
  { id: 24, name: 'Otomatik Su Çeşmesi 2L', price: 55, category: 'kum-kap', image: '24.png', rating: 4.8 },
  { id: 25, name: 'Kapalı Kedi Kum Kabı Deluxe', price: 80, category: 'kum-kap', image: '25.png', rating: 4.7 },
  { id: 26, name: 'Mama Kabı Seti (2+2)', price: 40, category: 'kum-kap', image: '26.png', rating: 4.4 },
  { id: 27, name: 'Kum Fırçası ve Kepçe Seti', price: 32, category: 'kum-kap', image: '27.png', rating: 4.2 },
  { id: 28, name: 'Seyahat Su Kabı', price: 28, category: 'kum-kap', image: '28.png', rating: 4.1 },

  // ===== AKSESUAR (25-70 🐾) =====
  { id: 29, name: 'Örgü Desenli Ayarlanabilir Tasma', price: 28, category: 'aksesuar', image: '29.png', rating: 4.1 },
  { id: 30, name: 'Kadife Kedi Yatağı - Bal Rengi', price: 45, category: 'aksesuar', image: '30.png', rating: 4.7 },
  { id: 31, name: 'Taşıma Çantası Deluxe', price: 65, category: 'aksesuar', image: '31.png', rating: 4.6 },
  { id: 32, name: 'Kedi Tırmalama Tahtası', price: 30, category: 'aksesuar', image: '32.png', rating: 4.4 },
  { id: 33, name: 'Isıtmalı Kedi Yatağı', price: 55, category: 'aksesuar', image: '33.png', rating: 4.8, badge: 'Kış Fırsatı' },
  { id: 34, name: 'Kedi Koşum Takımı', price: 38, category: 'aksesuar', image: '34.png', rating: 4.3 },
  { id: 35, name: 'Fırça ve Tarak Seti', price: 25, category: 'aksesuar', image: '35.png', rating: 4.2 },
  { id: 36, name: 'Kedi Yaka Fiyonk', price: 27, category: 'aksesuar', image: '36.png', rating: 4.0 },

  // ===== KEDİ EVLERİ (80-200 🐾) =====
  { id: 37, name: '3 Katlı Tırmalama Kulesi', price: 95, category: 'ev', image: '37.png', rating: 4.9, badge: 'Amiral Gemisi' },
  { id: 38, name: 'Küçük Kedi Evi - Yumuşak', price: 80, category: 'ev', image: '38.png', rating: 4.5 },
  { id: 39, name: 'Büyük Tırmalama Ağacı', price: 150, category: 'ev', image: '39.png', rating: 4.8, badge: 'Çok Satan' },
  { id: 40, name: 'Lüks Kedi Evi (Isıtmalı)', price: 200, category: 'ev', image: '40.png', rating: 4.9, badge: 'Premium' }
];
export function filterProducts({ category, query }) {
  return PRODUCTS.filter((p) => {
    const matchesCategory = !category || category === 'all' || p.category === category;
    const matchesQuery = !query || p.name.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));
    return matchesCategory && matchesQuery;
  });
}
