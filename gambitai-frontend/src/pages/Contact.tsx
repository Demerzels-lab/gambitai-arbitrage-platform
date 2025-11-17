import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TrendingUp, Mail, MessageSquare, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Harga</Link>
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
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-300">
            Ada pertanyaan? Tim kami siap membantu Anda. Hubungi kami melalui form di bawah atau kontak langsung.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6">Kirim Pesan</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500 rounded-lg">
                  <p className="text-emerald-500">Pesan Anda telah terkirim! Kami akan merespons dalam 24 jam.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Nama Anda"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Pertanyaan tentang..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Informasi Kontak</h2>
                <p className="text-gray-400 mb-8">
                  Kami tersedia untuk menjawab pertanyaan Anda dan membantu Anda memulai dengan GambitAI.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex items-start">
                  <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">support@gambitai.com</p>
                    <p className="text-gray-500 text-sm mt-1">Respon dalam 24 jam</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex items-start">
                  <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-400">Tersedia di dashboard</p>
                    <p className="text-gray-500 text-sm mt-1">Senin - Jumat, 09:00 - 18:00 WIB</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex items-start">
                  <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Kantor</h3>
                    <p className="text-gray-400">Jakarta, Indonesia</p>
                    <p className="text-gray-500 text-sm mt-1">By appointment only</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h3 className="text-white font-semibold mb-4">Jam Operasional</h3>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between">
                    <span>Senin - Jumat</span>
                    <span className="text-white">09:00 - 18:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sabtu</span>
                    <span className="text-white">10:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu</span>
                    <span className="text-gray-500">Tutup</span>
                  </div>
                </div>
              </div>

              {/* Enterprise */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-6 rounded-xl border border-emerald-500/30">
                <h3 className="text-white font-semibold mb-2">Enterprise Solutions</h3>
                <p className="text-gray-400 mb-4">
                  Butuh solusi custom atau integrasi khusus? Tim sales kami siap membantu.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm"
                >
                  Lihat Paket Enterprise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-gray-400">
              Mungkin jawaban Anda sudah ada di sini
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Bagaimana cara memulai?</h3>
              <p className="text-gray-400 text-sm">
                Daftar gratis, atur preferensi alert, dan mulai terima notifikasi peluang arbitrase.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Apakah ada trial period?</h3>
              <p className="text-gray-400 text-sm">
                Paket Free tersedia selamanya. Tidak perlu kartu kredit untuk memulai.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Platform apa yang didukung?</h3>
              <p className="text-gray-400 text-sm">
                Saat ini kami mendukung Polymarket dan Kalshi dengan rencana ekspansi ke platform lain.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Bagaimana dengan keamanan data?</h3>
              <p className="text-gray-400 text-sm">
                Semua data dienkripsi end-to-end dan disimpan di server yang aman dengan backup rutin.
              </p>
            </div>
          </div>
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
