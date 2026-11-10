# Mesafeler Uçar Gider — Devir Notu

*Son güncelleme: 10 Kasım 2026 · Güncel sürüm: v14*

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
| `docs/` | README ekran görüntüleri |
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
- **Çizim stili:** `state.settings.art` = `'gh'` (varsayılan) ya da `'candy'`. `applyArt()` `body.gh` sınıfını ve ikon sprite'ını yeniler. `GS()` yalnızca `body.gh` varken renkleri dönüştürür.
- **Pil tasarrufu:** `ecoOn()`; dokunmatik cihazda varsayılan açık. `body.eco` CSS'i efektleri kapatır.
- **Harita:** 9 duraklı yol; ilerleme `#mpDone` çizgisi ve `.mp-city.on` ile gösterilir.

## 4. Sürüm geçmişi (özet)

- **v9–v10:** saga, kalıcı tahta, 3 eşzamanlı sipariş, albüm, yuva dekorasyonu.
- **v11:** tester geri bildirimleri — sipariş sayısına dayalı seviyeler, zorluk eğrisi, gerçek Türkiye haritası, pil tasarrufu, mobil tek ekran düzeni.
- **v12:** modal üst üste açılma hatası, ayrı hediye butonu, kısa hediye kodu.
- **v13:** harita ilerleme düzeltmesi, tüm emojiler yerine SVG çizimler, denetim botu.
- **v14:** Ghibli'den esinli el boyaması tema (CSS katmanı + renk süzgeci), yaprak/taç yaprağı arka plan, yumuşak animasyonlar, "Çizim stili" ayarı.

## 5. Açık işler ve bilinen sorunlar

1. **Çizimler sıfırdan yeniden çizilmedi.** v14'te kuş, kedi, yuva ve eşya çizimlerinin formu aynı kaldı; yalnızca renk ve arayüz değişti. Gerçek bir yeniden çizim ayrı bir iş.
2. **28–41. seviyeler elle oynanmadı.** Denetim botu kedi kapılı bu bölümü geçemiyor (bot stratejisi sınırı). Arkasında gerçek bir denge sorunu olabilir.
3. **Gerçek telefonda ısınma ve akıcılık ölçülmedi.**
4. **v14'te Dükkân, Ayarlar ve diğer modallar ekran görüntüsüyle kontrol edilmedi.**
5. **`tools/audit.js` harita kontrolü** eski pembe rengi (`#FF3FA0`) arıyor; v14'te yanlış uyarı veriyor ("level dots done 0"). Kontrol renge değil sınıfa bakacak şekilde düzeltilmeli.
6. **README.md** eski sürümler için hâlâ doğru (dallar), ama GitHub "About" kutusuna açıklama ve demo adresi elle eklenmeli.
7. Demo bağlantısının açıldığı geliştirme ortamından doğrulanamadı; tarayıcıdan kontrol edilmeli.

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
