# Analisis Komprehensif Polymarket API: Endpoints, Data, Autentikasi, Rate Limits, Real-time Feeds, Data Historis, dan Resolusi Pasar

## Ringkasan Eksekutif

Polymarket menyediakan ekosistem API yang terbagi atas tiga lapisan utama: (i) Gamma Markets API (REST) untuk eksplorasi event dan pasar serta metadata publik, (ii) CLOB (Central Limit Order Book) API (REST + WebSocket) untuk data pasar,uy seperti book, price, midprice, dan timeseries harga, serta operasi trading, dan (iii) Data-API (REST) untuk perdagangan, posisi, dan holders yang легко diakses tanpa otentikasi L2. Selain itu, terdapat RTDS (Real Time Data Stream) untuk aliran data non-trading seperti komentar dan harga kripto tertentu.

 gamma efektif untuk discovery event/pasar dan metadata; CLOB memberikan data pasar mendalam dan kanal real-time untuk pengguna dan pasar; Data-API menyederhanakan akses publik ke aktivitas trading dan holdings; RTDS menambah konteks real-time di luar order book. Ketiga lapisan ini saling melengkapi: Gamma mengatur struktur event/market, CLOB menyajikan permukaan likuiditas dan harga, Data-API menyediakan audit trail aktivitas on-chain, sedangkan RTDS menyokong use-case monitoring dan komunikasi.

 intinya, pada 2025-11-17, firma integrasi dapat: (1) menjelajah pasar/event melalui Gamma; (2) memantau livro, spread, dan harga via CLOB market channel; (3) men顾 transaksi, posisi, dan holders melalui Data-API; (4) mendapatkan harga historis per aset/token melalui CLOB timeseries; dan (5) mengikuti alur resolusi pasar yang memanfaatkan UMA Optimistic Oracle (OO). Batasan utama yang perlu diperhatikan adalah kebijakan rate limits per kategori endpoint, kebutuhan otentikasi berlapis untuk akses privat (L1/L2), serta beberapa informasi yang belum terdokumentasi penuh (misalnya skema pesan RTDS). Strategi integrasi yang efektif membutuhkan kombinasi caching agresif, pagination, subscription terarah, dan penanganan backoff berbasis throttling Cloudflare, dengan pemantauan changelog untuk perubahan yang dapat memicu breaking changes (contoh: update skema price_change pada 2025-09-15) [^1][^8][^11].

## Arsitektur & Lapisan API Polymarket

Polymarket memisahkan concern melalui empat layanan:

- Gamma Markets API (REST, read-only) untuk event/market discovery, kategorisasi, dan metadata pasar.
- CLOB API (REST + WebSocket/WSS) untuk permukaan pasar (book, price, midprice), timeseries historis, dan operasi trading, dengan kanal user dan market.
- Data-API (REST) untuk trades, positions, dan holders—umumnya dapat diakses publik tanpa header L2.
- RTDS (WebSocket) untuk aliran data real-time non-orderbook seperti komentar dan feed harga kripto tertentu.

 sebagai “peta” domain: Gamma mengekspresikan pertanyaan dan struktur pasar; CLOB memodelkan dinamika harga dan likuiditas; Data-API menyediakan window ke aktivitas on-chain; RTDS menghadirkan supplement event-driven yang lebih luas. Kanal user WSS bersifat privat dan terautentikasi; kanal market WSS bersifat publik. [^2][^11][^8][^20][^21]

### Perbandingan Layanan API Polymarket

Untuk mengilustrasikan perbedaan fokus dan cara kerja, tabel berikut merangkum karakteristik inti setiap layanan.

| Layanan | Tipe | Fungsi Inti | Otentikasi | Target use-case |
|---|---|---|---|---|
| Gamma Markets API | REST (read-only) | Event/market discovery, metadata, tags, search | Tidak ada untuk publik | Riset pasar, kurasi event,FE/BE metadata |
| CLOB API | REST + WSS | Book, price, midprice; trading; timeseries | L1/L2 untuk privat; publik untuk beberapa GET | Market-making, analytics,order mgmt |
| Data-API | REST | Trades, positions, holders | Tanpa L2; publik | Analitik transaksi,portofolio publik |
| RTDS | WSS | Stream non-orderbook (komentar, harga kripto) | Tergantung channel | Monitoring,notifikasi,FE real-time |

 tabel ini menegaskan bahwa arsitektur Polymarket memisahkan antara discovery, pasar, aktivitas on-chain, dan aliran konteks real-time. Pilih layanan sesuai kebutuhan: Gamma untuk struktur pasar, CLOB untuk likuiditas dan eksekusi, Data-API untuk transaksi/holdings, RTDS untuk pembaruan sekunder. [^2][^11][^20][^21]

## Autentikasi & Otorisasi

Sistem otentikasi CLOB menggunakan dua tingkat: L1 dan L2. L1 menandatangani pesan dengan kunci pribadi (EIP-712) untuk kontrol non-kustodian dan operasional kunci API; L2 menandatangani permintaan API dengan HMAC menggunakan key, secret, dan passphrase untuk akses privat ke endpoint trading dan ledger. Otentikasi WSS dibutuhkan untuk user channel (berbasis apikey), sedangkan market channel publik tidak wymaga L2. Implementasi signing tersedia di pustaka resmi Python dan TypeScript. [^4][^7][^10]

 untuk melihat kebutuhan secara operasional, tabel berikut merangkum header dan tujuannya.

### Header Autentikasi L1 vs L2

| Lapisan | Header | Wajib | Deskripsi |
|---|---|---|---|
| L1 (Private Key) | POLY_ADDRESS | Ya | Alamat Polygon pengguna |
| L1 | POLY_SIGNATURE | Ya | Tanda tangan EIP-712 untuk pesan |
| L1 | POLY_TIMESTAMP | Ya | Stempel waktu Unix saat permintaan |
| L1 | POLY_NONCE | Ya | Nonce (default 0) |
| L2 (API Key) | POLY_ADDRESS | Ya | Alamat Polygon pengguna |
| L2 | POLY_SIGNATURE | Ya | Signature HMAC untuk permintaan |
| L2 | POLY_TIMESTAMP | Ya | Stempel waktu Unix saat permintaan |
| L2 | POLY_API_KEY | Ya | Kunci API Polymarket |
| L2 | POLY_PASSPHRASE | Ya | Passphrase kunci API |

 prinsip kontrol non-kustodian tetap terjaga: kunci pribadi tidak pernah lepas dari kendali pengguna; operasi pembuatan/pencabutan kunci API disegel oleh tanda tangan L1; L2 murni untuk otentikasi permintaan, bukan kontrol dana. Implementasi EIP-712 tersedia di Py dan TS untuk meminimalkan kesalahan integrasi. [^4][^10]

#### Alur Pembuatan & Manajemen Kunci API

Kunci API (L2) diturunkan secara deterministik dari tanda tangan L1. Endpoint berikut menuntun lifecycle kredensial:

- Buat kunci API: POST /auth/api-key
- Dapatkan kembali kunci API: GET /auth/derive-api-key
- Daftar kunci API: GET /auth/api-keys
- Hapus kunci API: DELETE /auth/api-key
- Status akses: GET /auth/access-status
- Mode closed-only: GET /auth/ban-status/closed-only

| Endpoint | Metode | Kebutuhan Header | Deskripsi |
|---|---|---|---|
| /auth/api-key | POST | L1 | Membuat kredensial L2 baru |
| /auth/derive-api-key | GET | L1 | Menurunkan kembali L2 untuk alamat+nonce |
| /auth/api-keys | GET | L2 | Memetakan semua kunci terkait alamat |
| /auth/api-key | DELETE | L2 | Menghapus kunci aktif |
| /auth/access-status | GET | L1/L2 (lihat docs) | Memeriksa cert_required |
| /auth/ban-status/closed-only | GET | L2 | Memeriksa status mode hanya tertutup |

 dengan memiliki endpoint manajemen kunci, integrasi dapat mengotomasi rotasi kredensial, auditing akses, dan penegakan kebijakan keamanan aplikasi. [^4]

## Endpoints Inti: Event/Market Discovery (Gamma)

Gamma adalah layanan REST read-only untuk publik. Ia menyediakan entitas health, sports, tags, events, markets, series, comments, dan search. Secara operasional, Gamma efektif untuk enumerasi event/pasar, navigasi kategori, dan pelengkapan metadata (judul, slug, ikon). Praktik umum: gunakan tags/events untuk discovery awal; kemudian gunakan markets untuk detail operasional; search untuk filtrasi cepat. Untuk membatasi beban, patuhi rate limit per endpoint Gamma. [^2][^3]

 sebagai referensi, tabel berikut merangkum endpoint yang lazim digunakan.

### Ringkasan Endpoint Gamma

| Path | Fungsi | Status |
|---|---|---|
| /health | Health check | Read-only |
| /sports | Daftar cabang olahraga | Read-only |
| /tags | Daftar tag/kategori | Read-only |
| /events | Daftar event | Read-only |
| /markets | Daftar pasar | Read-only |
| /series | Seri pasar | Read-only |
| /comments | Komentar | Read-only |
| /search | Pencarian | Read-only |

 gunakan filter dan query di sisi klien secara konservatif untuk meminimalkan panggilan berfrekuensi tinggi; cache metadata untuk mempercepat UI. [^2]

## Endpoints Data Trading: Trades, Positions, Holders (Data-API)

Data-API menyediakan akses publik ke perdagangan, posisi pengguna, dan holders pasar. Tidak diperlukan header L2.trade endpoint mengurutkan berdasarkan timestamp menurun; positions menyediakan metrik PnL dan status redeemable/mergeable; holders memaparkan Pemegang top token pasar dengan opsi filter saldo minimum. [^13][^15][^14]

### GET /trades: Parameter dan Deskripsi

| Parameter | Tipe | Default | Rentang | Catatan |
|---|---|---|---|---|
| limit | integer | 100 | 0–10000 | Max item yang dikembalikan |
| offset | integer | 0 | 0–10000 | Melewati item |
| takerOnly | boolean | true | — | Hanya trade taker |
| filterType | enum | — | CASH/TOKENS | Wajib bersama filterAmount |
| filterAmount | number | — | x ≥ 0 | Wajib bersama filterType |
| market | string[] | — | conditionId (0x..) | Saling exclusief dengan eventId |
| eventId | integer[] | — | — | Saling exclusief dengan market |
| user | string | — | alamat 0x.. | Alamat profil pengguna |
| side | enum | — | BUY/SELL | Sisi perdagangan |

 trade body memuat proxyWallet, side, asset, conditionId, size, price, timestamp, judul/slug pasar, eventSlug, outcome/outcomeIndex, name/pseudonym/bio, profil image, dan transactionHash—cocok untuk audit trail dan joins metadata. [^13]

### GET /positions: Parameter, Sort, dan Field

| Parameter | Tipe | Default | Catatan |
|---|---|---|---|
| user | string | — | Wajib (alamat 0x..) |
| market | string[] | — | Saling eksklusif dengan eventId |
| eventId | integer[] | — | Saling eksklusif dengan market |
| sizeThreshold | number | 1 | x ≥ 0 |
| redeemable | boolean | false | Filter dapat redeem |
| mergeable | boolean | false | Filter dapat merge |
| limit | number | 100 | 0–500 |
| offset | number | 0 | 0–10000 |
| sortBy | enum | TOKENS | CURRENT, INITIAL, TOKENS, CASHPNL, PERCENTPNL, TITLE, RESOLVING, PRICE, AVGPRICE |
| sortDirection | enum | DESC | ASC/DESC |
| title | string | — | Max length 100 |

 posisi mengembalikan proxyWallet, asset, conditionId, size, avgPrice, initialValue, currentValue, cashPnl, percentPnl, totalBought, realizedPnl, percentRealizedPnl, curPrice, redeemable, mergeable, title, slug, icon, eventSlug, outcome/outcomeIndex, oppositeOutcome/asset, endDate, negativeRisk—sangat berguna untuk pelaporan portofolio dan pemantauan risiko. [^15]

### GET /holders: Parameter dan Struktur

| Parameter | Tipe | Default | Rentang | Keterangan |
|---|---|---|---|---|
| limit | integer | 100 | 0–500 | Max holders |
| market | string[] | — | — | Daftar conditionId (0x..) |
| minBalance | integer | 1 | 0–999999 | Saldo minimum |

 holders возвращает token dan daftar holders berisi proxyWallet, bio, asset, pseudonym, amount, displayUsernamePublic, outcomeIndex, name, profile image (regular & optimized). Data ini cocok untuk analisis konsentrasi kepemilikan dan comportamento holder. [^14]

## Endpoints Harga & Order Book (CLOB)

Permukaan pasar CLOB menyediakan endpoints book, books, price, prices, midprice, serta price-history untuk timeseries. Beberapa endpoint memiliki rate limit khusus. Operasi trading tersedia melalui POST/DELETE single order dan batch, cancel, serta akses ledger trades/orders. [^1][^18][^5]

### Pemetaan Endpoint → Fungsi

| Kategori | Endpoint | Fungsi |
|---|---|---|
| Book | /book, /books | Level 2 book per aset/daftar |
| Price | /price, /prices | Harga terbaik/daftar |
| Midprice | /midprice, /midprices | Harga tengah |
| Timeseries | /prices-history | Riwayat harga token |
| Trading | POST/DELETE /order, /orders | Place/cancel single/batch |
| Ledger | /trades, /orders, /notifications | Aktivitas privat pengguna |
| Market | /markets, /markets/0x | Listing/daftar pasar |

參考 endpoint listing di atas membantu architects membangun pipeline data terpadu: book/price untuk snapshot, prices-history untuk analisis longitudinal, dan ledger untuk kontrol eksekusi. Rate limits per endpoint perlu dipantau untuk desain caching. [^1][^18][^5]

### GET /prices-history: Parameter dan Respons

| Parameter | Tipe | Keterangan |
|---|---|---|
| market | string | ID token CLOB (wajib) |
| startTs | number | Mulai (UTC, Unix; eksklusif dengan interval) |
| endTs | number | Berakhir (UTC, Unix; eksklusif dengan interval) |
| interval | enum | 1m, 6h, 1h, 1d, 1w, max (eksklusif dengan start/end) |
| fidelity | number | Resolusi menit |

 respons: history berisi array objek { t: timestamp, p: price }. Endpoint ini ideal untuk reconstruksi OHLCV di sisi klien (dengan agregasi) dan deteksi tren harga per outcome token. [^5][^18]

## Real-Time: WebSocket (WSS) Market & User Channels

CLOB WSS menyediakan dua channel: market (publik) untuk Level 2 updates dan user (terautentikasi) untuk orders/trades. Market channel memancarkan event book, price_change, tick_size_change, dan last_trade_price; user channel memancarkan pesan order (PLACEMENT, UPDATE, CANCELLATION) dan trade (MATCHED, MINED, CONFIRMED, RETRYING, FAILED). Ada rencana update skema price_change pada 2025-09-15 23:00 UTC. [^8][^11][^9][^7]

### Perbandingan WSS Channels

| Aspek | Market Channel | User Channel |
|---|---|---|
| Akses | Publik | Terautentikasi (apikey) |
| Fokus Data | L2 book, price_change, tick size, last trade | Orders & trades pengguna |
| Subscription Param | assets_ids (token IDs) | markets (condition IDs) |
| Use-case | Market-making/analytics | Order/trade monitoring pengguna |

 contoh pesan market: book menyertakan bids/asks, hash, timestamp; price_change berisi price_updates per aset dengan side, best_bid/ask; tick_size_change memotret transisi minimum tick; last_trade_price memaparkan price/size/side/fee_rate_bps. Di user channel, pesan trade menyertakan maker_orders, status, price/size/side; pesan order menyertakan original_size, size_matched, dan type (PLACEMENT/UPDATE/CANCELLATION). [^9][^10]

#### Market Channel: Event & Struktur Pesan

| Event | Field Utama | Deskripsi |
|---|---|---|
| book | asset_id, market, timestamp, hash, buys, sells | Snapshot book saat subscribe/trade |
| price_change | market, price_changes[], timestamp | Update order baru/cancel; skema diperbarui 2025-09-15 |
| tick_size_change | asset_id, market, old_tick_size, new_tick_size | Minimum tick berubah saat harga ekstrem |
| last_trade_price | asset_id, market, price, size, side, fee_rate_bps, timestamp | Trade terjadi (maker+taker match) |

 implementasi harus siap menerima perubahan skema price_change, menjaga backward compatibility atau normalisasi payload di sisi klien. [^9]

#### User Channel: Order & Trade Messages

| Jenis | Field Utama | Deskripsi |
|---|---|---|
| trade | asset_id, id, maker_orders[], market, outcome, price, size, side, status, taker_order_id, timestamp | Matched, mined, confirmed, retrying, failed |
| order | asset_id, id, market, order_owner, original_size, outcome, price, side, size_matched, timestamp, type | Placement, update, cancellation |

 user channel efektif untuk pelacakan eksekusi dan kesehatan order secara real-time, menyediakan transparency status transisi. [^10]

## Real-Time Tambahan: RTDS (Real Time Data Stream)

RTDS menyediakan layanan streaming berbasis WebSocket untuk data non-orderbook, seperti komentar dan feed harga kripto. Channel RTDS Crypto Prices dan Comments menambah konteks real-time di sekitar pasar—misalnya, untuk widget FE atau notifikasi komunitas. Dokumentasi singkat ini menunjuk ke overview channel tanpa spesifikasi skema payload lengkap; integrasi perlu sampling dan normalisasi langsung dari stream. [^20][^21]

### Ikhtisar Channel RTDS

| Channel | Fungsi | Akses |
|---|---|---|
| RTDS Overview | Pengantar RTDS | — |
| RTDS Crypto Prices | Feed harga kripto real-time | Publik/tergantung channel |
| RTDS Comments | Stream komentar pasar | Publik/tergantung channel |

 gunakan RTDS untuk melengkapi UI/alerting, namun hindari pengambilan keputusan trading murni dari RTDS unless di Cross-check dengan CLOB book/price. [^20][^21]

## Rate Limits & Kuota

Polymarket menerapkan rate limit berbasis Cloudflare dengan throttle (bukan reject) saat exceed. Beberapa endpoint memiliki burst allowances di atas rate berkelanjutan; jendela berulang menggunakan sliding window (misalnya per 10 detik). Disarankan implementasi backoff, caching, pagination, dan subscription terarah.

 berikut ringkasan limit utama per kategori. [^12]

### Tabel Rate Limits per Kategori/Endpoint

| Kategori | Endpoint/Grup | Limit | Catatan |
|---|---|---|---|
| Data-API | General | 200 req/10s | Throttle bila exceed |
| Data-API | Alternative | 1200 req/1m | 10 menit block jika violate |
| Data-API | /trades | 75 req/10s | Throttle |
| Data-API | “OK” Endpoint | 10 req/10s | Throttle |
| Gamma | General | 750 req/10s | Throttle |
| Gamma | Get Comments | 100 req/10s | Throttle |
| Gamma | /events | 100 req/10s | Throttle |
| Gamma | /markets | 125 req/10s | Throttle |
| Gamma | Listing /events /markets | 100 req/10s | Throttle |
| Gamma | Tags | 100 req/10s | Throttle |
| Gamma | Search | 300 req/10s | Throttle |
| CLOB | General | 5000 req/10s | Throttle |
| CLOB | Balance Allowance (GET) | 125 req/10s | Throttle |
| CLOB | Balance Allowance (UPDATE) | 20 req/10s | Throttle |
| CLOB | /book | 200 req/10s | Throttle |
| CLOB | /books | 80 req/10s | Throttle |
| CLOB | /price | 200 req/10s | Throttle |
| CLOB | /prices | 80 req/10s | Throttle |
| CLOB | /midprice | 200 req/10s | Throttle |
| CLOB | /midprices | 80 req/10s | Throttle |
| CLOB | Ledger (/trades,/orders,/notifications,/order) | 300 req/10s | Throttle |
| CLOB | Ledger /data/orders | 150 req/10s | Throttle |
| CLOB | Ledger /data/trades | 150 req/10s | Throttle |
| CLOB | /notifications | 125 req/10s | Throttle |
| CLOB | Price History | 100 req/10s | Throttle |
| CLOB | Markets | 250 req/10s | Throttle |
| CLOB | Market Tick Size | 50 req/10s | Throttle |
| CLOB | markets/0x | 50 req/10s | Throttle |
| CLOB | /markets listing | 100 req/10s | Throttle |
| CLOB Auth | API Keys | 50 req/10s | Throttle |
| Trading | POST /order | 2400 req/10s (240/s) burst; 24000 req/10m (40/s) | Throttle |
| Trading | DELETE /order | 2400 req/10s burst; 24000 req/10m | Throttle |
| Trading | POST /orders | 800 req/10s burst; 12000 req/10m | Throttle |
| Trading | DELETE /orders | 800 req/10s burst; 12000 req/10m | Throttle |
| Trading | DELETE /cancel-all | 200 req/10s burst; 3000 req/10m | Throttle |
| Trading | DELETE /cancel-market-orders | 800 req/10s burst; 12000 req/10m | Throttle |
| Other | RELAYER /submit | 15 req/1m | Throttle |
| Other | User PnL API | 100 req/10s | Throttle |

 desain klien harus : (i) Queue dan pacing untuk POST/DELETE trading dengan kontrol burst vs sustain; (ii) Cachebook/price/midprice per aset dengan invalidasi berbasis event; (iii) Pagination untuk Data-API; (iv) Subskrip WSS berdasar set aset/condition yang relevan; dan (v) Exponential backoff plus jitter. [^12]

## Resolusi Pasar: Mekanisme UMA dan Alur Proposal

Polymarket mengandalkan UMA Optimistic Oracle untuk resolusi pasar. Proses dimulai dengan proposal hasil yang disertai bond sebesar 750 USDC.e; jika proposal terlalu dini/tidak tepat, bond hangus. Ada masa tantangan 2 jam; bila proposal disetujui, bond dikembalikan加上 hadiah. Setelahfinalisasi, holder saham pemenang menerima $1 per saham; saham kalah tidak berharga; perdagangan berhenti. [^16][^17]

### Langkah-Langkah Resolusi

| Langkah | Deskripsi | Parameter |
|---|---|---|
| Proposal | Usulan hasil pasar | Bond 750 USDC.e |
| Challenge Period | Periode sengketa | Durasi 2 jam |
| Finalization | Hasil disahkan | Trading berhenti; outcome final |
| Settlement | Pemenang ditebus | $1 per saham pemenang |

 bagi builder, memahami alur ini penting untuk Antarmuka pengguna (konfirmasi status pasar) dan risk management (exposure terhadap outcome). [^16][^17]

## Data Historis: Timeseries & Referensi API

CLOB prices-history menyediakan deret waktu harga per token pasar. Parameter market diperlukan; time window dapat ditetapkan via startTs/endTs atau interval (1m/6h/1h/1d/1w/max); fidelity mengatur resolusi menit. Respons berformat { history: [{ t, p }] }. Referensi API terkait menyediakan entry point yang konsisten untuk integrasi. [^5][^18]

### Parameter & Respons Prices-History

| Elemen | Keterangan |
|---|---|
| market | ID token CLOB (wajib) |
| startTs/endTs | UTC Unix; exclusive dengan interval |
| interval | 1m/6h/1h/1d/1w/max; exclusive dengan start/end |
| fidelity | Resolusi dalam menit |
| history[] | { t: timestamp, p: price } |

 untuk analitik lanjutan, gunakan agregasi sisi klien untuk membangun OHLCV, volatilitas, dan indikator teknis; sinkronkan dengan event last_trade_price dan price_change untuk validasi silang. [^5][^18]

## Struktur Data: Field Kunci Across Endpoints

menghindari joins berat di runtime, penting untuk memahami field inti di setiap layanan:

- Condition ID (conditionId): pengenal pasar di CLOB/Data-API (string 64-hex 0x-prefixed). Ada di trades, positions, dan holder responses.
- Asset/Token ID (asset_id/token id): pengenal outcome token; diperlukan untuk subscription market channel dan calls /book, /price, prices-history.
- Outcome index (outcomeIndex): index hasil (YES/NO atau multi-outcome), menyederhanakan pemetaan ke state UI.

 contoh: pada trades Data-API, conditionId dan outcomeIndex menyatu dengan title/slug/eventSlug, memudahkan joins ke Gamma metadata. Pada WSS market channel, asset_id dan market (conditionId) hadir bersama di setiap event, memungkinkan normalisasi stream. [^13][^9]

### Mapping Field Kunci

| Domain | Field | Fungsi |
|---|---|---|
| Market ID | conditionId | Mengidentifikasi pasar |
| Asset ID | asset_id/token id | Mengidentifikasi outcome token |
| Outcome | outcomeIndex | Memetakan hasil (YES/NO/multi) |
| Event Link | eventSlug | Join ke metadata Gamma |
| Trade | price, size, side | Core pricing & liquidity data |
| Order | price, size_matched, type | Eksekusi & lifecycle |
| User | proxyWallet | Identitas dompet profil |
| Meta | title, slug, icon | Tampilan UI dan disambiguasi |

 mapping ini memandu skema database/streams internal untuk efisiensi query dan konsistensi UI. [^13][^9][^15]

## Panduan Implementasi & Praktik Terbaik

untuk integrasi produksi, ambil pendekatan berlapis:

- Akses publik:Gamma dan Data-API untuk discovery dan aktivitas; CLOB untuk snapshot market (book/price/midprice) dan timeseries.
- Akses privat: WSS user channel untuk orders/trades; endpoints trading CLOB dengan L2; gunakan py-clob-client/ts untuk signing dan manajemen kunci.
- Rate-limit handling: cache, pagination, batching, dan exponential backoff; subscribe aset/condition ID yang relevan; hindari poling Homebrew di Data-API.
- Real-time: gunakan market channel untuk L2 dan event harga; gunakan user channel untuk eksekusi; RTDS untuk komentar/harga kripto.
- Keamanan: kelola passphrase/secret dengan aman; rotasi kunci API; hindari pengiriman secret di kanal publik; audit akses via /auth/api-keys.
- Monitoring: changelog untuk breaking changes; validasi skema WSS/RTDS; log latensi dan error throttling Cloudflare.

 repertorio endpoint inti untuk bootstrap: Gamma events/markets; Data-API trades/positions/holders; CLOB book/price/midprice; prices-history; WSS market/user; RTDS sesuai kebutuhan. [^19][^12]

## Risiko, Keterbatasan, dan Roadmap

risiko utama berpusat pada (i) ketidakpastian rate limits dan throttling Cloudflare, (ii) potensi breaking changes real-time (contoh: update skema price_change), dan (iii) keterbatasan dokumentasi RTDS (payload skema) untuk beberapa channel. Keterbatasan non-publikasi beberapa detail endpoint trading (parameter penuh) dan referensi time-range historical untuk Data-API menambah ketidakpastian desain.

 mitigasi: caching agresif, normalisasi payload, subscription terarah, backoff & circuit breaker, feature flags untuk transisi skema, dan monitoring aktif terhadap changelog. следите за Обновлениями pada tanggal yang anúncio resmi. [^12][^9]

## Lampiran

### Daftar Endpoint & Autentikasi

| Layanan | Endpoint | Metode | Autentikasi | Catatan |
|---|---|---|---|---|
| CLOB | /book, /books, /price, /prices, /midprice, /midprices | GET | Publik/Privat (beberapa GET publik) | Market data |
| CLOB | /prices-history | GET | Publik | Timeseries harga |
| CLOB | /order, /orders, /cancel, /cancel-all, /cancel-market-orders | POST/DELETE | L2 | Trading |
| CLOB | /trades, /orders, /notifications, /data/orders, /data/trades | GET | L2 | Ledger privat |
| CLOB WSS | user, market | WSS | User: apikey; Market: publik | Orders/trades vs L2 |
| Gamma | /events, /markets, /tags, /search | GET | Publik | Read-only |
| Data-API | /trades, /positions, /holders | GET | Publik | Trade/positions/holders |
| Auth | /auth/api-key, /auth/derive-api-key, /auth/api-keys, /auth/api-key, /auth/access-status, /auth/ban-status/closed-only | POST/GET/DELETE | L1/L2 | Manajemen kunci |

### Changelog & Perubahan

- Update skema pesan price_change pada 2025-09-15 23:00 UTC (Market Channel). Pastikan konsumen siap terhadap perubahan. [^9]

## Catatan Keterbatasan Informasi

- Dokumentasi lengkap parameter dan contoh respons untuk beberapa endpoint trading CLOB (place order, cancel, batch) tidak termasuk dalam konteks yang tersedia.
- Dokumentasi RTDS (overview, crypto prices, comments) hanya menyediakan ikhtisar tingkat tinggi; skema payload tidak lengkap.
- Endpoints historical Data-API (rentang waktu granular, agregasi) tidak secara eksplisit dirinci.
- Ketersediaan kategori pasar (Crypto vs Political) hanya dapat disimpulkan melalui entitas Gamma dan tidak secara eksplisit dirinci.
- Detail lengkap skema pesan WebSocket user channel (event-type “order” dan “trade”) dan semua varian field mungkin belum lengkap.
- Rincian final integrasi Chainlink oracle untuk kelas pasar tertentu tidak tercakup dalam sumber yang tersedia.

 referensi implementasi signing dan klien tersedia di pustaka resmi Python dan TypeScript untuk memperkecil risiko integrasi L1/L2. [^10][^19]

## Referensi

[^1]: Endpoints - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/endpoints  
[^2]: Overview - Gamma Markets API - Polymarket Documentation. https://docs.polymarket.com/developers/gamma-markets-api/overview  
[^3]: Gamma Structure - Polymarket Documentation. https://docs.polymarket.com/developers/gamma-markets-api/gamma-structure  
[^4]: Authentication - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/authentication  
[^5]: Historical Timeseries Data - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/timeseries  
[^6]: Get price history for a traded token - API Reference. https://docs.polymarket.com/api-reference/pricing/get-price-history-for-a-traded-token  
[^7]: WSS Authentication - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/websocket/wss-auth  
[^8]: WSS Overview - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/websocket/wss-overview  
[^9]: Market Channel - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/websocket/market-channel  
[^10]: User Channel - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/websocket/user-channel  
[^11]: RTDS Overview - Polymarket Documentation. https://docs.polymarket.com/developers/RTDS/RTDS-overview  
[^12]: API Rate Limits - Polymarket Documentation. https://docs.polymarket.com/quickstart/introduction/rate-limits  
[^13]: Get Trades (Data-API) - Polymarket Documentation. https://docs.polymarket.com/developers/CLOB/trades/trades-data-api  
[^14]: Get Market Holders (Data-API) - Polymarket Documentation. https://docs.polymarket.com/developers/misc-endpoints/data-api-holders  
[^15]: Get User Positions (Data-API) - Polymarket Documentation. https://docs.polymarket.com/developers/misc-endpoints/data-api-get-positions  
[^16]: Resolution - UMA - Polymarket Documentation. https://docs.polymarket.com/developers/resolution/UMA  
[^17]: How Are Markets Resolved? - Polymarket Learn. https://docs.polymarket.com/polymarket-learn/markets/how-are-markets-resolved  
[^18]: Get price history for a traded token - Polymarket Documentation (duplicate endpoint reference). https://docs.polymarket.com/api-reference/pricing/get-price-history-for-a-traded-token  
[^19]: Polymarket/py-clob-client - GitHub. https://github.com/Polymarket/py-clob-client  
[^20]: Real Time Data Socket (RTDS) Overview - Polymarket Documentation. https://docs.polymarket.com/developers/RTDS/RTDS-overview  
[^21]: RTDS Crypto Prices - Polymarket Documentation. https://docs.polymarket.com/developers/RTDS/RTDS-crypto-prices  
[^22]: RTDS Comments - Polymarket Documentation. https://docs.polymarket.com/developers/RTDS/RTDS-comments