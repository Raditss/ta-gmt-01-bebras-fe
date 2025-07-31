import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, TrendingUp } from 'lucide-react';

export default function HalamanUtama() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/graphic/Solvio-logo.svg"
            alt="logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-800">
            Fitur
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-gray-800">
            Tentang
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800">
            Masuk
          </Link>
          <Button asChild>
            <Link href="/register">Daftar</Link>
          </Button>
        </nav>
      </header>

      {/* Bagian Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              Kembangkan Keterampilan Berpikir Komputasionalmu dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Solvio
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Tantang dirimu dengan soal-soal kami dan bersainglah dengan yang
              lain untuk mencapai peringkat tertinggi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Mulai</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Jelajahi Soal</Link>
              </Button>
            </div>
          </div>
          <div className="relative drop-shadow-2xl ml-18">
            <Image
              src="/graphic/landing-page.svg"
              alt="solvio"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* Bagian Fitur */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Mengapa Memilih Solvio?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Platform kami menawarkan cara interaktif untuk mempelajari
            keterampilan berpikir komputasional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Kumpulan Soal yang Beragam
              </h3>
              <p className="text-gray-600">
                Akses semua soal yang disediakan untuk berbagai topik.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Lacak Kemajuanmu
              </h3>
              <p className="text-gray-600">
                Pantau perjalanan belajarmu dengan analitik terperinci dan
                pelacakan kemajuan.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Bersaing & Berkolaborasi
              </h3>
              <p className="text-gray-600">
                Bergabunglah untuk berkompetisi dan belajar bersama dengan
                teman-temanmu.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bagian Ajakan Bertindak (CTA) */}
      <section className="bg-gradient-to-r from-purple-500 to-blue-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap Memulai Perjalanan Berpikir Komputasionalmu?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan solver-solver lainnya yang telah meningkatkan
            keterampilan berpikir komputasional mereka.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Mulai Gratis</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
                <span className="text-xl font-bold">Solvio</span>
              </div>
              <p className="text-gray-400">
                Memberdayakan generasi pemikir komputasional berikutnya.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/problems">Soal</Link>
                </li>
                <li>
                  <Link href="/leaderboard">Papan Peringkat</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dasbor</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hukum</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy">Kebijakan Privasi</Link>
                </li>
                <li>
                  <Link href="/terms">Ketentuan Layanan</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 solvio. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
