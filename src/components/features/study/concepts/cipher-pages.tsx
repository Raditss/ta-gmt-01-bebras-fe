import { Card, CardContent } from '@/components/ui/card';
import { Lock, Key, Eye, Settings, Code, Cpu, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Page 1: Introduction to Ciphers
export const CryptographyIntroPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <Code className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Apa itu Cipher?</h1>
      <p className="text-lg text-gray-600">
        Cipher adalah algoritma untuk mengubah pesan menjadi kode rahasia
      </p>
    </div>

    <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-200">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Definisi Cipher</h3>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        Cipher adalah metode sistematis untuk mengubah teks biasa (plaintext)
        menjadi teks terenkripsi (ciphertext) menggunakan algoritma matematika
        tertentu. Proses ini membutuhkan kunci untuk enkripsi dan dekripsi.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          Contoh Caesar Cipher:
        </h4>
        <pre className="text-sm text-blue-700 whitespace-pre-wrap font-mono bg-blue-100 p-3 rounded">
          <code>
            Plaintext: &quot;HELLO WORLD&quot;
            <br />
            Key: Shift 3
            <br />
            Ciphertext: &quot;KHOOR ZRUOG&quot;
            <br />
            <br />A → D, B → E, C → F, ..., Z → C
          </code>
        </pre>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl border-2 border-green-300">
      <h3 className="text-2xl font-bold text-green-800 mb-4">
        Komponen Cipher
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Plaintext</h4>
          <p className="text-sm text-gray-600">
            Pesan asli yang akan dienkripsi
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Key</h4>
          <p className="text-sm text-gray-600">
            Kunci untuk enkripsi dan dekripsi
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Ciphertext</h4>
          <p className="text-sm text-gray-600">
            Hasil enkripsi yang tidak terbaca
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Page 2: Types of Ciphers
export const EncryptionTypesPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
        <Settings className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Jenis-jenis Cipher
      </h1>
      <p className="text-lg text-gray-600">Dari cipher klasik hingga modern</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Cipher Klasik</h3>
          <p className="text-blue-100">
            Cipher yang digunakan sebelum era komputer
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Cipher klasik menggunakan teknik substitusi dan transposisi
              sederhana. Mudah dipahami tapi tidak aman untuk standar modern.
            </p>
            <div className="bg-blue-50 p-3 rounded border">
              <h4 className="font-semibold mb-2">Contoh:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Caesar Cipher (Substitusi)</li>
                <li>• Vigenère Cipher (Substitusi)</li>
                <li>• Rail Fence Cipher (Transposisi)</li>
                <li>• Playfair Cipher (Digraph)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Cipher Modern</h3>
          <p className="text-green-100">
            Cipher yang menggunakan algoritma kompleks
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Cipher modern menggunakan operasi matematika kompleks, multiple
              rounds, dan key scheduling yang canggih untuk keamanan tinggi.
            </p>
            <div className="bg-green-50 p-3 rounded border">
              <h4 className="font-semibold mb-2">Contoh:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• AES (Advanced Encryption Standard)</li>
                <li>• DES (Data Encryption Standard)</li>
                <li>• RSA (Asymmetric)</li>
                <li>• ChaCha20 (Stream Cipher)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
      <h3 className="text-xl font-semibold mb-4 text-yellow-800">
        Perbandingan Cipher
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Cipher Klasik:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Mudah dipahami dan diimplementasi</li>
            <li>• Keamanan rendah</li>
            <li>• Rentan terhadap analisis frekuensi</li>
            <li>• Cocok untuk pembelajaran</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-green-800 mb-2">Cipher Modern:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Algoritma kompleks dan aman</li>
            <li>• Keamanan tinggi</li>
            <li>• Tahan terhadap serangan kriptanalisis</li>
            <li>• Digunakan dalam aplikasi nyata</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Page 3: Modern Ciphers
export const CryptographyApplicationsPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <Cpu className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Cipher Modern</h1>
      <p className="text-lg text-gray-600">
        Algoritma enkripsi yang digunakan saat ini
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">AES</h3>
          <p className="text-blue-100 text-sm">Advanced Encryption Standard</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Cipher block simetris yang menjadi standar enkripsi dunia.
            Menggunakan 128, 192, atau 256-bit key dengan multiple rounds.
          </p>
          <div className="bg-blue-50 p-3 rounded">
            <code className="text-xs text-blue-700">
              Key Size: 128/192/256 bit
              <br />
              Block Size: 128 bit
              <br />
              Rounds: 10/12/14
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">RSA</h3>
          <p className="text-green-100 text-sm">Rivest-Shamir-Adleman</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Cipher asimetris berbasis masalah faktorisasi bilangan prima.
            Menggunakan public key untuk enkripsi, private key untuk dekripsi.
          </p>
          <div className="bg-green-50 p-3 rounded">
            <span className="text-xs text-green-700">
              Public Key: (n, e)
              <br />
              Private Key: (n, d)
              <br />
              Security: 2048+ bit
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">ChaCha20</h3>
          <p className="text-orange-100 text-sm">Stream Cipher</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Stream cipher yang cepat dan aman, digunakan dalam TLS dan protokol
            keamanan modern. Berbasis fungsi hash.
          </p>
          <div className="bg-orange-50 p-3 rounded">
            <span className="text-xs text-orange-700">
              Key Size: 256 bit
              <br />
              Nonce: 96 bit
              <br />
              Rounds: 20
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">ECC</h3>
          <p className="text-purple-100 text-sm">Elliptic Curve Cryptography</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Cipher asimetris berbasis kurva eliptik. Memberikan keamanan yang
            sama dengan RSA tapi dengan key size yang lebih kecil.
          </p>
          <div className="bg-purple-50 p-3 rounded">
            <span className="text-xs text-purple-700">
              Key Size: 256 bit
              <br />
              Security: 128 bit equivalent
              <br />
              Efficiency: High
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-pink-500 to-red-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Twofish</h3>
          <p className="text-pink-100 text-sm">Block Cipher</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Block cipher yang dirancang sebagai alternatif AES. Menggunakan
            Feistel network dengan 16 rounds.
          </p>
          <div className="bg-pink-50 p-3 rounded">
            <span className="text-xs text-pink-700">
              Key Size: 128/192/256 bit
              <br />
              Block Size: 128 bit
              <br />
              Rounds: 16
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Blowfish</h3>
          <p className="text-yellow-100 text-sm">Fast Block Cipher</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Block cipher yang cepat dan fleksibel. Digunakan dalam aplikasi yang
            membutuhkan kecepatan tinggi.
          </p>
          <div className="bg-yellow-50 p-3 rounded">
            <span className="text-xs text-yellow-700">
              Key Size: 32-448 bit
              <br />
              Block Size: 64 bit
              <br />
              Rounds: 16
            </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl border">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Masa Depan Cipher
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold mb-3 text-gray-800">Post-Quantum Ciphers</h4>
          <p className="text-sm text-gray-600">
            Algoritma cipher yang dirancang untuk tahan terhadap serangan
            komputer quantum. Contoh: Lattice-based, Hash-based, dan Code-based
            cryptography.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold mb-3 text-gray-800">
            Homomorphic Encryption
          </h4>
          <p className="text-sm text-gray-600">
            Cipher yang memungkinkan komputasi pada data terenkripsi tanpa perlu
            mendekripsi terlebih dahulu. Penting untuk privacy-preserving
            machine learning.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Page 4: Cipher-N Interactive Problem
export const CipherNInteractivePage = () => {
  const router = useRouter();

  const startCipherNProblem = () => {
    sessionStorage.removeItem('generatedQuestion');
    router.push(`/problems/generated/cipher-n/solve`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <Target className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cipher-N: Enkripsi Berbasis Poligon
        </h1>
        <p className="text-lg text-gray-600">
          Praktikkan Cipher-N dengan masalah interaktif
        </p>
      </div>

      {/* Cipher-N Explanation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Cara Kerja Cipher-N
          </h2>
          <p className="text-lg text-blue-700 max-w-3xl mx-auto">
            Cipher-N menggunakan poligon dengan huruf di setiap titik. Rotasi
            poligon menentukan huruf yang dipilih untuk enkripsi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              Langkah-langkah
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Pilih Poligon</h4>
                  <p className="text-sm text-gray-600">
                    Setiap titik poligon mewakili huruf yang berbeda
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Hitung Rotasi</h4>
                  <p className="text-sm text-gray-600">
                    Masukkan jumlah langkah rotasi untuk menentukan huruf target
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Enkripsi</h4>
                  <p className="text-sm text-gray-600">
                    Huruf target menjadi bagian dari pesan terenkripsi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              Fitur Cipher-N
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Visualisasi poligon interaktif
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Rotasi searah atau berlawanan jarum jam
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Berbagai ukuran poligon (4-8 sisi)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Sistem bantuan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-800 mb-6">
            Mulai Latihan Cipher-N
          </h3>
          <Button
            onClick={startCipherNProblem}
            className="bg-blue-500 hover:bg-blue-600 text-white h-16 text-xl font-bold transition-all hover:scale-105 px-8"
          >
            🎯 Mulai Latihan Cipher-N
          </Button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-3xl border-2 border-yellow-300">
        <h3 className="text-2xl font-bold text-yellow-800 mb-6 text-center">
          💡 Tips untuk Cipher-N
        </h3>
        <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-lg">
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Perhatikan arah rotasi (searah/berlawanan jarum jam)</li>
            <li>• Hitung dengan teliti jumlah langkah rotasi</li>
            <li>• Gunakan visualisasi poligon untuk membantu</li>
            <li>• Periksa kembali hasil enkripsi</li>
            <li>• Perhatikan posisi awal poligon</li>
            <li>• Gunakan fitur hint jika tersedia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Page 5: Ring Cipher Interactive Problem
export const RingCipherInteractivePage = () => {
  const router = useRouter();

  const startRingCipherProblem = () => {
    sessionStorage.removeItem('generatedQuestion');
    router.push(`/problems/generated/ring-cipher/solve`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Target className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ring Cipher: Enkripsi Berbasis Cincin
        </h1>
        <p className="text-lg text-gray-600">
          Praktikkan Ring Cipher dengan masalah interaktif
        </p>
      </div>

      {/* Ring Cipher Explanation */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border-2 border-purple-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">
            Cara Kerja Ring Cipher
          </h2>
          <p className="text-lg text-purple-700 max-w-3xl mx-auto">
            Ring Cipher menggunakan beberapa cincin konsentris dengan huruf di
            setiap cincin. Kombinasi posisi cincin menghasilkan pesan
            terenkripsi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-lg">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              Langkah-langkah
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">
                    Pilih Cincin
                  </h4>
                  <p className="text-sm text-gray-600">
                    Setiap cincin memiliki huruf yang berbeda
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">
                    Tentukan Langkah
                  </h4>
                  <p className="text-sm text-gray-600">
                    Masukkan jumlah langkah rotasi untuk cincin yang dipilih
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">Enkripsi</h4>
                  <p className="text-sm text-gray-600">
                    Huruf yang dipilih menjadi bagian dari pesan terenkripsi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-lg">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              Fitur Ring Cipher
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Visualisasi cincin konsentris
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  2-3 cincin dengan huruf berbeda
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Rotasi independen setiap cincin
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Sistem undo dan reset
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-800 mb-6">
            Mulai Latihan Ring Cipher
          </h3>
          <Button
            onClick={startRingCipherProblem}
            className="bg-purple-500 hover:bg-purple-600 text-white h-16 text-xl font-bold transition-all hover:scale-105 px-8"
          >
            🎯 Mulai Latihan Ring Cipher
          </Button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-3xl border-2 border-yellow-300">
        <h3 className="text-2xl font-bold text-yellow-800 mb-6 text-center">
          💡 Tips untuk Ring Cipher
        </h3>
        <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-lg">
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Pilih cincin yang tepat untuk setiap huruf</li>
            <li>• Perhatikan posisi awal setiap cincin</li>
            <li>• Gunakan fitur undo jika salah</li>
            <li>• Periksa hasil akhir dengan teliti</li>
            <li>• Perhatikan urutan cincin dari dalam ke luar</li>
            <li>• Gunakan fitur reset untuk memulai ulang</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
