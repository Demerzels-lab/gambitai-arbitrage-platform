import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, Shield, Bell, BarChart3, Calculator } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-emerald-500" />
              <span className="text-2xl font-bold text-white">GambitAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">Tentang</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Harga</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Kontak</Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Masuk</Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Mulai Gratis
              </Link>
            </div>
            <div className="md:hidden">
              <Link to="/signup" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">
                Mulai
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Deteksi Peluang Arbitrase
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Secara Real-Time
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Platform berbasis AI yang mendeteksi peluang arbitrase antara Polymarket dan Kalshi. 
              Dapatkan profit risk-free dengan notifikasi instan dan analisis data real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup"
                className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-emerald-500/50"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg border border-gray-700"
              >
                Lihat Demo
              </Link>
            </div>
            <p className="mt-6 text-gray-400 text-sm">
              Tidak perlu kartu kredit. Mulai dalam 30 detik.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-500 mb-2">1,000+</div>
              <div className="text-gray-400">Peluang Terdeteksi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-400">Monitoring Real-Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">95%</div>
              <div className="text-gray-400">Akurasi Deteksi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">&lt;1s</div>
              <div className="text-gray-400">Notifikasi Instan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengidentifikasi dan memanfaatkan peluang arbitrase
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-emerald-500 transition-colors">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deteksi Real-Time</h3>
              <p className="text-gray-400">
                Sistem monitoring 24/7 yang mendeteksi peluang arbitrase dalam hitungan detik
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Notifikasi Telegram</h3>
              <p className="text-gray-400">
                Dapatkan alert instan melalui Telegram untuk setiap peluang arbitrase baru
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analisis Mendalam</h3>
              <p className="text-gray-400">
                Dashboard analitik lengkap dengan data historis dan tren pasar
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kalkulator Profit</h3>
              <p className="text-gray-400">
                Hitung potensi profit Anda dengan kalkulator arbitrase yang akurat
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-pink-500 transition-colors">
              <div className="h-12 w-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Risk-Free Trading</h3>
              <p className="text-gray-400">
                Arbitrase adalah strategi trading tanpa risiko dengan profit terjamin
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-cyan-500 transition-colors">
              <div className="h-12 w-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Market</h3>
              <p className="text-gray-400">
                Monitoring simultan di Polymarket dan Kalshi untuk peluang maksimal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tiga langkah sederhana untuk mulai mendapatkan profit dari arbitrase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Daftar Gratis</h3>
              <p className="text-gray-400">
                Buat akun dalam 30 detik. Tidak perlu kartu kredit atau biaya tersembunyi.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Atur Preferensi</h3>
              <p className="text-gray-400">
                Konfigurasi alert Telegram dan tentukan threshold profit minimum Anda.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ambil Aksi</h3>
              <p className="text-gray-400">
                Terima notifikasi real-time dan eksekusi trade untuk mendapatkan profit risk-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Harga Transparan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan trading Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Rp 0</span>
                <span className="text-gray-400">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  10 alert per hari
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Akses dashboard basic
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Data historis 7 hari
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold border border-gray-700"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-emerald-900/50 to-gray-900 p-8 rounded-xl border-2 border-emerald-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULER
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Rp 299K</span>
                <span className="text-gray-400">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Alert unlimited
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Dashboard lengkap + analitik
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Data historis 90 hari
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Telegram bot premium
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center font-semibold"
              >
                Mulai Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Semua fitur Pro
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  API access
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Data historis unlimited
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Custom integration
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  24/7 dedicated support
                </li>
              </ul>
              <Link
                to="/contact"
                className="block w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold border border-gray-700"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Memulai Trading Arbitrase?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Bergabung dengan trader cerdas yang menggunakan GambitAI untuk profit konsisten
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-emerald-500/50"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="h-5 w-5" />
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
