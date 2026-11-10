# Mesafeler Uçar Gider — Devir Notu

*Son güncelleme: 10 Kasım 2026 · Güncel sürüm: v15*

Bu not, projeye yeni bir konuşmada (ya da başka bir geliştiriciyle) kaldığı yerden devam edebilmek için yazıldı. Yeni konuşmaya bu dosyayı ver ve depoyu açmasını iste.

## 1. Proje nedir

- **Oyun:** "Mesafeler Uçar Gider" (eski adı "Pofuduk Kuşlar: Mesafe Aşkı"). Bird (Adana, kahverengi kuş) ile Birdie'nin (İstanbul, mavi saçlı beyaz kuş) uzak mesafe aşkını anlatan cozy mobil birleştirme (merge) oyunu. Türkçe / İngilizce.
- **Sahibi:** Barış Mıhçı (GitHub: BMihci). Hedef ticari.
- **Teknik:** tek dosya HTML5 (`index.html`), bağımlılık yok, PWA (service worker + manifest). Statik site olarak yayınlanır.
- **Depo:** https://github.com/BMihci/mesafeler-ucar-gider
- **Demo:** https://bmihci.github.io/mesafeler-ucar-gider/ (GitHub Pages, `gh-pages` dalından)

## 2. Depo yapısı

| Yol | İçerik |
| --- | --- |
| `index.html` | Derlenmiş oyun (elle düzenlenmez, `build.sh` üretir) |
| `sw.js` | Service worker. Önbellek adı `mug-vNN` — **her sürümde artırılmalı** |
| `manifest.webmanifest`, `icon-*.png`, `netlify.toml` | PWA ve yayın dosyaları |
| `src/` | Kaynak parçalar (aşağıda) |
| `build.sh` | `src/` parçalarını birleştirir, JS sözdizimini `node --check` ile denetler; `SYNTAX_OK` yazmalı |
| `tools/` | Playwright test/denetim betikleri (içlerindeki dosya yolları eski geliştirme ortamına göre; yeni ortamda yolları düzeltmek gerekir) |
| `docs/` | README ekran görüntüleri, pazar araştırması ve tavsiyeler |
| `README.md` | GitHub tanıtım sayfası |
| `README.txt` | Sürüm notları |

**Dallar:** `main` = güncel. `gh-pages` = demo (main'in kopyası, **kendiliğinden güncellenmez**). Eski sürümler: `surum/v2`, `v3`, `v8`, `v9`, `v10`, `v14`. v4–v7 ve v11–v13'ün ayrı kaynağı yok.

### Kaynak parçalar (birleştirme sırası)

1. `p1_head.html` — tüm CSS. Sonundaki `</style>` öncesine derleme sırasında `gh.css` eklenir.
2. `gh.css` — v14 el boyaması tema; tüm kurallar `body.gh` önekiyle eski "Şeker" görünümünü ezer.
3. `p2_body.html` — HTML gövde: üst butonlar, modallar, ayarlar satırları.
4. `p3_core.js` — sabitler, eşya grupları, denge (`BAL`), state ve kayıt, `ecoOn()`, müzik.
5. `p4_art.js` — `INK`, `GS()` suluboya renk süzgeci, `birdSVG`, `catSVG`, `emoIcon`, `wrapIco`.
6. `p4b_items.js` — `ITEM_ART`: 7 eşya ailesi × 6 kademe = 42 SVG çizim.
7. `p4c_ui.js` — `UI_ICO` arayüz ikonları, `buildSprite()`, emoji→SVG dönüştürücü `emoScan()`.
8. `p5a_game.js` — tahta, birleştirme, siparişler, yuvalar, modal sistemi.
9. `p5c_saga.js` — 80 seviye, bölgeler (`REGION`, `SCENES`), `applyTheme`, Türkiye haritası (`mapSVG`).
10. `p5d_economy.js` — dükkân, yuva/tahta görünümleri.
11. `p5b_systems.js` — defter, hediye kodu, ayarlar, `applyArt`, `applyEco`, `init`, `__PK` dışa aktarımı.
12. `p6_tail.html` — kapanış, service worker kaydı.

## 3. Bilinmesi gereken iç yapı

- Tüm oyun JS'i tek bir IIFE içinde. Test için dışa açılan nesne: `__PK` (`__PK.state`, `itemIcon`, `genLevel`, `levelComplete` vb.).
- Kayıt `localStorage`'da; `fix()` eski kayıtları onarır. 3 kayıt yuvası var.
- **Modallar:** `showModal(id)` / `closeModal(id)`. Panel modalları (`mBook`, `mShop`, `mSettings`, `mGift`) açıkken başka modal üstüne açılır. Testte `.open` sınıfını elle silme; gerçek tıklama kullan.
- **Hediye kodu:** `PK-XXXXX-XXXXX` (base36 + sağlama). Ayrı 🎁 butonu ve `mGift` modalı.
- **Görünüm temaları:** `ARTS` (p3_core.js) — `gh`, `candy`, `sakura`, `kraft`, `night`. Seçim `state.cos.art`, sahip olunanlar `state.cos.arts`. `applyArt()` `body.gh` + `body.art-*` sınıflarını, `data-art` özniteliğini ve ikon sprite'ını yeniler. `GS()` renkleri `ART_FX` ayarlarına göre dönüştürür. Tema CSS'i `gh.css` sonunda.
- **Mağaza paketleri:** `PACKS` (p5d_economy.js), `openBuy()` → `mBuy` penceresi. Şimdilik test satın alma; gerçek ödeme bağlanınca `#buyOk` işleyicisi ödeme sonucuna bağlanmalı. Durum: `state.iap`.
- **Reklamlar:** `ADS` (p5d_economy.js). Google Publisher Tag ile Google'ın test birimleri. `openAd(kind)` ödüllü reklamı ister, gelmezse `openTestAd()` yerleşik test reklamını açar; ödül `grantAd()`. Banner: `syncBanner()`, `:root.hasAd` ve `--adH`. Yayında `ADS.banner` / `ADS.rewarded` kendi birimlerinle değiştirilmeli.
- **Pil tasarrufu:** `ecoOn()`; dokunmatik cihazda varsayılan açık. `body.eco` CSS'i efektleri kapatır.
- **Harita:** 9 duraklı yol; ilerleme `#mpDone` çizgisi ve `.mp-city.on` ile gösterilir.

## 4. Sürüm geçmişi (özet)

- **v9–v10:** saga, kalıcı tahta, 3 eşzamanlı sipariş, albüm, yuva dekorasyonu.
- **v11:** tester geri bildirimleri — sipariş sayısına dayalı seviyeler, zorluk eğrisi, gerçek Türkiye haritası, pil tasarrufu, mobil tek ekran düzeni.
- **v12:** modal üst üste açılma hatası, ayrı hediye butonu, kısa hediye kodu.
- **v13:** harita ilerleme düzeltmesi, tüm emojiler yerine SVG çizimler, denetim botu.
- **v15:** Mağaza (paketler — test satın alma), 5 görünüm teması, Google test reklamları (GPT: ödüllü + alt banner), test modu kaldırıldı, ayarlar hizası, tahta teması yazı hatası.
- **v14:** Ghibli'den esinli el boyaması tema (CSS katmanı + renk süzgeci), yaprak/taç yaprağı arka plan, yumuşak animasyonlar, "Çizim stili" ayarı.

## 5. Açık işler ve bilinen sorunlar

1. **Çizimler sıfırdan yeniden çizilmedi.** Temalar renk süzgeci ve arayüz katmanıyla çalışıyor; kuş, kedi, eşya çizimlerinin formu her temada aynı.
2. **Gerçek Google reklamı bu ortamdan denenemedi.** Reklam akışı sahte (mock) GPT ile doğrulandı (`tools/adcheck.js`); gerçek test reklamının geldiği canlı sitede tarayıcıdan kontrol edilmeli.
3. **Kısa ekranlarda kaydırma.** 700 pikselden kısa görünümde (telefon tarayıcısında adres çubuğu açıkken sık görülür) oyun tek ekrana sığmıyor; banner bunu 54 piksel artırıyor.
4. **Satın almalar test modunda.** Gerçek ödeme yok; paket fiyatları yer tutucu.
5. **Kullanıcı onayı (çerez/izin) penceresi yok.** Gerçek reklamla yayına çıkmadan önce gerekli.
6. **Gerçek telefonda ısınma ve akıcılık ölçülmedi.**
7. Geliştirme tavsiyeleri: `docs/PAZAR-ARASTIRMASI.md`.

## 6. Yeni sürüm çıkarma adımları

1. `src/` içinde değişiklik yap.
2. `bash build.sh` → `SYNTAX_OK` görmelisin.
3. 390×844 ekranda ekran görüntüsüyle kontrol et (Playwright; giriş, oyun, defter, harita, dükkân).
4. `sw.js` içinde `mug-vNN` numarasını artır, `README.txt`'ye sürüm notu ekle.
5. `main`'e commit + push.
6. Demoyu güncelle: `git push origin main:gh-pages`.
7. İstenirse sürüm dalı aç: `git push origin main:refs/heads/surum/vNN`.

## 7. Çalışma tercihleri

- Yanıtlar Türkçe.
- Her teslimde kısa özet ve dürüst uyarılar: ne test edildi, ne edilmedi.
- Oyun mantığı bozulmamalı; görsel değişiklikten sonra botla kısa bir oyun koşusu yapılmalı.
- Oyunda emoji kullanılmaz, her şey temaya uygun SVG çizim.
- Zorluk yüksek olmamalı; seviyeler "hamle yetmiyor" değil "yer yetmiyor" üzerinden zorlaşmalı.
