// ===== minigame/DifficultyManager.js =====
// Zorluk, ÜRÜN FİYATINA değil, o ana kadarki TOPLAM SİPARİŞ SAYISINA göre kademeli artar.
// Saf fonksiyon: aynı sipariş numarası her zaman aynı zorluk konfigürasyonunu üretir.

export function getDifficultyConfig(orderNumber) {
  // orderNumber: 1, 2, 3, ... (bu, kaçıncı sipariş olduğu)
  const n = Math.max(1, orderNumber);

  // Yol uzunluğu (piksel) - her siparişte kademeli uzar, bir tavana yaklaşır.
  const roadLength = Math.min(2600 + (n - 1) * 480, 7500);

  // Engel yoğunluğu: yaklaşık her X pikselde bir engel grubu.
  const obstacleGap = Math.max(230 - (n - 1) * 9, 95);

  // Engel hızı çarpanı (aracın göreli hızı).
  const speedMultiplier = Math.min(1 + (n - 1) * 0.08, 2.3);

  // Aynı anda birden fazla şeridi kaplayan "kombo" engel olasılığı.
  const comboObstacleChance = Math.min(0.05 + (n - 1) * 0.035, 0.55);

  // Coin yoğunluğu: coin de biraz artar ama engel kadar hızlı değil (denge için).
  const coinGap = Math.max(150 - (n - 1) * 4, 90);

  // Coin değer aralığı - ileri siparişlerde biraz daha değerli coinler.
  const coinValueMin = 2 + Math.floor((n - 1) / 3);
  const coinValueMax = 5 + Math.floor((n - 1) / 2);

  // Zorluk etiketi (kullanıcıya gösterilecek).
  let label = 'Kolay Teslimat';
  if (n >= 8) label = 'Efsanevi Teslimat';
  else if (n >= 5) label = 'Zorlu Teslimat';
  else if (n >= 3) label = 'Orta Teslimat';

  return {
    orderNumber: n,
    roadLength,
    obstacleGap,
    speedMultiplier,
    comboObstacleChance,
    coinGap,
    coinValueMin,
    coinValueMax,
    label,
    baseSpeed: 220 * speedMultiplier, // px/saniye
  };
}
