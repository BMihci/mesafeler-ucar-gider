# Merge oyunları pazarı ve Mesafeler Uçar Gider için tavsiyeler

*Kasım 2026 · kaynaklar en altta*

## 1. Pazar ne durumda

- **Merge-2 en hızlı büyüyen büyük casual tür.** 2026'nın ilk yarısında merge-2 oyunları yaklaşık 1,24 milyar dolar uygulama içi gelir üretti; bir yıl önce bu 636 milyon dolardı. İndirmeler ise yalnızca %20 kadar arttı. Yani büyüme yeni oyuncudan değil, oyuncu başına harcamadan geliyor.
- **Lider açık ara Gossip Harbor** (Microfun). Mart 2026'da tek ayda 100 milyon doları geçti; Şubat 2026'da Candy Crush Saga'yı aylık gelirde geride bıraktı.
- **İkinci sıra Tasty Travels** (Century Games): ilk yarıda 127 milyon dolar, bir yılda yaklaşık 13 kat büyüme.
- **Türü yaratan Merge Mansion liderliği kaybetti;** yapımcısı Metacore'u 2026'da Supercell satın aldı.
- **Yeni girenler için kapı dar ama açık:** ilk yarıda aylık 100 bin dolara ulaşan 7 yeni oyunun 5'i iki büyük yayıncıdan (Century Games, Moon Active). Küçük ekip için gerçekçi hedef "tür lideri" değil, belirli bir kitleyi iyi tutan niş bir oyun.
- **Merge oyuncu başına daha çok kazandırıyor, match-3 toplamda.** Match-3 "takıldığın seviyeden çıkış" satar; merge "devam edebilmeyi" satar. Merge'de doğal bir bitiş noktası olmadığı için harcama fırsatı tükenmez.

## 2. Başarılı oyunların ortak mekanikleri

| Mekanik | Nasıl çalışıyor | Bizde durum |
| --- | --- | --- |
| Kalıcı tahta + sipariş | Yarım kalan işler oturumlar arasında durur; oyuncu "bitirmez, ara verir" | Var |
| Enerji = hem para hem fren | Enerji bitince oyun durur; bu bir "kayıp" değil "kesinti" gibi hissettirir, o yüzden ödeme isteği yüksek | Var |
| Güçlendirilmiş üretici (2x/4x) | Oyuncu enerjiyi daha hızlı harcayıp daha yüksek kademe eşya alır; harcama tavanını kaldırır. 2023'ten beri türün standardı | **Yok** |
| Üretici bekleme süresi | Enerjiye ek ikinci bir fren; oyuncu hangi üreticiyi çalıştıracağını seçer, geri dönme sebebi olur | Kısmen (kedi sepeti) |
| Süreli etkinlikler | 72 saatlik sipariş etkinlikleri, günlük sıfırlanan sezon bileti; "etkinlik öncesi enerji biriktirme" gibi planlama yaratır | **Yok** (yalnızca haftalık meydan okuma) |
| Hikâye + dekorasyon | Diyalog sahneleri dekorasyon görevine bağlanır; hikâye ödülün kendisi olur | Kısmen (mektuplar, çizgi roman; dekorasyon yalnızca yuva) |
| Tahta sıkışıklığı | "Hamle yetmiyor" değil "yer yetmiyor"; tahta verimi düşünce oyuncu yer açmak için öder | Var (tasarım hedefimiz zaten bu) |
| Birleştirme sonrası teklif | Oyuncu devam etmek isterken çıkan küçük teklif balonları | **Yok** |

**Sayılar:** Hikâye odaklı merge örneği Love & Pies için bildirilen değerler yaklaşık %50 birinci gün ve %20 otuzuncu gün elde tutma (2022 verisi). Genel casual bulmaca için "iyi" sayılan aralık: 1. gün %27–32, 7. gün %8–14, 30. gün %3–6. Ortalama oturum 3–3,5 dakika; en iyi %10'da 8 dakikanın üstü.

## 3. Bizim oyunun güçlü ve zayıf yanları

**Güçlü**
- Tema özgün ve duygusal: uzak mesafe ilişkisi, türde az işlenmiş bir "ilişki" hikâyesi. Pazar raporları merge'in aynı tahtayı farklı hikâye çerçeveleriyle (yenileme, kurtarma, yemek, seyahat, **ilişki**) sarabildiğini özellikle vurguluyor.
- İki kişilik bağ: hediye kodu rakiplerde olmayan bir özellik.
- Gerçek coğrafya (İstanbul–Adana haritası) yerel pazarda ayırt edici.
- Tek dosya, kurulum yok: web portallarında yayınlamaya hazır.

**Zayıf**
- **Seviye yapısı türün ana akımıyla ters.** Rakipler seviyesiz, sürekli akan tek bir tahta kullanıyor; bizde 80 seviye, can ve "başarısız oldun" ekranı var. Bu, match-3 mantığı. Merge'in güçlü yanı tam da kaybetme durumunun olmaması.
- Uzun vadeli içerik sınırlı: 80 seviye bitince oynanacak bir şey kalmıyor.
- Etkinlik yok: oyuncunun yarın geri gelmesi için takvime bağlı bir sebep zayıf.
- Enerjiyi hızlı harcama yolu yok; harcama tavanı düşük.
- Ödeme altyapısı ve ölçüm yok: hangi seviyede bırakıldığını bilmiyoruz.

## 4. Tavsiyeler (öncelik sırasıyla)

### Önce — az iş, büyük etki
1. **Ölçüm ekle.** Kodda `ANALYTICS_URL` hazır ama boş. Seviye başlangıcı/bitişi, bırakma noktası, reklam izleme ve mağaza açılışı olaylarını topla. Bundan sonraki her karar buna dayanacak.
2. **"Başarısız" ekranını ve canları yumuşat ya da kaldır.** Enerji bitince seviye kaybedilmesin; oyuncu beklesin, reklam izlesin ya da enerji alsın. Türün ödeme mantığı bu: kesinti, kayıp değil.
3. **Güçlendirilmiş yuva (2x).** Yuvaya uzun basınca 2 enerji harcayıp bir üst kademe eşya çıksın. Hem oyunu hızlandırır hem enerji tüketimini artırır.
4. **Birleştirme sonrası küçük teklifler.** Enerji 5'in altına düşünce "reklam izle, +8 enerji" balonu; tahta dolunca "çekiç ister misin" balonu.
5. **Ödüllü reklam noktalarını artır.** Şu an üç yer var (altın, can, enerji). Eklenebilecekler: sipariş ödülünü ikiye katla, günlük hediyeyi ikiye katla, kedi sepetini hemen doldur.

### Sonra — orta iş
6. **Haftalık süreli etkinlik.** Örneğin "Sevgililer Postası": 72 saat, ayrı küçük bir eşya zinciri, kademeli ödüller. Altyapıda haftalık meydan okuma zaten var, genişletilebilir.
7. **Sezon bileti.** Günlük görevlerden puan, 30 kademeli ödül yolu, ücretsiz ve ücretli hat.
8. **Hikâyeyi dekorasyona bağla.** Her şehirde Bird ya da Birdie'nin odasına bir eşya ekle; mektup açılınca odada yeni bir köşe görünsün. Rakiplerde hikâyenin oyuncuyu tutan kısmı bu bağ.
9. **Partner özelliğini büyüt.** Hediye kodu iyi bir başlangıç. Devamı: günlük "seni düşünüyorum" kalbi, birlikte tamamlanan haftalık hedef. İncelediğim kaynaklarda öne çıkan oyunların hiçbiri iki kişilik bağ üzerine kurulu değil; en özgün kozumuz bu olabilir.

### Daha sonra — büyük iş
10. **80 seviye bittikten sonrası.** Sonsuz mod: seviyesiz, sürekli sipariş gelen tek tahta ve iki haftada bir sıfırlanan sıralama.
11. **Mağaza sürümü.** Oyunu bir sarmalayıcıyla (Capacitor/TWA) Android'e çıkar; gerçek uygulama içi satın alma ve AdMob oraya bağlanır. Şu anki test paketleri ve test reklamları bu geçiş için yer tutucu.
12. **Web portalları.** Poki ve CrazyGames gibi portallar HTML5 oyunları gelir paylaşımıyla yayınlıyor. Bildiğim kadarıyla kendi reklam SDK'larının kullanılmasını istiyorlar; başvuru koşullarını bu araştırmada ayrıca doğrulamadım. Mağaza sürümünden önce kitle bulmanın en ucuz yolu olabilir.

## 5. Dikkat edilecekler

- **Reklam ve küçük ekran.** Alt banner 54 piksel yer alıyor; kısa ekranlı telefonlarda (640–667 piksel yükseklik) oyun tek ekrana sığmıyor ve kaydırma gerekiyor. Banner'ı yalnızca yeterince uzun ekranlarda göstermek ya da kısa ekranlarda tahtayı küçültmek gerekebilir.
- **Bilişsel yük.** Rakip analizleri, ekonomiye katman ekledikçe karmaşıklığın arttığını ve yeni oyuncuyu kaçırabildiğini söylüyor. Yeni sistemleri ilk 10 seviyeden sonra aç.
- **Ödüllü reklam kuralları.** Google, ödül sunan reklam birimleri için ayrı kurallar ve reklam göstermeden önce kullanıcı onayı (özellikle AB'de çerez/izin penceresi) istiyor. Yayına çıkmadan önce bir onay yönetimi çözümü gerekecek.

## Kaynaklar

- [AppMagic: Mobile Casual Games in H1 2026](https://gamedevreports.substack.com/p/appmagic-mobile-casual-games-in-h1)
- [Deconstructor of Fun: Does Merge-2 Monetize Better Than Match-3?](https://www.deconstructoroffun.com/blog/does-merge-2-monetize-better-than-match-3)
- [Game Economist Consulting: The Economics of Merge-2 Games](https://www.gameeconomistconsulting.com/the-economics-of-merge-games/)
- [Naavik: Love & Pies — A Masterful Pivot to Merge-2](https://naavik.co/deep-dives/deep-dive-love-and-pies-merge2/)
- [CreativeScope: H1 2026 Casual Puzzle Games — Match-3 vs Merge-2](https://www.creativescope.ai/blog/h1-2026-casual-puzzle-games)
- [Innovecs Games: Mobile Game Retention Benchmarks 2026](https://www.innovecsgames.com/blog/mobile-game-retention-benchmarks/)
- [Google Publisher Tag: Display a rewarded ad](https://developers.google.com/publisher-tag/samples/display-rewarded-ad?hl=en)
