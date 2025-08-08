import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Key, Eye, Settings, BookOpen } from 'lucide-react';

// Page 1: Introduction to Cryptography
export const CryptographyIntroPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <Shield className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Apa itu Kriptografi?
      </h1>
      <p className="text-lg text-gray-600">
        Kriptografi adalah ilmu untuk mengamankan informasi
      </p>
    </div>

    <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-200">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Definisi</h3>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        Kriptografi adalah seni dan ilmu untuk mengamankan informasi dengan
        mengubah data menjadi bentuk yang tidak dapat dibaca oleh orang yang
        tidak berwenang. Bayangkan seperti kotak brankas digital yang hanya bisa
        dibuka dengan kunci yang tepat.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
        <h4 className="font-semibold text-blue-800 mb-2">Contoh Sederhana:</h4>
        <pre className="text-sm text-blue-700 whitespace-pre-wrap font-mono bg-blue-100 p-3 rounded">
          <code>
            Pesan Asli: &quot;HELLO WORLD&quot;
            <br />
            Pesan Terenkripsi: &quot;KHOOR ZRUOG&quot;
            <br />
            (menggunakan Caesar Cipher dengan shift 3)
          </code>
        </pre>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl border-2 border-green-300">
      <h3 className="text-2xl font-bold text-green-800 mb-4">
        Mengapa Penting?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Keamanan Data</h4>
          <p className="text-sm text-gray-600">
            Melindungi informasi pribadi dan sensitif
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Autentikasi</h4>
          <p className="text-sm text-gray-600">
            Memastikan identitas pengirim pesan
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold mb-2">Privasi</h4>
          <p className="text-sm text-gray-600">
            Menjaga kerahasiaan komunikasi
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Page 2: Types of Encryption
export const EncryptionTypesPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
        <Settings className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Jenis-jenis Enkripsi
      </h1>
      <p className="text-lg text-gray-600">
        Berbagai metode untuk mengamankan informasi
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Enkripsi Simetris</h3>
          <p className="text-blue-100">
            Menggunakan kunci yang sama untuk enkripsi dan dekripsi
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Seperti menggunakan kunci yang sama untuk mengunci dan membuka
              brankas. Cepat dan efisien untuk data berukuran besar.
            </p>
            <div className="bg-blue-50 p-3 rounded border">
              <h4 className="font-semibold mb-2">Contoh:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• AES (Advanced Encryption Standard)</li>
                <li>• DES (Data Encryption Standard)</li>
                <li>• Caesar Cipher</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Enkripsi Asimetris</h3>
          <p className="text-green-100">
            Menggunakan sepasang kunci: public dan private
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Seperti kotak surat: semua orang bisa memasukkan surat (public
              key), tapi hanya pemilik yang bisa membuka (private key).
            </p>
            <div className="bg-green-50 p-3 rounded border">
              <h4 className="font-semibold mb-2">Contoh:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• RSA (Rivest-Shamir-Adleman)</li>
                <li>• ECC (Elliptic Curve Cryptography)</li>
                <li>• Digital Signatures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
      <h3 className="text-xl font-semibold mb-4 text-yellow-800">
        Kapan Menggunakan?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">
            Enkripsi Simetris:
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• File yang disimpan di komputer</li>
            <li>• Database yang besar</li>
            <li>• Komunikasi real-time</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-green-800 mb-2">
            Enkripsi Asimetris:
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Email yang aman</li>
            <li>• Transaksi online</li>
            <li>• Digital signatures</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Page 3: Applications
export const CryptographyApplicationsPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Aplikasi Kriptografi
      </h1>
      <p className="text-lg text-gray-600">
        Kriptografi ada di mana-mana dalam kehidupan digital kita
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">HTTPS & SSL</h3>
          <p className="text-blue-100 text-sm">Website yang aman</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Setiap kali Anda melihat &quot;gembok&quot; di browser, itu berarti
            website menggunakan enkripsi untuk melindungi data Anda.
          </p>
          <div className="bg-blue-50 p-3 rounded">
            <code className="text-xs text-blue-700">
              https://www.example.com 🔒
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">WhatsApp & Telegram</h3>
          <p className="text-green-100 text-sm">Pesan yang terenkripsi</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Aplikasi chat menggunakan end-to-end encryption sehingga hanya
            pengirim dan penerima yang bisa membaca pesan.
          </p>
          <div className="bg-green-50 p-3 rounded">
            <span className="text-xs text-green-700">
              🔐 Pesan dienkripsi ujung ke ujung
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Banking & ATM</h3>
          <p className="text-orange-100 text-sm">Transaksi yang aman</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Setiap transaksi perbankan menggunakan enkripsi untuk melindungi
            nomor rekening, PIN, dan jumlah transaksi.
          </p>
          <div className="bg-orange-50 p-3 rounded">
            <span className="text-xs text-orange-700">
              💳 PIN dan data rekening dienkripsi
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Cryptocurrency</h3>
          <p className="text-purple-100 text-sm">Mata uang digital</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Bitcoin dan cryptocurrency lainnya menggunakan kriptografi untuk
            mengamankan transaksi dan mencegah pemalsuan.
          </p>
          <div className="bg-purple-50 p-3 rounded">
            <span className="text-xs text-purple-700">
              ₿ Blockchain menggunakan hash cryptography
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-pink-500 to-red-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">WiFi Security</h3>
          <p className="text-pink-100 text-sm">Jaringan yang aman</p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Password WiFi menggunakan protokol enkripsi WPA/WPA2 untuk
            melindungi jaringan dari akses tidak sah.
          </p>
          <div className="bg-pink-50 p-3 rounded">
            <span className="text-xs text-pink-700">
              📶 WPA2/WPA3 encryption
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Password Storage</h3>
          <p className="text-yellow-100 text-sm">
            Menyimpan password dengan aman
          </p>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-3">
            Website tidak menyimpan password asli Anda, melainkan hasil hash
            (bentuk terenkripsi) yang tidak bisa dikembalikan.
          </p>
          <div className="bg-yellow-50 p-3 rounded">
            <span className="text-xs text-yellow-700">
              🔐 Bcrypt, SHA-256 hashing
            </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl border">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Kriptografi di Masa Depan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold mb-3 text-gray-800">Quantum Cryptography</h4>
          <p className="text-sm text-gray-600">
            Menggunakan prinsip fisika quantum untuk menciptakan enkripsi yang
            secara teoritis tidak dapat dipecahkan.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold mb-3 text-gray-800">
            Post-Quantum Cryptography
          </h4>
          <p className="text-sm text-gray-600">
            Algoritma enkripsi baru yang dirancang untuk tahan terhadap serangan
            komputer quantum di masa depan.
          </p>
        </div>
      </div>
    </div>
  </div>
);
