# Blueprint Arsitektur Platform GambitAI: SRP, Komponen Terusalem, dan Arsitektur Real-time

## Ringkasan Eksekutif

GambitAI bertujuan menjadi platform arbitrase kripto yang unggul dalam kecepatan deteksi peluang, keandalan eksekusi, dan transparansi operasi—semuanya dibangun di atas prinsip Single Responsibility Principle (SRP) dan komponen yang dapat digunakan kembali. Arsitektur yang diusulkan mengandalkan pemisahan domain yang jelas: ingestion data pasar, normalisasi, kalkulasi arbitrase, orkestrasi eksekusi, agregasi observabilitas, notifikasi, autentikasi, dan antarmuka real-time. Setiap domain diwujudkan dalam layanan-layanan terpisah dengan kontrak antarmuka yang tegas, sehingga perubahan di satu sisi (misalnya, perubahan API exchange) tidak merusak fungsi domain lainnya.

Tujuan utama arsitektur ini adalah: 
- Minimalisasi kopel dan maksimalisasi koherensi responsabilidade melalui SRP dan modularisasi di setiap lapis (infrastructure, domain, application, interfaces).
- Desain anti-corruption layer (ACL) yang mengisolasi variasi dan inkonsistensi sumber data eksternal.
- Komponen通用 (generic) yang dapat digunakan ulang, seperti stream processors, metric aggregators, dan adapter notifikasi.
- Ketahanan dan observabilitas end-to-end melalui event-driven architecture, idempotency, replay, dan tracing distribusi.

Arsitektur memanfaatkan aliran event real-time untuk mempercepat dari pengMBOLan data (market, status order, dan sinyal arbitrase) hingga konsumsi (dashboard dan bot). Pipeline keputusan dirancang event-first: sinyal arbitrase → rekomendasi → order plan → eksekusi → status dan settlement. Pengambilan keputusan dilakukan sekecil dan secepat mungkin di tepi (edge) untuk menekan latensi, sedangkan orkestrasi lintas domain konsolidasi di layanan arb-engine.

Risiko utama yang diantisipasi: 
- Rate limit dan instabilitas dari exchange pihak ketiga.
- Inkonsistensi data pasar yang membutuhkan ACL dan strategi rekoniliasi.
- Kegagalan order dan partial fills yang harus ditangani melalui idempotency dan compensating actions.
- Lonjakan traffic yang menuntut autoscaling dan backpressure.
- Keamanan kredensial bot dan user serta ancaman replay/token theft.

Mitigasi yang diterapkan: 
- Adaptive rate limiter dan exponential backoff di adapter eksternal.
- Idempotency keys, exactly-once semantics pada sink domain, dan replay policy untuk pemulihan event.
- Circuit breaker dan fallback cache untuk proteksi dari downstream failure.
- Secrets management, rotate keys, dan audit trail.
- SLO-driven scaling pada jalur hot-path arbitrase dan observabilitas.

## Gambaran Platform & Prinsip Desain (SRP + Reusable Components)

GambitAI disusun sebagai monolit terstruktur (modular monolith) di tahap awal untuk menjaga operasional yang sederhana sekaligus retain opsi pemisahan layanan (scalable decomposition) di tahap evolusi. Modul inti dipisahkan jelas:
- Market Ingestion: bertanggung jawab menyerap data pasar dari multiple exchanges.
- Normalization: menormalisasi model pasar menjadi bentuk seragam.
- Arbitrage Engine: mendeteksi peluang, menyusun rekomendasi, dan menghasilkan order plan.
- Order Orchestrator: menangani lifecycle eksekusi order lintas venue, termasuk risk gates dan reconciliation.
- Monitoring & Alerting: mengumpulkan metrik dan logs, mengevaluasi aturan, dan mengirim notifikasi.
- Auth & RBAC: mengelola identitas, sesi, token, dan otorisasi berbasis peran.
- Dashboard Service: menyajikan data real-time kepada UI melalui server-push.
- Telegram Bot Integration: mengeksekusi chatOps dan notifikasi terarah.

SRP dipraktikkan lewat pemisahan concerns per modul dengan antarmuka input/output yang spesifik. ACL melindungi domain internal dari variasi skema dan semantics dari exchange eksternal. Untuk menghindari lock-in vendor dan meminimalkan duplikasi, komponen通用 dibangun sebagai pustaka bersama: rate limiter通用, metric collector通用, stream processor通用, dan notifier adapter通用 (Email/Telegram/Slack).

Lapisan arsitektur:
- Infrastructure: broker pesan, cache, RDBMS, object storage, secret vault, dan observability stack.
- Domain: model entity dan logika bisnis arbitrase (calculators, selectors, routers).
- Application: services orchestrate use-cases (submit order, reconcile, process signals).
- Interfaces: REST/GraphQL API, WebSocket, Telegram bot, dan admin CLI.

Untuk memperjelas pembagian tanggung jawab, matriks berikut merangkum pemetaan komponen terhadap prinsip SRP dan reusable components.

Tabel 1. Matriks Komponen vs SRP vs Tanggung Jawab

| Komponen                     | SRP: Tanggung Jawab Utama                                             | Antarmuka Publik                             | reuse.Generic | reuse.Domain |
|-----------------------------|-----------------------------------------------------------------------|-----------------------------------------------|---------------|--------------|
| Market Ingestion            | Ambil data pasar dari exchange eksternal                              | Stream market-data, REST status adapter        | Rate limiter, HTTP client | Ya (domain: market types) |
| Normalization               | Standarisasi skema dan semantik unit                                  | Topic normalized.market, mapper util          | Stream processor, schema registry | Ya (domain: market) |
| Arbitrage Engine            | Hitung peluang, rekomendasi, dan order plan                           | Topic arb.signals, gRPC arb-service           | Math libs, selectors | Ya (domain: arbitrage) |
| Order Orchestrator          | Kelola lifecycle order lintas venue                                   | REST order API, topic order.events            | Retry/backoff, idempotency keys | Ya (domain: order) |
| Monitoring & Alerting       | Kumpulkan metrik/logs, evaluasi rules, kirim notifikasi               | REST metrics, Webhook notifier                | Aggregators, notifier adapter | Ya (monitoring) |
| Auth & RBAC                 | Autentikasi pengguna dan kontrol akses                                | REST auth, JWT decoder                        | Crypto libs, token store | Ya (security) |
| Dashboard Service           | Servis data real-time ke UI                                           | WebSocket server, REST snapshot               | Serializer, WS hub | Ya (ui) |
| Telegram Bot Integration    | ChatOps: perintah, notifikasi, dan konfirmasi                         | Bot command handlers, REST bot-service        | Formatter, rate limiter | Ya (bot) |

Keterangan: komponen通用 mendukung reuse lintas domain, sementara reuse.Domain merujuk pada kemungkinan pemakaian dalam domain bisnis lain tanpa ketergantungan implementasi eksternal.

## Model Data & Skema Database (Conceptual)

Skema database digagas untuk melayani dua workload: transactional (order lifecycle, user/session) dan analytical/observability (time-series metrics, audit trail). Entitas inti meliputi Users, ApiCredentials, Sessions, ArbitrageOpportunity, OrderPlan, Orders, Executions, Settlements, MarketSnapshots, Alerts, dan AuditLog. Relational focus pada transactional correctness: strong keys, foreign keys, indeks pada jalur hot-path (symbol, venue, status), dan idempotency keys pada order-related tables. Time-series metrics disimpan terpisah (narrow table, high write throughput) dengan downsampling dan retensi terpisah.

Tabel 2. Entitas Utama dan Hubungan (Conceptual)

| Entitas                | Kunci Utama         | Hubungan Kunci Asing                                             | Indeks Utama                                  |
|------------------------|---------------------|------------------------------------------------------------------|-----------------------------------------------|
| Users                  | user_id (UUID)      | Sessions.user_id → Users.user_id                                 | idx_users_email (unique)                      |
| ApiCredentials         | cred_id (UUID)      | ApiCredentials.user_id → Users.user_id                           | idx_cred_user (unique per user+venue)         |
| Sessions               | session_id (UUID)   | Sessions.user_id → Users.user_id                                 | idx_sess_user, idx_sess_exp                   |
| ArbitrageOpportunity   | opp_id (UUID)       | ArbitrageOpportunity.base_asset, quote_asset (denormalized)      | idx_opp_symbol_venue, idx_opp_created_at      |
| OrderPlan              | plan_id (UUID)      | OrderPlan.opp_id → ArbitrageOpportunity.opp_id                   | idx_plan_opp, idx_plan_status                 |
| Orders                 | order_id (UUID)     | Orders.plan_id → OrderPlan.plan_id; Orders.user_id → Users.user_id | idx_order_plan, idx_order_status, idx_order_venue |
| Executions             | exec_id (UUID)      | Executions.order_id → Orders.order_id                            | idx_exec_order, idx_exec_time                 |
| Settlements            | settlement_id (UUID)| Settlements.order_id → Orders.order_id                           | idx_settle_order, idx_settle_time             |
| MarketSnapshots        | snapshot_id (UUID)  | MarketSnapshots.symbol, venue (denormalized)                     | idx_snapshot_symbol_venue_time                |
| Alerts                 | alert_id (UUID)     | Alerts.user_id → Users.user_id (ops), Alerts.rule_id             | idx_alert_rule, idx_alert_severity_time       |
| AuditLog               | audit_id (UUID)     | AuditLog.user_id → Users.user_id; AuditLog.entity_ref            | idx_audit_user, idx_audit_entity_time         |

Skema Relasional Inti

Tabel 3. Skema Tabel Relasional (Conceptual)

| Tabel                | Kolom Kunci (tipe)                                                                                   | Catatan Desain                                                                 |
|----------------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| users                | user_id (UUID), email (text unique), password_hash (text), status (enum), created_at (tstz)         | Hash password di sisi aplikasi; status: active/suspended                       |
| api_credentials      | cred_id (UUID), user_id (UUID), venue (text), api_key_encrypted (text), secret_encrypted (text), scopes (jsonb), created_at (tstz) | Enkripsi di aplikasi; disimpan sebagai ciphertext; scopes untuk RBAC granular |
| sessions             | session_id (UUID), user_id (UUID), jwt_id (UUID), issued_at (tstz), expires_at (tstz), revoked (bool) | Tidak menyimpan refresh token dalam tabel; rely on stateless JWT + revocation |
| arbitrage_opportunity| opp_id (UUID), symbol (text), base_asset (text), quote_asset (text), venue_buy (text), venue_sell (text), spread_bps (numeric), score (numeric), ttl_sec (int), created_at (tstz), raw_signal_id (UUID) | ttl_sec untuk expires/soft delete; score untuk ranking                         |
| order_plan           | plan_id (UUID), opp_id (UUID), status (enum), risk_flags (jsonb), total_quote_amount (numeric), created_at (tstz), updated_at (tstz) | risk_flags: under_collateral, price_move, min_liquidity                        |
| orders               | order_id (UUID), plan_id (UUID), user_id (UUID), venue (text), symbol (text), side (enum), qty (numeric), price (numeric), status (enum), idempotency_key (text), created_at (tstz), updated_at (tstz) | idempotency_key per eksekusi/venue; unique(idempotency_key, venue)             |
| executions           | exec_id (UUID), order_id (UUID), exec_venue_id (text), qty_filled (numeric), price (numeric), fee (numeric), exec_time (tstz), venue_exec_id (text) | Venue exec id untuk rekoniliasi                                              |
| settlements          | settlement_id (UUID), order_id (UUID), amount_net (numeric), fee_total (numeric), status (enum), settled_at (tstz) | Status: pending/confirmed/failed                                              |
| market_snapshots     | snapshot_id (UUID), symbol (text), venue (text), bid (numeric), ask (numeric), mid (numeric), ts (tstz) | Menyimpan nilai penting untuk audit dan reprocessing                          |
| alerts               | alert_id (UUID), rule_id (UUID), severity (enum), message (text), user_id (UUID nullable), created_at (tstz), resolved_at (tstz nullable) | Ops alerts tidak terikat user_id                                              |
| audit_log            | audit_id (UUID), user_id (UUID), action (text), entity_type (text), entity_ref (text), metadata (jsonb), ts (tstz) | Trail untuk keamanan dan kepatuhan                                            |

Tabel 4. Metrik Time-series (Conceptual)

| Tabel Metrik         | Kolom Kunci (tipe)                                                                                   | Partisi & Retensi                      |
|----------------------|-------------------------------------------------------------------------------------------------------|----------------------------------------|
| ts_ingestion_lag     | metric_id (UUID), exchange (text), stream (text), lag_ms (int), ts (tstz)                            | Partisi per hari; retensi 14–30 hari   |
| ts_order_latency     | metric_id (UUID), venue (text), op (text), latency_ms (int), ts (tstz)                               | Partisi per hari; retensi 30–90 hari   |
| tsArbSignalThroughput| metric_id (UUID), symbol (text), signals_per_sec (int), ts (tstz)                                    | Partisi per hari; retensi 30–90 hari   |
| ts_errors            | metric_id (UUID), component (text), error_type (text), count (int), ts (tstz)                        | Partisi per hari; retensi 90–180 hari  |
| ts_alerts            | metric_id (UUID), rule_id (UUID), severity (enum), count (int), ts (tstz)                            | Partisi per hari; retensi 180+ hari    |

Kontrak Data & Schema Management

 Setiap topik event memiliki kontrak skema yang dipelihara melalui registry skema. ACL memastikan variasi skema eksternal ditransformasi menjadi skema internal yang stabil. Versi skema dikembangkan dengan strategi backward/forward compatibility: field baru ditambahkan sebagai optional, sedangkan field yangDeprecated ditandai dan dihapus sesuai jadwal. Skema events arb.signal, order.status, dan market.normalized memiliki evolusi yang terkendali, sehingga konsumen tidak serentak patah saat skema berganti.

Tabel 5. Contoh Kontrak Event (Conceptual)

| Topik Event             | Payload Inti                                                                                                  | Status Versi     |
|-------------------------|---------------------------------------------------------------------------------------------------------------|------------------|
| market.normalized       | symbol, venue, bid, ask, mid, ts, schema_ver                                                                 | v1 (stabil)      |
| arb.signal              | opp_id, symbol, base_asset, quote_asset, venue_buy, venue_sell, spread_bps, score, ttl_sec, raw_signal_id, ts, schema_ver | v2 (aktif)       |
| order.status            | order_id, plan_id, venue, status, qty_filled, price, idempotency_key, ts, schema_ver                         | v1 (stabil)      |
| alert.raised            | alert_id, rule_id, severity, message, scope, ts, schema_ver                                                  | v1 (stabil)      |
| bot.cmd                 | chat_id, cmd, args, correlation_id, ts, schema_ver                                                           | v1 (stabil)      |

## Alur Integrasi API & ACL (Anti-Corruption Layer)

Adapter eksternal dibangun per exchange dan per varian API. Tanggung jawab adapter tunggal: mengambil payload eksternal dan将其 menormalisasi menjadi skema internal, serta mengatasi perbedaan semantics (misalnya unit price, precision, dan error code). Rate limiting dan retry dengan exponential backoff diterapkan untuk menghormati kuota API. Error kategorisasi membantu penanganan adaptif: retry untuk error transien, circuit breaker untuk failure berkelanjutan, dan fallback cache ketika data kritikal tertunda.

ACL menghindari污染 domain interno oleh skema vendor. Mapper pada adapter melakukan translate field names, menambahkan normalized timestamp, dan melengkapi metadata необходимые untuk korelasi downstream. Di sisi inbound (masuk ke platform), adapter menulis ke topic normalized.market dengan idempotency key berdasarkan exchange + venue + symbol + ts. Di sisi outbound (keluar menuju exchange), adapter order Mengelola signing dan autentikasi kredensial, tetapi tidak menangani logika bisnis; mereka mengeksekusi sesuai instruksi dari Order Orchestrator.

Adapter通用 menyediakan pola umum: HTTP client通用, signing utilities通用, validator payload通用, dan error parser通用. Dengan demikian, setiap exchange adapter menjadi thin layer yang menggabungkan通用 dengan detail vendor.

Untuk memperjelas penanganan error, tabel berikut memetakan kategori ke strategi.

Tabel 6. Strategi Retry & Backoff per Kategori Error (Conceptual)

| Kategori Error          | Contoh Kondisi                                | Strategi Utama                     | Circuit Breaker | Catatan                                                         |
|-------------------------|-----------------------------------------------|------------------------------------|-----------------|------------------------------------------------------------------|
| Rate limit              | HTTP 429, quota exceeded                      | Retry dengan backoff + jitter      | Tidak           | Adaptive throttle: turunkan concurrency sementara                |
| Transient network       | Timeout, DNS, 连接 reset                       | Retry eksponensial (max 5x)        | Tidak           | Idempotent request wajib                                        |
| Vendor 5xx              | Exchange internal error                        | Retry dengan backoff               | Ya (setelah N)  | Fallback ke snapshot terakhir                                   |
| Auth failure            | Kredensial invalid/expired                    | Tidak retry                        | Tidak           | Trigger rotate credential + alert                               |
| Data inkonsistensi      | Skema tak sesuai, nilai anomali               | Quarantine + requeue               | Tidak           | ACL mapper memperbaik jika memungkinkan; escalate jika berulang |
| Permanent 4xx           | Parameter invalid, path tidak valid           | Tidak retry                        | Tidak           | Perbaiki konfigurasi/instruksi                                  |

### Market Data Ingestion

Collector market data menyubscribe feed eksternal dan menulis ke topic normalized.market. Setiap record menyertakan venue, symbol, bid/ask/mid, dan timestamp. Throughput dioptimalkan dengan batching dan kontrol backpressure. Idempotency dijaga dengan kunci unik venue+symbol+ts untuk mencegah duplikasi. Schema validation occurs sebelum record diterima di broker; record yang gagal disimpan ke dead-letter queue (DLQ) untuk analisis.

### Order Execution Adapter

Adapter outbound mengirim order ke exchange berdasarkan instruksi dari Order Orchestrator. Mereka menangani signing, autentikasi kredensial, dan format order per venue. Semua request bersifat idempotent melalui idempotency_key dan correlation_id. Orchestrator mengambil responsibility atas keputusan eksekusi (routing, splitting, time-in-force), sementara adapter fokus pada faithful execution.

## Mesin Kalkulasi Arbitrase (Engine) – SRP & Komponen通用

Mesin arbitrase terdiri atas langkah-langkah berurutan yang dipisahkan secara tegas:
- Ingestion → Normalization → Signal Detection → Opportunity Scoring → Risk/Reward → Order Plan.

Setiap langkah adalah komponen通用 dengan antarmuka input/output yang konsisten, sehingga dapat diganti atau di-tweak tanpa memengaruhi langkah lain. Signal Detection menekankan windowed calculation untuk spread antar venue, liquidity-aware filters untuk memastikan ecxecutable, dan volatility-aware scoring untuk menghindari sinyal yang rapuh. Order Plan Builder Menghasilkan instruksi detail: route per venue, jumlah per leg, tolerance slippage, dan waktu Kadaluarsa rekomendasi. Komponen通用 lainnya: Math libs (numerik dan statistik window),Selectors (top-N peluang), dan Router (penentuan pasanganvenue dan rute eksekusi).

Tabel 7. Komponen通用 vs Domain (Conceptual)

| Komponen                | Tipo            | Antarmuka                               | reuse.Domain | Deskripsi                                                   |
|-------------------------|-----------------|------------------------------------------|--------------|-------------------------------------------------------------|
| WindowedSpreadCalculator|通用             | input: normalized.market; output: spread | Arbitrase    | Menghitung spread dalam window waktu tertentu               |
| LiquidityFilter         |通用             | input: spreads + orderbook depth; output: filtered | Arbitrase   | Memastikan likuiditas memadai per venue                     |
| VolatilityScorer        |通用             | input: price series; output: score       | Arbitrase    | Mengukur kestabilan harga                                   |
| OpportunityRanker       |通用             | input: candidate opportunities; output: ranked | Arbitrase | Ranking top-N berdasarkan skor                             |
| OrderPlanBuilder        |Domain           | input: ranked opp; output: plan          | Arbitrase    | Membangun instruksi eksekusi (legs, amounts, tolerance)    |
| RiskGate                |Domain           | input: plan; output: approved/flagged    | Order        | Memeriksa risk flags dan gate eksekusi                      |
| RoutingSelector         |通用             | input: venues; output: routes            | Arbitrase    | Memilih rute antar venue berdasarkan biaya dan latensi      |
| RetryPolicy             |通用             | config: backoff; return: policy          | Infra        | Kebijakan retry untuk setiap langkah                        |

Tabel 8. Parameter Perhitungan &默认值 (Conceptual)

| Parameter                     | Deskripsi                                      | Default            | Rentang              | Dampak pada Perhitungan                                  |
|------------------------------|------------------------------------------------|--------------------|----------------------|-----------------------------------------------------------|
| window_size_sec              | Ukuran jendela waktu untuk spread              | 5                  | 1–30                 | Mempengaruhi sensitivitas terhadap perubahan harga        |
| min_liquidity_depth          | Kedalaman orderbook minimum per venue          | 10,000 unit        | 1,000–100,000        | Menyaring peluang yang tidak eksekutabel                 |
| max_slippage_bps             | Toleransi slippage maksimal                    | 20                 | 5–100                | Mengontrol risiko eksekusi di leg destino                |
| opportunity_ttl_sec          | Masa berlaku rekomendasi                       | 10                 | 5–60                 | Mencegah rekomendasi basi                                 |
| min_spread_bps               | Spread minimum untuk qualify                   | 15                 | 5–50                 | Mengatur sensitivitas deteksi                             |
| fee_bps                      | Fee total per trade (perkiraan)                | 10                 | 5–20                 | Meng影响 net spread                                       |
| ranking_weights              | Bobot scoring (spread, liquidity, volatility)  | 0.5/0.3/0.2        | 0–1, jumlah=1        | Mengatur prioritas criteria                               |

Pipeline & Heuristik

 Heuristik inti: spread antar venue harus melebihi biaya total (fee + slippage + estimasi market impact) dengan margin keselamatan. Liquidity filter mencegah rekomendasi pada pasangan dengan orderbook dangkal yang sulit diisi. Volatility-aware scoring menghindari false positive saat market bergejolak. Order Plan Builder Menghasilkan rencana Multi-leg jika diperlukan, dengan toleransi slippage dan batas jumlah per venue. Hasil rekomendasi dikirim ke topik arb.signals untuk konsumsi oleh Order Orchestrator, Dashboard, dan Bot.

## Alur Eksekusi & Orquestrasi Order

Use-case arbitrase dimulai dari sinyal. Orchestrator menerima rekomendasi, menerapkan risk gates, lalu menyusun urutan eksekusi. Pada strategi atomic, semua legs harus исполнены atau dibatalkan (all-or-nothing). Pada strategi partial fill, orchestrator dapat melanjutkan dengan legs yang berhasil, sambil mengeluarkan compensating actions untuk ketidakseimbangan.

Orchestrator menyimpan status eksekusi dalam topic order.events dan mengekspor state ke Dashboard dan Bot. Rekoniliasi dengan venue execution id dilakukan di service reconciliation. Idempotency dijaga via idempotency_key; jika terjadi duplikasi request dari upstream, orchestrator mengembalikan status tanpa efek ganda.

Tabel 9. State Machine Order (Conceptual)

| Status         | Transisi                                                                 | Pemicu                               | Action                                                |
|----------------|---------------------------------------------------------------------------|--------------------------------------|-------------------------------------------------------|
| created        | → planned                                                                 | Rekomendasi diterima                 | Simpan rencana, cek idempotency                       |
| planned        | → pending_submission                                                      | Validasi risk passed                 | Siapkan payload per venue                              |
| pending_submission | → submitted / failed                                                 | Kirim ke adapter                     | Simpan idempotency_key, request submitted              |
| submitted      | → partially_filled / filled / failed                                     | Respon venue                         | Update fill qty/price/fee                             |
| partially_filled| → filled / canceled / failed                                            | Lebih banyak fill atau instruksi     | Lanjut eksekusi atau compensating action               |
| filled         | → reconciled                                                             | Konfirmasi settlement                | Rekoniliasi amount dan fee                            |
| canceled       | → compensated                                                            | Keputusan pembatalan                 | Compensating action untuk legs lain                    |
| failed         | → retried / aborted                                                      | Error permanen/abort                 | Retry atau abort dengan alert                          |
| reconciled     | —                                                                        | Selesai                               | Catat AuditLog                                        |

Tabel 10. Idempotency & Correlation Mapping (Conceptual)

| Entity             | Idempotency Key Format                         | Scope             | TTL        |
|--------------------|-------------------------------------------------|-------------------|------------|
| Order              | user_id + plan_id + venue + symbol + side + qty | Per venue         | 24 jam     |
| Execution          | order_id + venue_exec_id                        | Per order         | 7 hari     |
| Settlement         | order_id + settlement_batch_id                  | Per order         | 30 hari    |
| Bot action         | chat_id + cmd + args_hash                       | Per chat session  | 1 jam      |

Ketahanan & Recovery

Retry policy dan dead-letter handling memastikan ketahanan saat terjadi gangguan transien. Circuit breaker melindungi dari downstream gagal berkelanjutan dengan mengalihkan lalu lintas sementara atau menurunkan kualitas. Orchestrator menyediakan replaytopic untuk memulihkan state setelah pemulihan broker/database. Audit trail записывает setiap transisi state untuk forensics dan kepatuhan.

## Arsitektur Monitoring Real-time & Observability

Observabilitas dibangun pada tiga pilar: metrics, logs, dan tracing. Metrics difokuskan pada latensi ingest, throughput sinyal arbitrase, rasio error, latensi order, danalert health. Logs dikontekstualisasikan dengan correlation_id dan idempotency_key untuk memetakan event lintas layanan. Tracing distribusi memberi visibilitas jalur eksekusi dari market data ke eksekusi order.

Rules engine mengevaluasi kondisi SLO/SLA danthreshold alert. Notifikasi dikirim melalui adapter通用 (Email, Telegram, Slack). Dashboard service menyajikan snapshot dan update real-time melalui server-push.

Tabel 11. Katalog Metrik & Alarmi (Conceptual)

| Nama Metrik                  | Sumber                 | Threshold (default)     | Aksi                                       | Severity |
|-----------------------------|------------------------|-------------------------|--------------------------------------------|----------|
| ingestion_lag_ms            | Market Ingestion       | > 500 ms                | Alert ke Ops; throttle consumer            | High     |
| arb_signals_per_sec         | Arb Engine             | < 20 (per symbol)       | Investigasi sumber data/filter             | Medium   |
| order_submit_latency_ms     | Order Orchestrator     | > 1,000 ms              | Alert Ops; cek adapter downstream          | High     |
| error_rate_by_component     | Monitoring Aggregator  | > 2% per komponen       | Alert; escalate ke maintainer              | Medium   |
| alert_delivery_success      | Notifier Adapter       | < 95%                   | Retry/alternate channel                    | Medium   |

Tabel 12. Matriks SLO/SLA (Conceptual)

| Use-case                | Target                          | Metode Pengukuran                    | Catatan                                           |
|-------------------------|----------------------------------|--------------------------------------|---------------------------------------------------|
| Deteksi peluang         | P95 latensi < 300 ms             | Tracing ingest→engine                 | Dipengaruhi rate limit dan kualitas feed         |
| Eksekusi order          | P95 latensi submit < 1,000 ms    | Metrics order_submit_latency          | Bergantung pada venue dan adapter                |
| Notifikasi bot          | P95 delivery < 2,000 ms          | Notifier adapter metrics              | Retry dengan backoff; alternate channel          |
| Konsistensi data        | Idempotency miss rate < 0.1%     | AuditLog + reconciliation             | Ditekan melalui idempotency keys                 |

Event Telemetry & Alerting

Event telemetry Arb (signal_raised, plan_approved), Order (order_submitted, order_filled), dan System (circuit_opened, circuit_closed) menjadi sumber utama alert. Correlator mengaitkan event lintas topik menggunakan correlation_id untuk mempercepat diagnosis.

## Dashboard Real-time (Server-Push Architecture)

Dashboard service menyediakan snapshot awal (REST/GraphQL) dan update kontinu melalui WebSocket. Server mem-publish update per koneksi dengan filter berdasarkan interest (symbol, venue, user).Serializer通用 menormalisasi payload, mentre subscription registry menjaga daftar subscriber. Backpressure handled via:
- Rate control per subscriber.
- Priority channels untuk event penting (order.fill vs market tick).
- Downsampling pada feed berfrekuensi tinggi (misalnya, market ticks) saat subscriber backlog tinggi.

Tabel 13. Channel & Payload per Widget (Conceptual)

| Widget                     | Topik/Channel                      | Rata-rata Update/sec | Payload Utama                                               |
|---------------------------|------------------------------------|-----------------------|-------------------------------------------------------------|
| Peluang Arbitrase Teratas | arb.signals (filtered top-N)       | 5–10                  | symbol, spread_bps, score, venues, ttl_sec                  |
| Status Eksekusi           | order.status                        | 1–5                   | order_id, status, qty_filled, price, updated_at             |
| Latensi & Throughput      | system.metrics                      | 1                     | ingestion_lag_ms, signals_per_sec, order_latency_ms         |
| Alert Feed                | alert.raised                        | 0.5–2                 | rule_id, severity, message, created_at                      |

### Autentikasi & Otorisasi untuk WebSocket

Handshake memanfaatkan token (JSON Web Token, JWT) yang diceg ke sub, exp, dan scope. Scope memuat izin granular,misalnya: 
- ws:read:market untuk market data.
- ws:read:orders untuk status order.
- ws:read:alerts untuk alert feed.

Authorization dilakukan per channel. Jika token kedaluwarsa, server menonaktifkan channel dan meminta refresh token melalui alur Auth.

## Alur Autentikasi Pengguna (JWT, Refresh, RBAC)

Registrasi dan login menghasilkan access token (JWT) dan refresh token. JWT bersifat stateless; refresh token disimpan di sisi klien dan diganti secara berkala. Rotasi refresh dilakukan pada setiap penggunaan; token yangdigunakanInvalidate untuk mengurangi risiko replay. Otorisasi berbasis peran (Role-Based Access Control, RBAC) meliputi Admin, Trader, dan Viewer, dengan izin granular per endpoint/command.

Tabel 14. Matriks Peran × Izin (Conceptual)

| Role    | Endpoint/Command                  | Aksi Diizinkan                                   | Scope                  |
|---------|-----------------------------------|--------------------------------------------------|------------------------|
| Admin   | /admin/*, bot:admin:*             | Manage users, roles, global config               | admin:*                |
| Trader  | /orders/*, /arb/*, bot:trade:*    | Submit/cancel orders, view opportunities         | orders:*, arb:read     |
| Viewer  | /market/*, /dashboard/*           | Read-only, subscribe ws:market                   | market:read, ws:read   |

Tabel 15. State & Alur Token (Conceptual)

| Langkah                      | Input                         | Output                        | Kondisi Error                  |
|-----------------------------|-------------------------------|-------------------------------|---------------------------------|
| Registrasi                  | email, password               | user_id                       | Email sudah digunakan          |
| Login                       | email, password               | access_JWT, refresh_JWT       | Kredensial salah               |
| Refresh                     | refresh_JWT                   | access_JWT baru, refresh_JWT baru | Refresh revoked/expired    |
| Revoke                      | user_id/session_id            | Revocation mark               | Hanya Admin/self               |

## Integrasi Bot Telegram (ChatOps & Notifikasi)

Bot Telegram beroperasi melalui command set seperti /status, /opportunities, /confirm_order, dan /cancel. State machine command memastikan validasi input, konfirmasi dua langkah untuk tindakan sensitif, dan enforcement rate limit agar tidak terjadi spamming. Notifikasi dapat dikonfigurasi per user untuk alert dan peluang arbitrase dengan preferensi channel (Telegram, Email, Slack).

Tabel 16. Command Bot × Peran × Opsi (Conceptual)

| Command          | Role        | Deskripsi                               | Parameter              | Confirm | Rate Limit |
|------------------|-------------|-----------------------------------------|------------------------|---------|-----------|
| /status          | Viewer/Trader| Status platform dan peluang terbaru     | —                      | Tidak   | 10/m      |
| /opportunities   | Viewer/Trader| Daftar peluang teratas                  | symbol (optional)      | Tidak   | 10/m      |
| /confirm_order   | Trader      | Konfirmasi eksekusi order               | plan_id, amount        | Ya      | 5/m       |
| /cancel_order    | Trader      | Batalkan order                          | order_id               | Ya      | 5/m       |
| /subscribe_alerts| Viewer/Trader| Berlangganan alert                      | severity, topics       | Tidak   | 5/m       |
| /admin_stats     | Admin       | Statistik platform                      | —                      | Tidak   | 10/m      |

Bot Security

 Autentikasi bot dilakukan dengan token bot yang disimpan di secret vault. HMAC signature dapat diterapkan pada inbound command untuk integrasi khusus; namun, untuk chat user standard, bot cukup memvalidasi user melalui platform Auth (JWT binding antar sesi). Rate limit per chat dan audit trail penyimpanan command mencegah penyalahgunaan. Semua command yang mengubah state (misalnya confirm_order) harus melalui alur idempotency yang sama dengan Order Orchestrator.

## Distribusi & Skalabilitas (Event-Driven, Microservices Evolution)

Jalur arbitrase (market → engine → orchestrator) adalah hot-path yang membutuhkan latensi rendah dan throughput tinggi. Pendekatan event-driven memungkinkan skala horizontal per topik dan per konsumen. Buffering di broker dan backpressure di konsumen menjaga sistem dari overload. Microservices evolution bertahap dapat memecah modul menjadi layanan-layanan独立: market-service, arb-service, order-service, notification-service,dan dashboard-service. Decomposition dikendalikan dengan kontrak event yang stabil dan versioning skema.

Tabel 17. Alokasi Topik × Produsen × Konsumen × SLA (Conceptual)

| Topik                 | Produsen               | Konsumen                          | SLA Latensi         | Throughput           |
|-----------------------|------------------------|-----------------------------------|---------------------|----------------------|
| normalized.market     | Market Ingestion       | Arb Engine, Dashboard, Monitoring | P95 < 300 ms        | Tinggi (frekuensi tinggi) |
| arb.signals           | Arb Engine             | Order Orchestrator, Dashboard, Bot| P95 < 200 ms        | Menengah             |
| order.events          | Order Orchestrator     | Dashboard, Bot, Monitoring        | P95 < 400 ms        | Menengah             |
| alert.raised          | Monitoring             | Dashboard, Bot                    | P95 < 500 ms        | Rendah–Menengah      |

## Keamanan & Kepatuhan

Keamanan data sensitif adalah prioritas. Enkripsi in-transit via Transport Layer Security (TLS) dan at-rest via enkripsi storage/database. Kredensial API, secret bot, dan kunci signing disimpan di secret vault dengan rotasi terjadwal. Audit trail mencakup semua perubahan state, akses, dan eksekusi command. Perlindungan mencakup rate limit end-point, validasi input yang ketat, dan mitigasi replay (binding JWT ke session/device dan invalidasi refresh token yang digunakan).

Tabel 18. Inventaris Rahasia & Rotasi (Conceptual)

| Secret                     | Lokasi Penyimpanan     | Interval Rotasi       | Pemilik            | Catatan Keamanan                                  |
|---------------------------|------------------------|-----------------------|--------------------|---------------------------------------------------|
| Bot token                 | Secret vault           | 90 hari               | Admin              | Hanya bot-service yang punya akses                |
| User JWT signing key      | Secret vault (HSM)     | 180 hari              | Admin              | Tidak diekspor; rotasi dengan overlap             |
| API keys (exchanges)      | Encrypted DB           | 60–90 hari            | User/Admin         | Enkripsi di aplikasi sebelum simpan               |
| DB credentials            | Secret vault           | 90 hari               | DevOps             | Rotation coordinate dengan aplikasi               |
| Webhook secret            | Secret vault           | 90 hari               | Ops                | Validasi HMAC pada inbound webhook                |

## Rencana Implementasi Bertahap (MVP → V1 → V2)

Tahap MVP fokus pada inti arbitrase dan observabilitas dasar:
- Integrasi minimal (1–2 exchange) dan satu jalur arbitrase.
- Monitoring metrik dasar dan alert sederhana.
- Dashboard read-only dan bot untuk notifikasi minimal.
- Auth dengan JWT dan RBAC dasar.

Tahap V1 meningkatkan keandalan dan cakupan:
- ACL penuh dan multi-exchange, dengan schema registry.
- Arbitrage engine memiliki ranking dan risk gates lebih matang.
- Dashboard real-time penuh (WebSocket).
- Notifikasi bot terarah dengan preferensi user.

Tahap V2 menyentuh optimasi performa dan hardening:
- Decomposition layanan dan fine-grained autoscaling.
- Hardening keamanan, audit lengkap, dan compliance.
- Replay & recovery yang robust (checkpointing dan state restoration).

Tabel 19. Roadmap Fase × Kapabilitas × Risiko × Mitigasi (Conceptual)

| Fase | Kapabilitas                         | Risiko Utama                       | Mitigasi                                          |
|------|-------------------------------------|------------------------------------|---------------------------------------------------|
| MVP  | Inti arbitrase, basic monitoring, JWT| Rate limit, data inkonsistensi     | Adaptive limiter, ACL, fallback cache             |
| V1   | Multi-exchange, WebSocket dashboard | Kegagalan order, partial fills     | Idempotency, compensating actions, replay         |
| V2   | Microservices, security hardening   | Scalability dan operational beban  | SLO-driven scaling, observability end-to-end      |

## Lampiran: Kontrak API & Contoh Payload (Conceptual)

Kontrak API internal dan event topics ditetapkan untuk menjaga kompatibilitas dan memudahkan integrasi downstream. Berikut contoh payload dan deskripsi endpoint.

Tabel 20. Ringkasan Endpoint & Scope RBAC (Conceptual)

| Endpoint                 | Method | Request Utama                               | Response Utama                      | Scope             |
|-------------------------|--------|---------------------------------------------|-------------------------------------|-------------------|
| /market/snapshot        | GET    | symbol, venue                               | bid, ask, mid, ts                   | market:read       |
| /arb/opportunities      | GET    | symbol (optional), limit                    | list of opportunities               | arb:read          |
| /orders                 | POST   | plan_id, symbol, side, qty, price, venue    | order_id, status                    | orders:write      |
| /orders/{id}            | GET    | order_id                                    | status, qty_filled, price           | orders:read       |
| /alerts                 | POST   | rule_id, severity, message                  | alert_id                            | alerts:write      |
| /alerts                 | GET    | page, size                                  | list of alerts                      | alerts:read       |
| /auth/login             | POST   | email, password                             | access_JWT, refresh_JWT             | —                 |
| /auth/refresh           | POST   | refresh_JWT                                 | access_JWT baru, refresh_JWT baru   | —                 |
| /ws/dashboard           | WS     | token (JWT), subscription filters           | stream updates                      | ws:read           |

Contoh Payload Arbitrage Signal (arb.signals v2)

{
  "opp_id": "c2e3d71a-0d7e-4b0c-9f9a-7f0d6a8e0b11",
  "symbol": "BTC-USDT",
  "base_asset": "BTC",
  "quote_asset": "USDT",
  "venue_buy": "venueA",
  "venue_sell": "venueB",
  "spread_bps": 32.5,
  "score": 0.82,
  "ttl_sec": 10,
  "raw_signal_id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "ts": "2025-11-17T19:28:04Z",
  "schema_ver": "2"
}

Contoh Payload Order Status (order.status v1)

{
  "order_id": "e9f3f0b9-cc61-4f0a-9e2d-6e57b7a0b2f1",
  "plan_id": "f2c2b7b0-0a2f-4c3a-9d7a-2e88e9b0a0a0",
  "venue": "venueA",
  "status": "partially_filled",
  "qty_filled": "0.2500",
  "price": "91250.10",
  "idempotency_key": "user123-plan123-venueA-BTC-USDT-buy-0.5000",
  "ts": "2025-11-17T19:28:06Z",
  "schema_ver": "1"
}

Contoh Payload Market Normalized (market.normalized v1)

{
  "symbol": "BTC-USDT",
  "venue": "venueA",
  "bid": "91200.50",
  "ask": "91280.90",
  "mid": "91240.70",
  "ts": "2025-11-17T19:28:05Z",
  "schema_ver": "1"
}

Keterangan Informasi yang Belum Tersedia

 beberapa informasi rinci belum ditetapkan dan perlu konfirmasi pada iterasi berikutnya:
- Daftar exchange, feed, dan endpoint API spesifik, termasuk rate limits dan skema autentikasi.
- Persyaratan bisnis formal untuk latensi, throughput, SLO/SLA, dan target ketersediaan.
- Kebijakan compliance, termasuk jurisdiksi, kebijakan penyimpanan data (retensi, enkripsi at-rest, audit), dan persyaratan data residency.
- Strategi dan batasan biaya, termasuk preferensi antara managed services vs self-hosted.
- Detail teknis Telegram Bot API (command set, webhook vs long polling, token management).
- Kebutuhan fitur admin (manajemen pengguna, role definitions, audit).
- Preferensi teknologi (bahasa pemrograman, framework, RDBMS, broker pesan).
- Rincian formula arbitrase (komponen spread, biaya, slippage, risk parameters).

Penutup

 Arsitektur ini menyajikan fondasi yang dapat dieksekusi untuk platform arbitrase kripto denganSRP sebagai principio penyatu dan komponen通用 sebagai tulang punggung reuse. Desain event-driven memfasilitasi skalabilitas dan respons real-time, sementara ACL menjaga kebersihan domain internal. Dengan tahapan implementasi yang terukur, Observabilitas menyeluruh, dan keamanan yang ketat, platform siap berkembang dari MVP menuju layanan produksi yang andal dan berkinerja tinggi.