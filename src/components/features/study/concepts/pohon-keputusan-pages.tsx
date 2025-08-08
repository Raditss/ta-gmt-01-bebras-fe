import { Card, CardContent } from '@/components/ui/card';
import {
  AlertTriangle,
  BarChart3,
  GitBranch,
  Leaf,
  Lightbulb,
  PenTool,
  TreePine,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Page 1: Introduction to Decision Trees
export const DecisionTreeIntroPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
        <TreePine className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Apa itu Pohon Keputusan?
      </h1>
      <p className="text-lg text-gray-600">
        Pohon Keputusan adalah sebuah bagan yang mirip seperti pohon dengan
        ranting dan daun. Setiap ranting dan daun dalam bagan pohon mewakili
        pertimbangan yang bisa membantu dalam pengambilan keputusan.
      </p>
    </div>

    <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-200">
      <h3 className="text-2xl font-bold text-green-800 mb-4">
        Definisi Pohon Keputusan
      </h3>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        Pohon keputusan merupakan representasi grafis yang menyerupai struktur
        bercabang untuk membantu proses pengambilan keputusan secara bertahap
        dan terstruktur. Setiap cabang merepresentasikan sebuah kondisi atau
        pernyataan, sedangkan simpul akhir atau daun menggambarkan keputusan
        akhir dari serangkaian pertimbangan tersebut.
      </p>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
        <h4 className="font-semibold text-green-800 mb-2">Contoh Sederhana:</h4>
        <div className="text-sm text-green-700 bg-green-100 p-3 rounded font-mono">
          <div>Cuaca = Cerah?</div>
          <div>├─ Ya → Main Outdoor</div>
          <div>└─ Tidak → Main Indoor</div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl border-2 border-blue-300">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">
        Komponen Pohon Keputusan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <TreePine className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Simpul Akar</h4>
          <p className="text-sm text-gray-600">
            Titik awal pohon yang berisi seluruh dataset
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <GitBranch className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Cabang</h4>
          <p className="text-sm text-gray-600">
            Penghubung antar simpul berdasarkan kondisi tertentu
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Simpul Daun</h4>
          <p className="text-sm text-gray-600">
            Simpul terminal yang berisi keputusan akhir
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Page 2: How Decision Trees Work
export const DecisionTreeWorkingPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <PenTool className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Cara Membuat Pohon Keputusan
      </h1>
      <p className="text-lg text-gray-600">
        Panduan langkah demi langkah membuat pohon keputusan
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Pendekatan Manual</h3>
            <p className="text-blue-100">
              Cara tradisional membuat pohon keputusan
            </p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Tentukan Tujuan
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tuliskan keputusan akhir yang ingin dibuat di simpul daun
                  </p>
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <span className="text-xs text-blue-700">
                      Contoh: &#34;Beli rumah&#34; vs &#34;Tidak beli rumah&#34;
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Identifikasi Faktor
                  </h4>
                  <p className="text-sm text-gray-600">
                    Buat daftar semua faktor yang mempengaruhi keputusan
                  </p>
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <span className="text-xs text-blue-700">
                      Contoh: Harga, lokasi, ukuran, kondisi
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Buat Pertanyaan
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ubah setiap faktor menjadi pertanyaan ya/tidak
                  </p>
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <span className="text-xs text-blue-700">
                      Contoh: &#34;Harga ≤ 500 juta?&#34;
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Susun Hierarki
                  </h4>
                  <p className="text-sm text-gray-600">
                    Urutkan pertanyaan dari yang paling penting ke yang kurang
                    penting
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Tips Efektif
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Mulai dengan faktor yang paling berpengaruh</li>
            <li>• Gunakan pertanyaan yang mudah dijawab ya/tidak</li>
            <li>• Batasi kedalaman pohon agar tidak terlalu kompleks</li>
            <li>• Uji setiap jalur dengan contoh nyata</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Pendekatan Sistematis</h3>
            <p className="text-green-100">Menggunakan metode terstruktur</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-800">
                  RBDT (Rule-Based Decision Tree)
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Pendekatan yang menggunakan aturan-aturan logika untuk
                  membangun pohon
                </p>
                <div className="bg-green-50 p-4 rounded border">
                  <div className="text-sm space-y-2">
                    <div className="font-semibold">Langkah RBDT:</div>
                    <div>1. Kumpulkan semua aturan bisnis</div>
                    <div>2. Prioritaskan aturan berdasarkan kepentingan</div>
                    <div>3. Konversi aturan menjadi kondisi if-then</div>
                    <div>4. Susun dalam struktur pohon</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-800">
                  Decision Analysis
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Menggunakan analisis probabilitas dan nilai ekspektasi
                </p>
                <div className="bg-green-50 p-4 rounded border">
                  <div className="text-sm space-y-2">
                    <div className="font-semibold">Komponen:</div>
                    <div>• Probabilitas setiap outcome</div>
                    <div>• Nilai atau biaya setiap pilihan</div>
                    <div>• Expected value calculation</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
          <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Hal yang Perlu Dihindari
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Membuat pohon terlalu dalam dan kompleks</li>
            <li>• Mengabaikan faktor penting</li>
            <li>• Tidak mempertimbangkan probabilitas</li>
            <li>• Tidak melakukan validasi dengan data real</li>
            <li>• Bias dalam menentukan prioritas faktor</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Page 3: Applications and Examples
export const DecisionTreeApplicationsPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
        <BarChart3 className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Aplikasi Decision Tree
      </h1>
      <p className="text-lg text-gray-600">
        Decision Tree digunakan dalam berbagai bidang
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Medical Diagnosis</h3>
          <p className="text-blue-100 text-sm">Diagnosa penyakit</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Dokter menggunakan decision tree untuk mendiagnosa penyakit
            berdasarkan gejala-gejala pasien.
          </p>
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-xs text-blue-700 font-mono">
              <div>Demam ≥ 38°C?</div>
              <div>├─ Ya → Cek batuk</div>
              <div>└─ Tidak → Cek gejala lain</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Credit Scoring</h3>
          <p className="text-green-100 text-sm">Penilaian kredit</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Bank menggunakan decision tree untuk menentukan apakah seseorang
            layak mendapat pinjaman.
          </p>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-xs text-green-700 font-mono">
              <div>Gaji ≥ 5 juta?</div>
              <div>├─ Ya → Cek riwayat kredit</div>
              <div>└─ Tidak → Tolak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Customer Segmentation</h3>
          <p className="text-purple-100 text-sm">Segmentasi pelanggan</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Perusahaan menggunakan decision tree untuk mengelompokkan pelanggan
            berdasarkan perilaku pembelian.
          </p>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-xs text-purple-700 font-mono">
              <div>Usia ≥ 30?</div>
              <div>├─ Ya → Premium Customer</div>
              <div>└─ Tidak → Regular Customer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Fraud Detection</h3>
          <p className="text-orange-100 text-sm">Deteksi penipuan</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Sistem pembayaran menggunakan decision tree untuk mendeteksi
            transaksi yang mencurigakan.
          </p>
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-xs text-orange-700 font-mono">
              <div>Jumlah ≥ 10 juta?</div>
              <div>├─ Ya → Cek lokasi</div>
              <div>└─ Tidak → Normal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Email Filtering</h3>
          <p className="text-teal-100 text-sm">Filter email spam</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Sistem email menggunakan decision tree untuk memisahkan email spam
            dari email normal.
          </p>
          <div className="bg-teal-50 p-3 rounded">
            <div className="text-xs text-teal-700 font-mono">
              <div>Kata &quot;GRATIS&quot; ada?</div>
              <div>├─ Ya → Cek sender</div>
              <div>└─ Tidak → Normal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Weather Prediction</h3>
          <p className="text-yellow-100 text-sm">Prediksi cuaca</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Meteorologi menggunakan decision tree untuk memprediksi cuaca
            berdasarkan data historis.
          </p>
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-xs text-yellow-700 font-mono">
              <div>Kelembaban ≥ 80%?</div>
              <div>├─ Ya → Hujan</div>
              <div>└─ Tidak → Cerah</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Page 4: Anomaly Monster Interactive Problem
export const AnomalyMonsterInteractivePage = () => {
  const router = useRouter();

  const startAnomalyMonsterProblem = () => {
    sessionStorage.removeItem('generatedQuestion');
    router.push(`/problems/generated/anomaly-monster/solve`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <Target className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Anomaly Monster: Deteksi Monster dengan Pohon Keputusan
        </h1>
        <p className="text-lg text-gray-600">
          Coba belajar menggunakan pohon keputusan melalui soal interaktif yang
          menyenangkan!
        </p>
      </div>

      {/* Anomaly Monster Explanation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-3xl border-2 border-green-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Cara Kerja Anomaly Monster
          </h2>
          <p className="text-lg text-green-700 max-w-3xl mx-auto">
            Gunakan pohon keputusan untuk menganalisis karakteristik monster dan
            menentukan apakah mereka normal atau terinfeksi virus misterius.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-lg">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Langkah-langkah
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Lihat Monster
                  </h4>
                  <p className="text-sm text-gray-600">
                    Amati monster yang sedang diperiksa dengan teliti
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Isi Form Analisis
                  </h4>
                  <p className="text-sm text-gray-600">
                    Catat karakteristik monster: warna, bentuk tubuh, dan mulut
                    di form
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Lihat Jalur Pohon
                  </h4>
                  <p className="text-sm text-gray-600">
                    Saat mengisi form, jalur di pohon keputusan akan tersorot
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Gunakan Pohon Keputusan
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ikuti jalur yang tersorot untuk menentukan hasil klasifikasi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Klasifikasi Monster
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tentukan apakah monster normal atau terinfeksi berdasarkan
                    hasil pohon
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Ulangi untuk Semua
                  </h4>
                  <p className="text-sm text-gray-600">
                    Lakukan langkah 1-5 hingga semua monster telah
                    diklasifikasikan
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-lg">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Fitur Anomaly Monster
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Visualisasi pohon keputusan interaktif
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Form analisis karakteristik monster
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Monster dengan berbagai karakteristik unik
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Tracking progress klasifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-6">
            Mulai Latihan Anomaly Monster
          </h3>
          <Button
            onClick={startAnomalyMonsterProblem}
            className="bg-green-500 hover:bg-green-600 text-white h-16 text-xl font-bold transition-all hover:scale-105 px-8"
          >
            🎯 Mulai Latihan Anomaly Monster
          </Button>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-300">
        <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          🏝️ Cerita Monster di Pulau Misterius
        </h3>
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-lg">
          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              Di <strong className="text-blue-600">Pulau Monster</strong>, para
              ilmuwan menemukan adanya{' '}
              <strong className="text-red-600">virus misterius</strong> yang
              menginfeksi beberapa monster dan mengubah karakteristik mereka.
            </p>
            <p className="leading-relaxed">
              Untungnya, para peneliti telah membuat{' '}
              <strong className="text-green-600">
                pohon keputusan monster yang normal
              </strong>{' '}
              yang dapat membantu mengidentifikasi monster mana yang normal dan
              mana yang terinfeksi berdasarkan{' '}
              <strong>warna, bentuk tubuh, dan mulut</strong> mereka.
            </p>
            <p className="leading-relaxed">
              Sebagai peneliti monster, tugasmu adalah menggunakan pohon
              keputusan ini untuk menganalisis setiap monster yang ditemukan dan
              menentukan status kesehatan mereka!
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-3xl border-2 border-yellow-300">
        <h3 className="text-2xl font-bold text-yellow-800 mb-6 text-center">
          💡 Tips untuk Anomaly Monster
        </h3>
        <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-lg">
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Amati setiap monster dengan teliti sebelum mengisi form</li>
            <li>
              • Isi form analisis secara lengkap untuk setiap karakteristik
            </li>
            <li>• Perhatikan jalur yang ter-highlight saat mengisi form</li>
            <li>
              • Ikuti jalur pohon keputusan secara sistematis dari akar ke daun
            </li>
            <li>• Gunakan hasil akhir pohon untuk menentukan klasifikasi</li>
            <li>
              • Periksa kembali hasil sebelum melanjutkan ke monster berikutnya
            </li>
            <li>• Lakukan proses ini untuk semua monster hingga selesai</li>
            <li>• Manfaatkan fitur reset jika ingin menganalisis ulang</li>
          </ul>
        </div>
      </div>

      {/* Challenge Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border-2 border-purple-300">
        <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          🎮 Tantangan Peneliti Monster
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-purple-200 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h4 className="font-bold text-purple-800 mb-2">Analisis Teliti</h4>
            <p className="text-sm text-gray-600">
              Periksa setiap detail karakteristik monster dengan cermat
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-purple-200 text-center">
            <div className="text-3xl mb-2">🌳</div>
            <h4 className="font-bold text-purple-800 mb-2">Pahami Pohon</h4>
            <p className="text-sm text-gray-600">
              Gunakan pohon keputusan sebagai panduan klasifikasi
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-purple-200 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="font-bold text-purple-800 mb-2">
              Klasifikasi Akurat
            </h4>
            <p className="text-sm text-gray-600">
              Tentukan status setiap monster dengan tepat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
