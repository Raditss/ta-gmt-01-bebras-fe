import { Card, CardContent } from '@/components/ui/card';
import {
  TreePine,
  GitFork,
  Target,
  BarChart3,
  Brain,
  TrendingUp
} from 'lucide-react';

// Page 1: Introduction to Decision Trees
export const DecisionTreeIntroPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
        <TreePine className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Apa itu Decision Tree?
      </h1>
      <p className="text-lg text-gray-600">
        Decision Tree adalah algoritma machine learning yang mudah dipahami
      </p>
    </div>

    <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-200">
      <h3 className="text-2xl font-bold text-green-800 mb-4">Definisi</h3>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        Decision Tree (Pohon Keputusan) adalah model machine learning yang
        bekerja seperti diagram alur untuk membuat keputusan. Bayangkan seperti
        permainan &quot;20 Questions&quot; - kita bertanya serangkaian
        pertanyaan ya/tidak untuk mencapai kesimpulan.
      </p>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
        <h4 className="font-semibold text-green-800 mb-2">Contoh Sederhana:</h4>
        <div className="text-sm text-green-700 bg-green-100 p-3 rounded font-mono">
          <div>Cuaca = Cerah?</div>
          <div>├─ Ya → Main Outdoor</div>
          <div>└─ Tidak → Main Indoor</div>
        </div>
        <p className="text-sm text-green-600 mt-2">
          Ini adalah decision tree sederhana untuk memutuskan aktivitas
          berdasarkan cuaca.
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl border-2 border-blue-300">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">
        Mengapa Decision Tree Populer?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Mudah Dipahami</h4>
          <p className="text-sm text-gray-600">
            Strukturnya seperti diagram alur yang familiar
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <GitFork className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Tidak Perlu Preprocessing</h4>
          <p className="text-sm text-gray-600">
            Bisa bekerja dengan data kategorikal dan numerik
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Akurasi Tinggi</h4>
          <p className="text-sm text-gray-600">
            Performa yang baik untuk banyak jenis masalah
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
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
        <GitFork className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Cara Kerja Decision Tree
      </h1>
      <p className="text-lg text-gray-600">
        Memahami proses pembentukan pohon keputusan
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Konsep Utama</h3>
            <p className="text-blue-100">Memahami komponen decision tree</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800">Root Node</h4>
                <p className="text-sm text-gray-600">
                  Node paling atas yang berisi seluruh dataset
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800">Internal Node</h4>
                <p className="text-sm text-gray-600">
                  Node yang berisi kondisi/pertanyaan untuk split
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800">Leaf Node</h4>
                <p className="text-sm text-gray-600">
                  Node terakhir yang berisi prediksi/keputusan final
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Algoritma Splitting</h3>
            <p className="text-green-100">Cara menentukan split terbaik</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Information Gain</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Mengukur seberapa banyak informasi yang didapat dari split
                </p>
                <div className="bg-green-50 p-3 rounded border">
                  <code className="text-xs text-green-700">
                    Gain = Entropy(parent) - Weighted Entropy(children)
                  </code>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gini Impurity</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Mengukur &quot;ketidakmurnian&quot; data dalam node
                </p>
                <div className="bg-green-50 p-3 rounded border">
                  <code className="text-xs text-green-700">
                    Gini = 1 - Σ(pi)²
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">
            Langkah-langkah Pembentukan
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <strong>Mulai dengan Root Node</strong>
                <p className="text-sm text-gray-600">
                  Semua data training di root
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <strong>Pilih Feature Terbaik</strong>
                <p className="text-sm text-gray-600">
                  Gunakan Information Gain atau Gini
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <strong>Split Data</strong>
                <p className="text-sm text-gray-600">
                  Bagi data berdasarkan feature terpilih
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <strong>Ulangi Rekursif</strong>
                <p className="text-sm text-gray-600">
                  Lanjutkan sampai kondisi stop
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
          <h3 className="text-xl font-semibold mb-4 text-purple-800">
            Kondisi Berhenti
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Semua data dalam node memiliki class yang sama</li>
            <li>• Tidak ada feature yang tersisa untuk split</li>
            <li>• Mencapai kedalaman maksimum yang ditentukan</li>
            <li>• Jumlah sampel dalam node terlalu sedikit</li>
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

    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl border">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Kelebihan dan Kekurangan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-green-200">
          <h4 className="font-bold mb-3 text-green-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Kelebihan
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Mudah dipahami dan diinterpretasi</li>
            <li>• Tidak memerlukan normalisasi data</li>
            <li>• Bisa menangani data missing</li>
            <li>• Cepat dalam training dan prediksi</li>
            <li>• Bisa digunakan untuk feature selection</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-red-200">
          <h4 className="font-bold mb-3 text-red-800">Kekurangan</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Rentan terhadap overfitting</li>
            <li>• Bias terhadap feature dengan banyak nilai</li>
            <li>• Tidak stabil (sensitif terhadap perubahan data)</li>
            <li>• Sulit menangani hubungan linear</li>
            <li>• Performa menurun pada dataset besar</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
