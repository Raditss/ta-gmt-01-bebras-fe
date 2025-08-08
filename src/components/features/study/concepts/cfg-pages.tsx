import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Lightbulb, TreePine, Code, Target } from 'lucide-react';

// Individual page components
export const IntroductionPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Apa itu Context-Free Grammar?
      </h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-2xl font-semibold mb-4 text-blue-800">
            Definisi CFG
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Context-Free Grammar (CFG) adalah seperti &quot;aturan tata
            bahasa&quot; yang menentukan bagaimana kata-kata atau simbol bisa
            disusun dengan benar. Bayangkan seperti resep masakan - ada
            aturan-aturan tertentu yang harus diikuti untuk membuat sesuatu yang
            benar dan bermakna.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
          <h3 className="text-xl font-semibold mb-3 text-green-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Mengapa CFG Penting?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              Membantu komputer memahami kode program yang kita tulis
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              Digunakan untuk membuat aplikasi dan website
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              Dasar untuk Google Translate dan chatbot seperti ChatGPT
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">
            Contoh Sederhana
          </h3>
          <div className="bg-white p-4 rounded-lg border font-mono text-sm">
            <div className="text-purple-600 font-bold mb-2">
              Grammar untuk Aritmetika:
            </div>
            <div className="space-y-1">
              <div>S → S + S</div>
              <div>S → S * S</div>
              <div>S → (S)</div>
              <div>S → angka</div>
            </div>
          </div>
          <p className="text-yellow-700 mt-3 text-sm">
            Grammar ini dapat menghasilkan ekspresi seperti: (2 + 3) * 4
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
          <h3 className="text-xl font-semibold mb-3 text-purple-800">
            Dalam Game Kami
          </h3>
          <p className="text-gray-700">
            Dalam game kami, CFG seperti &quot;resep perdagangan ikan&quot; -
            nelayan bisa menukar ikan tertentu dengan ikan lain sesuai aturan
            yang ada. Ini membuat konsep CFG jadi mudah dipahami dan
            menyenangkan!
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const ComponentsPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
        <TreePine className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Komponen CFG</h1>
      <p className="text-lg text-gray-600">
        CFG memiliki empat komponen utama yang bekerja sama
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Terminal</h3>
          <p className="text-blue-100">
            Simbol dasar yang tidak bisa diubah lagi (seperti huruf atau angka)
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Contoh:</h4>
              <div className="bg-blue-50 p-3 rounded border">
                <code className="text-blue-600">a, b, +, *, (, ), angka</code>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Seperti huruf a, b atau angka 1, 2 - ini adalah bahan mentah yang
              tidak bisa dipecah lagi
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Non-Terminal</h3>
          <p className="text-green-100">
            Simbol yang bisa diganti dengan simbol lain (seperti variabel)
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Contoh:</h4>
              <div className="bg-green-50 p-3 rounded border">
                <code className="text-green-600">S, A, B, Expr</code>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Seperti variabel S, A, B - ini bisa &quot;dipecah&quot; menjadi
              bagian-bagian yang lebih kecil
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Aturan Produksi</h3>
          <p className="text-orange-100">
            Cara menurunkan non-terminal menjadi simbol lain
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Format:</h4>
              <div className="bg-orange-50 p-3 rounded border">
                <code className="text-orange-600">
                  Non-terminal → simbol lain
                </code>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Menentukan bagaimana non-terminal dapat diganti
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Simbol Awal</h3>
          <p className="text-purple-100">
            Non-terminal yang menjadi titik mulai derivasi
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Biasanya:</h4>
              <div className="bg-purple-50 p-3 rounded border">
                <code className="text-purple-600">S (Start)</code>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Semua derivasi dimulai dari simbol ini
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Contoh Grammar Lengkap
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Grammar: S → aS | b</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Terminal:</strong> {'{a, b}'}
            </div>
            <div>
              <strong>Non-terminal:</strong> {'{S}'}
            </div>
            <div>
              <strong>Aturan:</strong> S → aS, S → b
            </div>
            <div>
              <strong>Simbol awal:</strong> S
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">String yang dapat dihasilkan:</h4>
          <div className="bg-white p-3 rounded border text-sm font-mono">
            b, ab, aab, aaab, aaaab, ...
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DerivationPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
        <Code className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Derivasi dan Parsing
      </h1>
      <p className="text-lg text-gray-600">
        Proses menggunakan aturan CFG untuk menghasilkan atau menganalisis
        string
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Derivasi</h3>
            <p className="text-blue-100">Menghasilkan string dari grammar</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                Derivasi adalah proses menggunakan aturan produksi untuk
                menghasilkan string dari simbol awal.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Contoh Derivasi:</h4>
                <div className="font-mono text-sm space-y-1">
                  <div>S → aS</div>
                  <div> → aaS</div>
                  <div> → aab</div>
                </div>
                <p className="text-blue-700 mt-2 text-sm">
                  Menghasilkan string &quot;aab&quot; dari simbol awal S
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
            <h3 className="text-2xl font-bold">Parsing</h3>
            <p className="text-green-100">Menganalisis struktur string</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                Parsing adalah proses sebaliknya - menentukan bagaimana string
                dapat diturunkan dari grammar.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Tujuan Parsing:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Verifikasi apakah string valid</li>
                  <li>• Membangun pohon parse</li>
                  <li>• Memahami struktur string</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">
            Langkah-langkah Derivasi
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <strong>Mulai dengan simbol awal</strong>
                <p className="text-sm text-gray-600">Biasanya simbol S</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <strong>Pilih non-terminal</strong>
                <p className="text-sm text-gray-600">Yang akan diganti</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <strong>Aplikasikan aturan</strong>
                <p className="text-sm text-gray-600">
                  Ganti dengan sisi kanan aturan
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <strong>Ulangi sampai selesai</strong>
                <p className="text-sm text-gray-600">
                  Hingga hanya tersisa terminal
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
          <h3 className="text-xl font-semibold mb-4 text-purple-800">
            Dalam Game Kami
          </h3>
          <p className="text-gray-700 mb-4">
            Derivasi adalah proses &quot;perdagangan ikan&quot; menggunakan
            resep:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Kolam ikan = String saat ini</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Resep perdagangan = Aturan produksi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Target = String yang ingin dicapai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ParseTreePage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
        <TreePine className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Pohon Parse</h1>
      <p className="text-lg text-gray-600">
        Representasi visual dari struktur derivasi
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200">
          <h3 className="text-2xl font-semibold mb-4 text-pink-800">
            Apa itu Pohon Parse?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Pohon parse adalah representasi visual dari derivasi yang
            menunjukkan struktur hierarkis string. Setiap node internal adalah
            non-terminal dan setiap leaf adalah terminal.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
              <span>
                <strong>Root:</strong> Simbol awal (S)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span>
                <strong>Internal nodes:</strong> Non-terminal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>
                <strong>Leaves:</strong> Terminal
              </span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
            <h3 className="text-xl font-bold">Kegunaan Pohon Parse</h3>
          </div>
          <CardContent className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Memahami struktur</strong>
                  <p className="text-sm text-gray-600">
                    Melihat bagaimana string dibentuk
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Validasi grammar</strong>
                  <p className="text-sm text-gray-600">
                    Memastikan derivasi benar
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Analisis semantik</strong>
                  <p className="text-sm text-gray-600">
                    Memahami makna struktur
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">
            Contoh Pohon Parse
          </h3>
          <div className="text-center mb-4">
            <div className="inline-block text-left font-mono text-lg bg-white p-6 rounded-lg border shadow-sm">
              <div className="mb-2 text-center">{'        S'}</div>
              <div className="mb-2 text-center">{'      / | \\'}</div>
              <div className="mb-2 text-center">{'     a  S  b'}</div>
              <div className="mb-2 text-center">{'        |'}</div>
              <div className="mb-2 text-center">{'        a'}</div>
            </div>
          </div>
          <p className="text-yellow-700 text-center">
            Untuk string &quot;aab&quot; dengan grammar S → aS | b
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">
            Proses Pembentukan
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Mulai dengan root S</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Aplikasikan S → aS: buat child a, S</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Pada S kedua, aplikasikan S → a</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>Baca leaves dari kiri ke kanan: &quot;aa&quot;</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
          <h3 className="text-xl font-semibold mb-3 text-green-800">
            Tips Membaca Pohon Parse
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Baca daun (leaves) dari kiri ke kanan untuk mendapat string
            </li>
            <li>• Ikuti jalur dari root ke leaf untuk melihat derivasi</li>
            <li>• Setiap cabang menunjukkan aplikasi satu aturan</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export const ApplicationsPage = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
        <Code className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Aplikasi CFG</h1>
      <p className="text-lg text-gray-600">
        CFG digunakan di berbagai bidang komputer science
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Compiler Design</h3>
          <p className="text-purple-100 text-sm">Parsing bahasa pemrograman</p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              CFG digunakan untuk mendefinisikan sintaks bahasa pemrograman dan
              membangun parser.
            </p>
            <div className="bg-purple-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">Contoh:</h4>
              <code className="text-xs">if (condition) statement</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">
            Natural Language Processing
          </h3>
          <p className="text-green-100 text-sm">Analisis struktur kalimat</p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              Menganalisis struktur gramatikal kalimat dalam bahasa natural.
            </p>
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">Contoh:</h4>
              <code className="text-xs">Sentence → Subject Predicate</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Artificial Intelligence</h3>
          <p className="text-orange-100 text-sm">Representasi pengetahuan</p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              Merepresentasikan aturan dan pengetahuan dalam sistem AI.
            </p>
            <div className="bg-orange-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">Contoh:</h4>
              <code className="text-xs">Rule → Condition Action</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Web Development</h3>
          <p className="text-blue-100 text-sm">Parsing HTML, CSS, JavaScript</p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              Browser menggunakan CFG untuk parsing markup dan script.
            </p>
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">Contoh:</h4>
              <code className="text-xs">{'<tag>content</tag>'}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Database Query</h3>
          <p className="text-pink-100 text-sm">
            Parsing SQL dan query language
          </p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              Database engine menggunakan CFG untuk memahami query SQL.
            </p>
            <div className="bg-pink-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">Contoh:</h4>
              <code className="text-xs">SELECT * FROM table</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Game Development</h3>
          <p className="text-yellow-100 text-sm">Parsing script dan command</p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              Game engine menggunakan CFG untuk parsing script dan command.
            </p>
            <div className="bg-yellow-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">Contoh:</h4>
              <code className="text-xs">move player to (x, y)</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl border">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Mengapa CFG Begitu Penting?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🔧</span>
          </div>
          <h4 className="font-bold mb-2">Fleksibel</h4>
          <p className="text-sm text-gray-600">
            Dapat mendefinisikan struktur bahasa yang kompleks
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <h4 className="font-bold mb-2">Efisien</h4>
          <p className="text-sm text-gray-600">
            Algoritma parsing yang cepat dan dapat diandalkan
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🎯</span>
          </div>
          <h4 className="font-bold mb-2">Universal</h4>
          <p className="text-sm text-gray-600">
            Standar dalam teori bahasa formal dan computational linguistics
          </p>
        </div>
      </div>
    </div>
  </div>
);
