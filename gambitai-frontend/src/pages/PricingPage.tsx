import { Link } from 'react-router-dom';
import { TrendingUp, Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-emerald-500" />
              <span className="text-2xl font-bold text-white">GambitAI</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Beranda</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">Tentang</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Kontak</Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Masuk</Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Mulai Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Harga yang Sesuai untuk Semua
          </h1>
          <p className="text-xl text-gray-300">
            Pilih paket yang tepat untuk kebutuhan trading Anda. Upgrade atau downgrade kapan saja.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <p className="text-gray-400 mb-6">Untuk memulai dan mencoba platform</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">Rp 0</span>
                </div>
                <p className="text-gray-400">Selamanya gratis</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>10 alert notifikasi per hari</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Akses dashboard basic</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Data historis 7 hari</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Kalkulator arbitrase</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Email support (48 jam)</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-3">✗</span>
                  <span>Telegram bot premium</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-3">✗</span>
                  <span>Advanced analytics</span>
                </li>
              </ul>

              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold border border-gray-700"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-emerald-900/50 to-gray-900 p-8 rounded-2xl border-2 border-emerald-500 relative transform md:scale-105 shadow-2xl shadow-emerald-500/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-1 rounded-full text-sm font-semibold">
                PALING POPULER
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">Untuk trader serius yang menginginkan fitur lengkap</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">Rp 299K</span>
                  <span className="text-gray-400 text-lg">/bulan</span>
                </div>
                <p className="text-gray-400">atau Rp 2.990K/tahun (hemat 17%)</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Alert notifikasi unlimited</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Dashboard lengkap dengan analytics</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Data historis 90 hari</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Kalkulator arbitrase advanced</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Telegram bot premium dengan instant alerts</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Custom alert threshold</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Priority support (24 jam)</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-3">✗</span>
                  <span>API access</span>
                </li>
              </ul>

              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center font-semibold shadow-lg"
              >
                Mulai Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-6">Untuk organisasi dan trader institusi</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">Custom</span>
                </div>
                <p className="text-gray-400">Hubungi untuk pricing</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Semua fitur Pro</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>API access dengan rate limit tinggi</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Data historis unlimited</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Custom integration & webhooks</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>SLA guarantee</span>
                </li>
              </ul>

              <Link
                to="/contact"
                className="block w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold border border-gray-700"
              >
                Hubungi Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Pertanyaan Umum
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Apakah saya bisa upgrade atau downgrade paket kapan saja?
              </h3>
              <p className="text-gray-400">
                Ya, Anda bisa upgrade atau downgrade paket kapan saja. Perubahan akan berlaku pada periode billing berikutnya.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Apakah ada biaya tersembunyi?
              </h3>
              <p className="text-gray-400">
                Tidak ada biaya tersembunyi. Harga yang tertera sudah final dan tidak ada biaya tambahan.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Bagaimana cara pembayaran?
              </h3>
              <p className="text-gray-400">
                Kami menerima pembayaran melalui transfer bank, e-wallet (GoPay, OVO, Dana), dan kartu kredit. Untuk paket Enterprise, kami juga menerima invoice payment.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Apakah ada garansi uang kembali?
              </h3>
              <p className="text-gray-400">
                Ya, kami menawarkan garansi uang kembali 14 hari untuk paket berbayar jika Anda tidak puas dengan layanan kami.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Apakah data saya aman?
              </h3>
              <p className="text-gray-400">
                Keamanan data adalah prioritas kami. Semua data dienkripsi dan disimpan di server yang aman dengan backup rutin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Memulai?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Mulai dengan paket Free dan upgrade kapan saja sesuai kebutuhan Anda
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
          >
            Mulai Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
                <span className="text-xl font-bold text-white">GambitAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform deteksi arbitrase berbasis AI untuk trader prediction market.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produk</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white text-sm">Dashboard</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Harga</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white text-sm">Daftar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">Tentang Kami</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2025 GambitAI. Semua hak dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
