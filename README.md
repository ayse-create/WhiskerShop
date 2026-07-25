# WhiskerMarket 🐾

Kedi temalı, kurgusal alışveriş sitesi + kargo kaçış mini oyunu. Build adımı yok — dosyaları olduğu gibi GitHub Pages'e koyman yeterli.

## Görselleri ekleme
`js/data/products.js` içinde 16 ürün tanımlı, her biri `image: "1.png"`, `"2.png"` ... `"16.png"` şeklinde **repo köküyle aynı seviyeden** relative path bekliyor. Yani:

```
whiskermarket/
├── index.html
├── 1.png   ← siz ekleyeceksiniz
├── 2.png
├── ...
├── 16.png
├── css/
└── js/
```

Hangi numaranın hangi ürün olduğunu `js/data/products.js` dosyasındaki `name` alanlarından görebilirsiniz. Görsel eksikse otomatik olarak kategoriye uygun bir emoji placeholder gösterilir, site kırılmaz.

## Yayınlama (GitHub Pages)
1. Bu klasörün içeriğini reponuzun köküne (ya da `docs/` klasörüne) push edin.
2. Repo → Settings → Pages → Source kısmından ilgili branch/klasörü seçin.
3. PNG'leri eklemeden önce de site tamamen çalışır durumda (placeholder emojilerle).

## Oyun mekaniği özeti
- Başlangıç bakiyesi: 100 🐾 (localStorage'da kalıcı).
- Ürün satın al → bakiyeden fiyat düşer → kargo mini oyunu açılır.
- 3 şeritte engellerden kaç, kedi parası topla, eve ulaş → toplanan paralar bakiyeye eklenir.
- Zorluk, ürün fiyatından bağımsız olarak **kaçıncı sipariş olduğuna** göre artar (yol uzar, engel sıklaşır, hız artar).
- Sepete birden fazla ürün eklenip toplu satın alınabilir; her ürün için ayrı, sıralı bir mini oyun açılır.
