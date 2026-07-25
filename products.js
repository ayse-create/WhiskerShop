// ===== data/products.js =====
// Görseller repo köküne siz tarafından eklenecek: 1.png, 2.png, ... 16.png
// image alanı bilerek relative path ("1.png") - GitHub Pages'te sorunsuz çalışır.
// Dosya henüz yoksa ProductCard otomatik olarak kategoriye ait emoji placeholder gösterir.

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
  { id: 1, name: 'Somonlu Tahılsız Kuru Mama 1.5kg', price: 18, category: 'mama', image: '1.png', rating: 4.8, badge: 'Çok Satan' },
  { id: 2, name: 'Tavuklu Ödül Kraker Kutusu', price: 9, category: 'mama', image: '2.png', rating: 4.6 },
  { id: 3, name: 'Yaban Mersinli Kedi Otu Şurubu', price: 12, category: 'mama', image: '3.png', rating: 4.3 },
  { id: 4, name: 'Islak Mama Çeşni Seti (12li)', price: 22, category: 'mama', image: '4.png', rating: 4.9, badge: 'Yeni' },
  { id: 5, name: 'Tüylü Fare Oyuncak (3lü Paket)', price: 14, category: 'oyuncak', image: '5.png', rating: 4.5 },
  { id: 6, name: 'Lazer İşaretçili Oltalı Oyuncak', price: 27, category: 'oyuncak', image: '6.png', rating: 4.7 },
  { id: 7, name: 'Dönen Top Etkileşimli Oyuncak', price: 19, category: 'oyuncak', image: '7.png', rating: 4.4 },
  { id: 8, name: 'Catnip Dolgulu Mini Yastık', price: 8, category: 'oyuncak', image: '8.png', rating: 4.2 },
  { id: 9, name: 'Kendinden Temizlenen Kum Kabı', price: 45, category: 'kum-kap', image: '9.png', rating: 4.6, badge: 'Popüler' },
  { id: 10, name: 'Topaklaşan Bentonit Kedi Kumu 10L', price: 16, category: 'kum-kap', image: '10.png', rating: 4.5 },
  { id: 11, name: 'Paslanmaz Çift Gözlü Mama Kabı', price: 11, category: 'kum-kap', image: '11.png', rating: 4.3 },
  { id: 12, name: 'Otomatik Su Çeşmesi 2L', price: 33, category: 'kum-kap', image: '12.png', rating: 4.8 },
  { id: 13, name: 'Örgü Desenli Ayarlanabilir Tasma', price: 13, category: 'aksesuar', image: '13.png', rating: 4.1 },
  { id: 14, name: 'Kadife Kedi Yatağı - Bal Rengi', price: 29, category: 'aksesuar', image: '14.png', rating: 4.7 },
  { id: 15, name: 'Taşıma Çantası Deluxe', price: 38, category: 'aksesuar', image: '15.png', rating: 4.6 },
  { id: 16, name: '3 Katlı Tırmalama Kulesi', price: 52, category: 'ev', image: '16.png', rating: 4.9, badge: 'Amiral Gemisi' },
];

export function filterProducts({ category, query }) {
  return PRODUCTS.filter((p) => {
    const matchesCategory = !category || category === 'all' || p.category === category;
    const matchesQuery = !query || p.name.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));
    return matchesCategory && matchesQuery;
  });
}
