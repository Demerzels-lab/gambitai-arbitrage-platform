# Analisis Komprehensif Kalshi API: Endpoint, Data, Autentikasi, Rate Limits, Feed Real-time, dan Data Historis

## Ringkasan Eksekutif
Kalshi Exchange menyediakan antarmuka pemrograman aplikasi (API) untuk mengakses pasarprediksi berbasis kontrak biner yang diatur Commodity Futures Trading Commission (CFTC). API ini memungkinkan pengambilan data pasar (market data), data peristiwa (event data), struktur seri, feed harga real‑time, dan data historis dalam bentuk candlestick. Arsitektur API mengikuti pola berbasisресурс dan versi v2, dengan base URL resmi untuk lingkungan produksi berada pada subdomain elections, tetapi cakupan data mencakup semua kategori pasar Kalshi (termasuk ekonomi dan budaya), bukan hanya pemilihan umum[^1][^2].

Secara garis besar, endpoint inti yang relevan untuk use case quant/analis meliputi: Series (GET /series/{series_ticker}), Markets (GET /markets), Events (GET /events), Market detail (GET /markets/{market_ticker}), Orderbook (GET /markets/{market_ticker}/orderbook), dan Candlesticks (GET /series/{series_ticker}/markets/{ticker}/candlesticks).Feed real‑time tersedia melalui WebSocket (wss://api.elections.kalshi.com) dengan autentikasi RSA‑PSS dan langganan multi‑saluran seperti ticker, orderbook_delta, trades, dan fill (akun terautentikasi).SDK resmi (Python/TypeScript) mempercepat integrasi dengan penanganan autentikasi, retry/backoff, serta model ter‑type dengan idiomatik bahasa[^5][^7][^11][^12][^13][^15][^18].

Data yang terpapar melalui API ini dirancang untuk memetakan siklus hidup pasar: dari discovery (Series → Events → Markets), analisis harga (Markets fields, Orderbook, Candlesticks), hingga monitoring real‑time (WebSocket). Hasil akhir kontrak bersifat biner (Yes/No) dan settlement dipublikasikan melalui FIX 35=UMS. Di tingkat REST, settlement dapat diinferensikan dari field result, settlement_value, dan timestamps seperti close_time, settlement_timer_seconds; sedangkan detail posisi dan kolateral dijelaskan oleh FIX settlement report yang tersedia pada sesi KalshiPT/KalshiRT[^3][^4][^10][^29].

Ringkasan temuan kunci:
- Semua kategori pasar tersedia dari satu base API (elections subdomain), namun cakupan mencakup정치/경제/기후/기술/문화/회사.
- Data pasar memiliki struktur kaya (harga terakhir, bid/ask, volume, open interest, liquidity, status, rules, strike info, dan metadata MVE).
- Autentikasi diperlukan untuk WebSocket dan operasi trading/portofolio, signing menggunakan RSA‑PSS dengan header KALSHI-ACCESS-*.
- Batas kecepatan (rate limits) ditentukan per tier dan endpoint; detail kuantitatif per tier tidak lengkap pada dokumentasi publik—perlu konfirmasi langsung.
- WebSocket menyediakan feed real‑time dengan satu koneksi yang menangani subscribe/unsubscribe/list/update subscription dan pesan terstandardisasi.
- Data historis OHLCV tersedia untuk periode 1 menit, 1 jam, dan 1 hari, dengan skema period_interval=1/60/1440 dan timestamp Unix.
- Settlement dipublikasikan via FIX 35=UMS; di REST, settlement dapat ditelusuri dari field result dan metadata terkait.
- SDK Python/TypeScript menyederhanakan autentikasi, pemetaan model, dan pemanggilan API, serta menyediakan kelas API yang mengelompokkan fungsi (MarketsApi, EventsApi, SeriesApi, PortfolioApi, CommunicationsApi, dll.)[^18][^16].

Rekomendasi implementasi:
- Gunakan SDK resmi untuk menangani signing dan pagination secara konsisten.
- Pisahkan jalur data: REST untuk batch/historical (candlesticks), WebSocket untuk live ticker/orderbook/trades/fill.
- Terapkan pembatalan langganan (unsubscribe) dinamis dan backoff/retry sesuai rate limits.
- Validasi time zone (UTC) pada parameter timestamp dan buat fallback saat data gaps/holes pada orderbook.

---

## Ikhtisar Kalshi dan Arsitektur API
Kalshi adalah bursa pasar prediksi yang diatur CFTC, menawarkan kontrak biner yang diselesaikan pada outcome ya/tidak atas peristiwa politik, ekonomi, dan topik lainnya. Pada level API, Kalshi Trade API v2 menggunakan base URL ber‑subdomain elections, tetapi mencakup seluruh pasar Kalshi, bukan hanya elections. Dokumentasi publik membedakan akses data pasar tanpa autentikasi (REST) dan akses yang memerlukan autentikasi untuk WebSocket, trading, dan informasi akun/portofolio[^1][^2][^22].

Secara konseptual, hierarki data mengikuti alur: Series → Events → Markets. Series mengelompokkan Eventos ke dalam kategori tertentu; Events merepresentasikan peristiwa yang diperdagangkan (misalnya inflasi CPI pada bulan tertentu); Markets adalah kontrak biner spesifik di bawah event (misalnya “Apakah CPI akan ≥ X?”). Pemetaan ini memampukan strategi analisis yang jelas: discovery kategori dan event melalui Series/Events, kemudian drill‑down ke Markets untuk melihat harga, order book, dan data historis.

Kalshi menyediakan SDK resmi untuk Python dan TypeScript/JavaScript, yang mencakup semua fungsi API dengan idiomatik bahasa dan dukungan async di Python. SDK mempercepat integrasi melalui otomatisasi signing, penanganan timestamp, dan model data ter‑type[^11][^12][^13][^14].

---

## Autentikasi & Keamanan
Kalshi menggunakan autentikasi berbasis API key dengan penandatangan pesan RSA‑PSS. Untuk REST, header autentikasi yang digunakan adalah KALSHI-ACCESS-KEY, KALSHI-ACCESS-SIGNATURE, dan KALSHI-ACCESS-TIMESTAMP. Message yang ditandatangani adalah gabungan timestamp + metode + path (contoh: timestamp + “GET” + “/trade-api/v2/markets”).Mekanisme ini konsisten pada WebSocket handshake dan REST (untuk endpoint privat/terotentikasi)[^5][^6][^7][^11].

SDK resmi menyederhanakan proses ini: setelah mengonfigurasi Configuration dengan api_key_id dan private_key_pem, kelas klien (KalshiClient untuk Python) menangani signing permintaan secara otomatis. Contoh di Python menunjukkan inisialisasi klien dan panggilan sederhana seperti get_balance(). Praktik terbaik meliputi pengelolaan kunci privat (PEM) yang aman, sinkronisasi waktu (clock skew) untuk mencegah kesalahan timestamp, serta retry/backoff yang respeta rate limits[^11][^12][^13].

Untuk memperjelas perbedaan akses, tabel berikut merangkum kebutuhan autentikasi.

Table 1. Ringkasan kebutuhan autentikasi per kategori endpoint
| Kategori Endpoint | Contoh Endpoint | Autentikasi | Catatan |
|---|---|---|---|
| Market Data Publik | GET /series/{series_ticker}; GET /markets; GET /events; GET /markets/{ticker}; GET /markets/{ticker}/orderbook; GET /series/{series_ticker}/markets/{ticker}/candlesticks | Tidak | Dapat diakses publik; tidak memerlukan header signing[^1][^3][^4][^15] |
| Trading/Portfolio | PortfolioApi (create orders, batch create orders, portfolio) | Ya | Memerlukan API key + RSA‑PSS signing; rate limits per tier[^11][^19][^31] |
| Real‑time (WebSocket) | wss://api.elections.kalshi.com | Ya | Wajib autentikasi saat handshake; satu koneksi untuk semua komunikasi[^5][^7] |

---

## Rate Limits & Best Practices
Kalshi membagi akses pengguna ke dalam tier yang mengatur rate limits per endpoint. Berdasarkan dokumentasi publik, alokasi tipikal meliputi: Basic (20/10 read/write per detik), Advanced (30/30), Premier (100/100), Prime (400/400). Namun, detail kuantitatif per tier dan per endpoint tidak terpublikasi lengkap; beberapa halaman dokumentasi gagal diekstrak atau hanya menyediakan garis besar. Oleh karena itu, tim integrasi perlu memvalidasi kuota spesifik melalui akun mereka atau bantuan support[^28].

Praktik terbaik:
- Pagination: gunakan cursor yang dikembalikan oleh respons untuk menghindari overlap dan memastikan throughput stabil pada endpoint yang mengembalikan daftar (misalnya /events, /markets)[^3][^4].
- Batch endpoints: manfaatkan batch create orders dengan batasan saat ini 20 orders per batch dan akses Advanced; gunakan batch secara selektif untuk menekan jumlah request[^19].
- Caching: cache response market data untuk mengurangi latensi dan tekanan pada API.
- Retry/backoff: terapkan exponential backoff saat menghadapi rate limit (HTTP 429 jika ada), jitter, dan circuit breaker untuk menghindari thundering herd.
- Batching & streaming: untuk penggunaan intensif, kombinasikan REST batch polling (candlesticks) dengan WebSocket streaming untuk mengurangi overhead autentikasi berulang[^31].

Table 2. Ringkasan tier dan indikasi rate limits (perlu validasi final)
| Tier | Read (req/s) | Write (req/s) | Akses Fitur |
|---|---|---|---|
| Basic | 20 | 10 | Publikasi data; tidak untuk trading intensif[^28] |
| Advanced | 30 | 30 | Akses batch orders; trading/portfolio[^28][^19] |
| Premier | 100 | 100 | Volume lebih tinggi; fitur lanjutan[^28] |
| Prime | 400 | 400 | Throughput maksimal; kontak untuk detail[^28] |

Catatan penting: indikasi angka di atas berasal dari ringkasan publik; angka resmi per tier dapat berubah. Tim integrasi harus memverifikasi kuota pada akun mereka dan mematuhi kebijakan penggunaan. Saat membangun client, gunakan SDK untuk mengelola retry/backoff otomatis dan konsistensi signing.

---

## Endpoints Inti dan Parameter (REST)
Kalshi Trade API v2 menyediakan endpoint inti untuk discovery, analisis harga, dan orderbook. Semua endpoint inti di bawah base trade-api/v2 dan dapat diakses publik untuk market data. Di bawah ini, tabel ringkas mengilustrasikan path, metode, parameter kunci, status, dan kegunaan utama[^1][^3][^4][^10][^15].

Table 3. Daftar endpoint inti
| Nama | Method | Path | Autentikasi | Parameter Kunci | Kegunaan |
|---|---|---|---|---|---|
| Get Series | GET | /series/{series_ticker} | Tidak | series_ticker | Metadata seri (judul, kategori, frekuensi)[^1] |
| Get Markets | GET | /markets | Tidak | limit, cursor, event_ticker, series_ticker, status, tickers, min/max_created_ts, min/max_close_ts, min/max_settled_ts, mve_filter | Menemukan dan memfilter pasar; rich market fields[^3] |
| Get Events | GET | /events | Tidak | limit, cursor, with_nilested_markets, with_milestones, status, series_ticker, min_close_ts | Menemukan event; opsional nested markets/milestones[^4] |
| Get Market | GET | /markets/{market_ticker} | Tidak | market_ticker | Detail satu pasar (harga, status, settlement metadata)[^10] |
| Get Orderbook | GET | /markets/{market_ticker}/orderbook | Tidak | market_ticker | Snapshot order book (hanya bids; struktur YES/NO)[^1] |
| Get Candlesticks | GET | /series/{series_ticker}/markets/{ticker}/candlesticks | Tidak | start_ts, end_ts, period_interval (1/60/1440) | OHLCV historis untuk harga YES contract[^15] |

Parameter timestamp dan kompatibilitas filter/status mengikuti kaidah tertentu. Tabel berikut merangkum penggunaan yang benar untuk menghindari request invalid.

Table 4. Ringkasan parameter filter dan kompatibilitas
| Filter/Parameter | Nilai/Contoh | Kompatibilitas | Catatan |
|---|---|---|---|
| status (Markets) | unopened, open, closed, settled | Tidak bersamaan dengan filter timestamp tertentu | Satu nilai status per request[^3] |
| min_created_ts / max_created_ts | Unix TS | Kompatibel dengan status kosong/unopened/open | Berguna untuk discovery batch[^3] |
| min_close_ts / max_close_ts | Unix TS | Cocok saat pasar已进入 closed | Gunakan untuk window closing[^3] |
| min_settled_ts / max_settled_ts | Unix TS | Cocok saat pasar已进入 settled | Gunakan untuk audit settlement[^3] |
| event_ticker | Daftar (≤10) | Kompatibel dengan filter lain | Mempercepat drill‑down event[^3] |
| series_ticker | String | Kompatibel | Narrow to series[^3] |
| tickers | Pasar tertentu | Kompatibel | Targeted fetch[^3] |
| mve_filter | only/exclude | Kompatibel | Multi‑variate events filter[^3] |
| min_close_ts (Events) | Unix TS | Kompatibel | Filter event by market close window[^4] |
| with_nested_markets (Events) | boolean | — | Include markets di event response[^4] |
| with_milestones (Events) | boolean | — | Include milestones array[^4] |

---

## Struktur Data: Events, Markets, Series, Orderbook
Respons API memuat struktur data yang kaya dan konsisten, memetakan alur dari Series → Events → Markets. Di Events, Anda dapat menemukan kategori, sub_title, serta field seperti mutually_exclusive (menunjukkan event memiliki legs yang saling lepas) dan collateral_return_type. Ketika with_nested_markets=true,Events menyertakan daftar objek Market (struktur penuh) yang terkait dengan event tersebut[^4].

Objek Market memuat semua informasi utama untuk analisis harga dan risk: ticker, event_ticker, market_type (“binary”), title/subtitle, yes_sub_title/no_sub_title, timestamps (created_time, open_time, close_time, expected_expiration_time, expiration_time, latest_expiration_time), settlement_timer_seconds, status, response_price_units (“usd_cent”), last_price, yes_bid/yes_ask, no_bid/no_ask, previous_*, volume/volume_24h, open_interest, notional_value, liquidity, settlement_value, result, can_close_early, tick_size, strike_type (“greater”), floor_strike/cap_strike, rules_primary/rules_secondary, mve_collection_ticker, mve_selected_legs (event_ticker, market_ticker, side), price_level_structure, dan price_ranges. Struktur ini memampukan Anda mengekstrak pasar yang sedang aktif, menilai likuiditas, serta memeriksa aturan resolusi (rules_primary/secondary) dan strike info untuk memahami pertanyaan pasar secara presisi[^3][^10].

Orderbook Kalshi mengembalikan struktur bids untuk YES dan NO, mencerminkan sifat timbal balik pada pasar biner—tidak ada asks独立. snapshot orderbook menyediakan pasangan [harga dalam sen, kuantitas] untuk membaca kedalaman likuiditas di level harga terbaik[^1]. Untuk data historis, candlestick memuat OHLCV dan pemisahan bid/ask, dengan interval period_interval=1 (1 menit), 60 (1 jam), dan 1440 (1 hari). Respons berbasis timestamp Unix menyediakan konsistensi penentuan window analitik[^15].

Table 5. Tipe data关键 fields di objek Market (ringkasan)
| Field | Tipe/Format | Deskripsi | Kegunaan Analitik |
|---|---|---|---|
| ticker | string | ID pasar | Identifikasi pasar |
| event_ticker | string | ID event terkait | Join Events ↔ Markets |
| market_type | string | “binary” | Tipe kontrak biner |
| last_price | integer (cents) | Harga terakhir | Probabilitas implisit; backtest |
| yes_bid/yes_ask/no_bid/no_ask | integer (cents) | Bids/asks | Mikrostruktur; slippage |
| volume, volume_24h | integer | Aktivitas perdagangan | Likuiditas harian |
| open_interest | integer | Kontrak terbuka | Depth pasar |
| settlement_value, result | integer/string | Outcome/settlement | Audit hasil |
| rules_primary/secondary | string | Aturan resolusi | Validasi outcome |
| tick_size | integer | Langkah harga | Granularitas harga |
| mve_selected_legs | array | Multi‑variate legs | Portfolio construction |
| price_ranges | array | Struktur rentang harga | Skema strike |

---

## Real-time Data via WebSocket
Kalshi menyediakan satu endpoint WebSocket utama (wss://api.elections.kalshi.com) untuk semua komunikasi real‑time. Koneksi memerlukan autentikasi RSA‑PSS selama handshake, menggunakan header signing yang identik dengan REST. Semua komunikasi (subscribe, unsubscribe, list_subscriptions, update_subscription, serta penerimaan pesan ticker/orderbook_snapshot/orderbook_update/trades/fill/error) terjadi pada koneksi tunggal ini[^5][^6][^7].

Model pesan JSON terstandarisasi, dengan id yang действует sebagai korelasi request/response. Anda dapat berlangganan beberapa saluran sekaligus, lalu memperbarui langganan dengan menambah atau menghapus market_tickers pada subscription ID (sid).Respons subscribed/unsubscribed/ok/error memudahkan kontrol alur dan penanganan kasus duplikasi (“Already subscribed”). Untuk menjaga koneksi tetap hidup, gunakan library yang menangani ping/pong secara otomatis; pustaka Python websockets mendukung keepalive tanpa perlu penanganan manual[^5][^8].

Table 6. Ikhtisar saluran WebSocket
| Channel | Fungsi | Payload utama | Use case |
|---|---|---|---|
| ticker | Harga dan status lintas pasar | Market tickers, last_price, status | Monitoring probabilitas lintas kategori |
| orderbook_snapshot | Snapshot order book | Bids YES/NO (top N) | Initial depth untuk eksekusi |
| orderbook_update | Diff order book | Deltas bids | Real‑time microstructure |
| trades | Eksekusi perdagangan | Price, qty, side | Deteksi momentum |
| fill | Notifikasi pengisian | Order fill details | Akuntansi portofolio real‑time |

Table 7. Contoh pesan WebSocket (struktur)
| Operasi | Contoh Request | Respons | Catatan |
|---|---|---|---|
| subscribe | { id:1, cmd:"subscribe", params:{ channels:["orderbook_delta"], market_ticker:"CPI-22DEC-TN0.1" } } | { id:1, type:"subscribed", msg:{ channel:"orderbook_delta", sid:1 } } | Sid untuk update/delete markets |
| unsubscribe | { id:124, cmd:"unsubscribe", params:{ sids:[2] } } | { sid:2, type:"unsubscribed" } | Pembatalan langganan |
| list_subscriptions | { id:3, cmd:"list_subscriptions" } | { id:3, type:"ok", subscriptions:[{ channel:"ticker", sid:2 }, ...] } | Audit langganan aktif |
| update_subscription (add) | { id:124, cmd:"update_subscription", params:{ sids:[456], market_tickers:["NEW-1","NEW-2"], action:"add_markets" } } | { id:123, sid:456, seq:222, type:"ok", market_tickers:["NEW-1","NEW-2"] } | Tambah pasar |
| update_subscription (delete) | { id:125, cmd:"update_subscription", params:{ sids:[456], market_tickers:["REM-1"], action:"delete_markets" } } | { id:123, sid:456, seq:223, type:"ok" } | Hapus pasar |
| error | — | { id:123, type:"error", msg:{ code:6, msg:"Already subscribed" } } | Diagnostik operasional |

Praktik implementasi: lakukan koneksi dengan backoff exponensial, subscribe hanya saluran yang diperlukan, gunakan update_subscription untuk memodifikasi daftar pasar tanpa membuat koneksi baru, dan tangani pesan error secara eksplisit. Untuk operasi trading/portofolio, gabungkan feed real‑time dengan SDK untuk konsistensi state akun.

---

## Data Historis & Settlement
Untuk backtesting dan pemantauan tren, Kalshi menyediakan endpoint candlesticks: GET /series/{series_ticker}/markets/{ticker}/candlesticks dengan parameter start_ts, end_ts, dan period_interval=1/60/1440. Respons memuat OHLCV untuk harga YES contract, termasuk pembeda bid/ask pada setiap periode, sehingga Anda dapat membangun indikator sensitivitas spread, microprice, atau deviasi spread bid‑ask sebagai ukuran likuiditas intraperiode[^15].

Table 8. Parameter candlesticks dan interpretasi
| Parameter | Nilai valid | Deskripsi | Analitik yang didukung |
|---|---|---|---|
| start_ts | Unix TS | Batas awal window | Windowed backtest |
| end_ts | Unix TS | Batas akhir window | Cohort analysis |
| period_interval | 1 (1 menit), 60 (1 jam), 1440 (1 hari) | Panjang periode | Intraday vs daily |
| series_ticker | string | Seri yang memuat pasar | Konsistensi grouping |
| ticker | string | Pasar target | Targeted series |

Penyelesaian pasar pada Kalshi mengikuti alur: Kedaluwarsa → Hasil Ditentukan → Laporan Settlement Dibuat → Posisi Diselesaikan → Dana Ditransfer. Pesan settlement (FIX tag 35=UMS) memuat MarketResult, SettlementPrice, dan informasi party/akun, kolateral, serta biaya. Di REST, outcome dan settlement dapat dilihat dari field result dan settlement_value pada objek Market, bersama dengan timestamps seperti close_time dan settlement_timer_seconds untuk mengestimasi saat penyelesaian. Setelah outcome final tersedia, hasil pasar biasanya diposting dalam radius waktu yang bergantung pada ketersediaan sumber data dan proses peninjauan; pada beberapa kasus, penyelesaian dapat memakan waktu yang bervariasi (umumnya berlangsung dalam jam setelah resolusi). Pesan settlement menyediakan ID laporan, simbol pasar (ticker), tanggal bisnis penyelesaian (YYYYMMDD), hasil pasar, dan harga penyelesaian, serta entri Kolateral dan biaya yang saat ini bernilai nol[^29][^10][^3][^30].

Table 9. Ringkasan pesan FIX settlement (tag kunci)
| Tag | Nama | Deskripsi |
|---|---|---|
| 20105 | MarketSettlementReportID | ID unik laporan penyelesaian |
| 55 | Symbol | Ticker pasar |
| 715 | ClearingBusinessDate | Tanggal penyelesaian (YYYYMMDD) |
| 20106 | TotNumMarketSettlementReports | Jumlah laporan dalam urutan (paging) |
| 20107 | MarketResult | Hasil pasar (Yes/No) |
| 730 | SettlementPrice | Harga settlement |
| 20108–20110 | PartyIDs (NoMarketSettlementPartyIDs, PartyID, PartyRole) | Identitas pihak dan peran |
| 704/705 | LongQty/ShortQty | Jumlah kontrak YES/NO |
| 1703–1705 | CollateralAmountChanges | Perubahan kolateral (saldo/pembayaran) |
| 136–139 | MiscFees | Biaya exchange (saat ini nol) |

Catatan: Di REST, settlement historis tidak diekspos sebagai endpoint terpisah; Anda harus menggunakan field result, settlement_value, dan timestamps untuk audit settlement pada pasar tertentu. Bila audit mendalam diperlukan (posisi per akun/kolateral), gunakan sesi FIX (KalshiPT/KalshiRT dengan ReceiveSettlementReports=Y) sesuai akses yang diberikan[^29].

---

## Market Categories & Available Markets
Kalshi menyediakan pasarprediksi lintas domain, termasuk politik, ekonomi, budaya, ilmu & teknologi, lingkungan, dan perusahaan. Kalender event membantu perencanaan perdagangan dan penelitian dengan menyorot peristiwa mendatang, sementara halaman kategori di situs public memperjelas cakupan pasar yang tersedia pada tiap domain[^24][^23][^26].

Table 10. Kategori pasar dan contoh event
| Kategori | Contoh event | Use case |
|---|---|---|
| Politik | Hasil pemilu, debat, approval rating | Pemetaan opinipublik, risiko kebijakan |
| Ekonomi | PDB, pengangguran, inflasi, suku bunga | Model makro, nowcasting |
| Budaya | Grammy, perilisan film/game | Sentimen konsumen, pop culture analytics |
| Ilmu & Teknologi | Hasil eksperimen, inovasi | Probabilitas R&D, teknologi readiness |
| Lingkungan | Suhu, kebijakan iklim, emisi | Risiko fisik, ESG analytics |
| Perusahaan | Pendapatan, penjualan, perilisan produk | Model bisnis, guidance vs actual |

Kategori politics & world affairs secara historis mencakup pemilihan nasional dan lokal, peristiwa kebijakan, dan kejadian geopolitik. Ekonomi menyangkut indikator resmi dan keputusan bank sentral; kategori perusahaan berkaitan dengan métricas operasional (anggaran/pendapatan) dan roadmap produk. Sumber sekunder menegaskan cakupan luas ini dan pertumbuhan pasar sejak putusan hukum 2024 yang memperkuat legitimasi pasar event contracts di AS[^27][^37].

---

## Praktik Implementasi & Contoh Alur Kerja
Alur kerja yang efektif biasanya mengikuti tiga tahap: discovery, analisis, dan live monitoring.

Discovery:
- Gunakan Series untuk memahami taxonomy pasar dan kategori yang relevan.
- Gunakan Events (dengan with_nested_markets=true) untuk mendapatkan daftar pasar per event secara efisien.
- Gunakan filter status (open/closed/settled), min_close_ts, min_settled_ts untuk membuat cohort event/pasar yang dapat ditelusuri.

Analisis:
- Ambil detail pasar melalui GET /markets/{ticker} untuk melihat harga terakhir, spread, open interest, dan rules.
- Akses candlesticks pada interval yang sesuai (1 menit untuk intraday, 1 jam/daily untuk strategi horizon lebih panjang).
- Hitung indikator seperti spread bid‑ask (likuiditas), deviasi last_price terhadap rata‑rata intraperiode, dan momentum dari trades feed.

Live monitoring:
- Buka koneksi WebSocket terautentikasi, subscribe pada channel ticker dan orderbook_delta untuk pasar-pasar prioritas.
- Gunakan update_subscription untuk menambah/menghapus pasar secara dinamis sesuai pipeline event.
- Sinkronkan feed dengan SDK untuk menjaga state akun (fills/portfolio) saat melakukan eksekusi.

Integrasi SDK:
- Konfigurasikan KalshiClient (Python) dengan api_key_id dan private_key_pem; gunakan kelas API yang sesuai untuk mendapatkan data pasar dan membuat pesanan.
- Terapkan retry/backoff dan caching pada layer SDK untuk konsistensi terhadap rate limits dan network jitter[^12][^13][^14].

Kepatuhan & operasional:
- Pastikan semua resolusi mengikuti rules_primary/secondary; audit settlement via result/settlement_value.
- Gunakan FIX settlement bila akses tersedia untuk audit posisi/kolateral per akun.
- Terapkan logging komprehensif untuk troubleshooting (error responses WS, rate limit events, timestamp skew).

---

## Batasan, Risiko, dan Catatan Teknis
Orderbook Kalshi hanya mengembalikan bids, bukan asks, karena struktur timbal balik pada kontrak biner. Implikasinya, analisis microstructure harus memfokuskan pada kedalaman bids, spread relatif terhadap last_price, dan dinamika delta untuk menilai tekanan beli/jual. Untuk mengestimasi ask, Anda perlu memperhitungkan hubungan YES/NO pada harga $1 saat settlement dan spread net pada mid‑price yang tersedia.

Filter timestamp pada endpoint tertentu saling eksklusif dengan filter status tertentu. Anda tidak boleh menggabungkan status=settled dengan min_settled_ts pada request yang sama; gunakan salah satu. Pastikan timezone UTC pada parameter Unix timestamp untuk menghindari offset yang tidak diinginkan.

Rate limits per tier dan endpoint bisa berubah; validasi kuota aktual pada akun Anda sebelum go‑live. Beberapa halaman dokumentasi yang menggambarkan angka detail per tier tidak berhasil diekstrak. Gunakan strategi mitigasi: exponential backoff, jitter, queueing request, dan caching respons untuk memperkecil beban puncak[^3][^28].

WebSocket memiliki batasan koneksi dan pesan yang tidak disebutkan eksplisit pada ringkasan publik; gunakan satu koneksi untuk semua komunikasi, subscribe selektif, dan update_subscription untuk efisiensi. Pada data historis candlestick, lakukan konsistensi checks terhadap holes/gaps (misalnya periode tanpa perdagangan) dan pastikan pemetaan period_interval dan timezone konsisten di seluruh pipeline analitik[^7][^15].

---

## Lampiran Teknis

Table 11. Parameter GET /markets (lengkap)
| Nama | Tipe | Default | Rentang/Ketersediaan | Deskripsi |
|---|---|---|---|---|
| limit | integer | 100 | 1–1000 | Ukuran halaman hasil |
| cursor | string | — | — | Kursor halaman berikutnya |
| event_ticker | string | — | ≤10 tickers | Filter event |
| series_ticker | string | — | — | Filter seri |
| min_created_ts / max_created_ts | integer | — | — | Filter waktu pembuatan |
| min_close_ts / max_close_ts | integer | — | — | Filter waktu penutupan |
| min_settled_ts / max_settled_ts | integer | — | — | Filter waktu penyelesaian |
| status | enum | — | satu nilai | unopened/open/closed/settled |
| tickers | string | — | daftar | Filter pasar tertentu |
| mve_filter | enum | — | only/exclude | Filter multivariate events |

Table 12. Parameter GET /events (lengkap)
| Nama | Tipe | Default | Rentang/Ketersediaan | Deskripsi |
|---|---|---|---|---|
| limit | integer | 200 | 1–200 | Ukuran halaman hasil |
| cursor | string | — | — | Kursor halaman berikutnya |
| with_nested_markets | boolean | false | — | Menyertakan pasar di event |
| with_milestones | boolean | false | — | Menyertakan milestones |
| status | enum | — | open/closed/settled | Filter status event |
| series_ticker | string | — | — | Filter seri |
| min_close_ts | integer | — | — | Filter event by close window |

Table 13. Parameter GET Candlesticks (lengkap)
| Nama | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| series_ticker | string | Ya | Seri yang memuat pasar |
| ticker | string | Ya | Pasar target |
| start_ts | integer | Ya | Batas awal window |
| end_ts | integer | Ya | Batas akhir window |
| period_interval | enum (1/60/1440) | Ya | Panjang periode per candle |

Table 14. Ringkasan pesan WebSocket (perintah/respons)
| Tipe Pesan | Tujuan | Contoh |
|---|---|---|
| subscribe | Berlangganan channel/markets | { id:1, cmd:"subscribe", params:{...} } |
| unsubscribe | Batalkan langganan | { id:124, cmd:"unsubscribe", params:{ sids:[...] } } |
| list_subscriptions | Daftar langganan aktif | { id:3, cmd:"list_subscriptions" } |
| update_subscription | Tambah/hapus pasar | { id:124, cmd:"update_subscription", params:{...} } |
| subscribed/unsubscribed/ok/error | Respons | { type:"subscribed", msg:{...} } |

---

## Referensi
[^1]: Quick Start: Market Data - API Documentation. https://docs.kalshi.com/getting_started/quick_start_market_data  
[^2]: Introduction - API Documentation - Kalshi. https://docs.kalshi.com/  
[^3]: Get Markets - API Documentation. https://docs.kalshi.com/api-reference/market/get-markets  
[^4]: Get Events - API Documentation. https://docs.kalshi.com/api-reference/events/get-events  
[^5]: Quick Start: WebSockets - API Documentation. https://docs.kalshi.com/getting_started/quick_start_websockets  
[^6]: WebSocket Connection - API Documentation. https://docs.kalshi.com/websockets/websocket-connection  
[^7]: Communications (WebSockets) - API Documentation. https://docs.kalshi.com/websockets/communications  
[^8]: WebSockets: Keepalive - websockets docs. https://websockets.readthedocs.io/en/stable/topics/design.html#keepalive  
[^10]: Get Market - API Documentation. https://docs.kalshi.com/api-reference/market/get-market  
[^11]: Python SDK Documentation - Kalshi. https://docs.kalshi.com/python-sdk  
[^12]: SeriesApi (Python SDK) - API Documentation. https://docs.kalshi.com/python-sdk/api/SeriesApi  
[^13]: MarketsApi (Python SDK) - API Documentation. https://docs.kalshi.com/python-sdk/api/MarketsApi  
[^14]: Kalshi SDKs - Overview. https://docs.kalshi.com/sdks/overview  
[^15]: Get Market Candlesticks - API Documentation. https://docs.kalshi.com/api-reference/market/get-market-candlesticks  
[^18]: kalshi-python - PyPI. https://pypi.org/project/kalshi-python/  
[^19]: Batch Create Orders - API Documentation. https://docs.kalshi.com/api-reference/portfolio/batch-create-orders  
[^21]: Market Data - Kalshi. https://kalshi.com/market-data  
[^22]: Kalshi API - Help Center. https://help.kalshi.com/kalshi-api  
[^23]: Kalshi Event Calendar. https://kalshi.com/calendar  
[^24]: Different Types of Prediction Markets - Kalshi News. https://news.kalshi.com/p/different-types-prediction-markets  
[^26]: Kalshi Klear Rulebook v1.2 (CFTC Filing). https://www.cftc.gov/sites/default/files/filings/orgrules/25/05/rules05022520613.pdf  
[^29]: Market Settlement (FIX) - API Documentation. https://docs.kalshi.com/fix/market-settlement  
[^30]: Market Outcomes - Help Center. https://help.kalshi.com/markets/markets-101/market-outcomes  
[^31]: Kalshi API: The Complete Developer's Guide - Zuplo. https://zuplo.com/learning-center/kalshi-api  
[^37]: IQ.wiki - Kalshi. https://iq.wiki/wiki/kalshi

---

## Informasi yang Masih Perlu Diverifikasi (Information Gaps)
- Detail kuantitatif rate limits per tier dan per endpoint tidak terpublikasi lengkap pada beberapa halaman dokumentasi (angka per tier perlu konfirmasi).  
- Contoh respons lengkap untuk beberapa endpoint (misalnya Get Series) tidak seluruhnya tersedia dalam ringkasan yang berhasil diekstrak.  
- Tidak ada endpoint settlement historis terpisah di REST; settlement harus diakses via FIX (35=UMS) atau disimpulkan dari field result/settlement_value pada Market.  
-URL WebSocket produksi yang eksplisit tidak seluruhnya tercantum pada beberapa cuplikan; yang tersedia adalah wss://api.elections.kalshi.com dan dokumentasi komunikasi WS.  
- Batas koneksi/throughput WebSocket dan batasan pesan tidak disebutkan secara rinci pada ringkasan.  
- Beberapa referensi sekunder memiliki reputasi dan bias yang bervariasi; gunakan sumber resmi untuk keputusan arsitektural dan operasional.