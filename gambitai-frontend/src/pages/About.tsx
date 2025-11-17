import { Link } from 'react-router-dom';
import { TrendingUp, Target, Zap, Users } from 'lucide-react';

export default function About() {
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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tentang GambitAI
          </h1>
          <p className="text-xl text-gray-300">
            Platform deteksi arbitrase berbasis AI yang membantu trader menemukan peluang profit risk-free di prediction market
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Misi Kami</h2>
              <p className="text-gray-300 text-lg mb-4">
                GambitAI didirikan dengan misi untuk mendemokratisasi akses ke strategi trading arbitrase yang sebelumnya hanya tersedia untuk institusi dan trader profesional.
              </p>
              <p className="text-gray-300 text-lg mb-4">
                Kami percaya bahwa setiap trader, terlepas dari level pengalaman mereka, berhak mendapatkan akses ke tools dan data berkualitas tinggi untuk membuat keputusan trading yang lebih baik.
              </p>
              <p className="text-gray-300 text-lg">
                Dengan memanfaatkan teknologi AI dan monitoring real-time, kami membantu trader mengidentifikasi dan mengeksekusi peluang arbitrase dengan cepat dan efisien.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-12 rounded-2xl border border-emerald-500/30">
              <div className="text-center">
                <div className="text-6xl font-bold text-emerald-500 mb-2">1,000+</div>
                <div className="text-gray-300 text-lg mb-8">Peluang Arbitrase Terdeteksi</div>
                <div className="text-6xl font-bold text-blue-500 mb-2">24/7</div>
                <div className="text-gray-300 text-lg mb-8">Monitoring Tanpa Henti</div>
                <div className="text-6xl font-bold text-purple-500 mb-2">95%</div>
                <div className="text-gray-300 text-lg">Tingkat Akurasi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nilai-Nilai Kami</h2>
            <p className="text-xl text-gray-400">Prinsip yang memandu setiap keputusan kami</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Akurasi</h3>
              <p className="text-gray-400">
                Kami berkomitmen untuk memberikan data dan analisis yang akurat dan dapat diandalkan untuk setiap keputusan trading Anda.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Kecepatan</h3>
              <p className="text-gray-400">
                Peluang arbitrase muncul dan hilang dalam hitungan detik. Sistem kami memastikan Anda selalu selangkah lebih cepat.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Transparansi</h3>
              <p className="text-gray-400">
                Kami percaya pada transparansi total dalam metodologi deteksi dan perhitungan profit kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Teknologi Kami</h2>
            <p className="text-xl text-gray-400">Infrastruktur canggih untuk deteksi arbitrase real-time</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Data Processing</h3>
              <p className="text-gray-400 mb-4">
                Sistem kami memproses data dari multiple sources secara simultan menggunakan WebSocket connections untuk memastikan tidak ada peluang yang terlewat.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Polymarket WebSocket API
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Kalshi REST API Integration
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Sub-second latency monitoring
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Detection</h3>
              <p className="text-gray-400 mb-4">
                Algoritma machine learning kami menganalisis pola pasar dan mengidentifikasi peluang arbitrase dengan tingkat akurasi tinggi.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Pattern recognition algorithms
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Risk assessment models
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Profit optimization calculations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Bergabunglah Dengan Kami
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Mulai journey Anda dalam arbitrage trading hari ini
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
