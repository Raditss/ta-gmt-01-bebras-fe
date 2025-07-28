'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target } from 'lucide-react';

export function CipherNHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objective
        </h3>
        <p className="text-gray-700">
          Kamu ditugaskan untuk menemukan kode (enkripsi) dari Kata yang
          diberikan.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          How to Solve
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Langkah 1: Pahami Poligon
            </h4>
            <p className="text-blue-700 text-sm">
              Poligon adalah bentuk geometri yang terdiri dari beberapa titik
              yang dihubungkan oleh garis. Setiap titik pada poligon mewakili
              sebuah huruf. Titik yang sedang dipilih ditandai dengan warna
              merah, dan titik yang akan dipilih setelah rotasi ditandai dengan
              warna hijau.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Langkah 2: Hitung Rotasi
            </h4>
            <p className="text-green-700 text-sm">
              Masukkan jumlah langkah rotasi pada kotak yang tersedia untuk
              menentukan titik mana yang akan menjadi target.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Temukan Huruf
            </h4>
            <p className="text-purple-700 text-sm">
              Masukkan nomor posisi (1, 2, 3, dst.) pada kotak yang tersedia
              untuk menentukan huruf dari urutan huruf pada titik target yang
              perlu kamu temukan.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Tips
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Bantuan Visual:</strong>
              Poligon visualisasi menunjukkan titik yang sedang dipilih dengan
              warna merah dan titik target dengan warna hijau. Panah menunjukkan
              titik target.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Penghitungan Posisi:</strong>
              Posisi huruf dimulai dari 1, bukan 0. Misalnya, jika sebuah titik
              memiliki huruf &quot;ABC&quot;, posisi 1 adalah &quot;A&quot;,
              posisi 2 adalah &quot;B&quot;, dst.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Arah Rotasi:</strong> Arah rotasi sudah ditentukan dalam
              pertanyaan.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Example</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 flex flex-col items-center">
          {/* Small Cipher Wheel Illustration */}
          <svg width="120" height="120" viewBox="0 0 120 120" className="mb-2">
            {/* Polygon */}
            <polygon
              points="60,20 100,44 88,92 32,92 20,44"
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth="2"
            />
            {/* Vertices */}
            {/* Vertex 0 (highlighted as current) */}
            <circle
              cx="60"
              cy="20"
              r="14"
              fill="#34d399"
              stroke="#059669"
              strokeWidth="2"
            />
            <text
              x="60"
              y="25"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              AB
            </text>
            <circle
              cx="100"
              cy="44"
              r="14"
              fill="#fff"
              stroke="#64748b"
              strokeWidth="2"
            />
            <text
              x="100"
              y="49"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              CD
            </text>
            <circle
              cx="88"
              cy="92"
              r="14"
              fill="#fff"
              stroke="#64748b"
              strokeWidth="2"
            />
            <text
              x="88"
              y="97"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              EF
            </text>
            <circle
              cx="32"
              cy="92"
              r="14"
              fill="#fff"
              stroke="#64748b"
              strokeWidth="2"
            />
            <text
              x="32"
              y="97"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              GH
            </text>
            <circle
              cx="20"
              cy="44"
              r="14"
              fill="#fff"
              stroke="#64748b"
              strokeWidth="2"
            />
            <text
              x="20"
              y="49"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              IJ
            </text>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#111827" />
              </marker>
            </defs>
          </svg>
          <p className="text-sm text-gray-700">
            Kamu ditugaskan untuk menemukan kode (enkripsi) dari Kata <b>DI</b>
          </p>
          <p className="text-sm text-gray-700">
            untuk mencapai huruf D kamu harus melakukan 1 rotasi searah jarum
            jam dan memilih huruf di posisi 2. Jadi kode (enkripsi) dari D
            adalah 12. kemudian untuk mencapai huruf I kamu harus melakukan 3
            rotasi searah jarum jam dari posisi D dan memilih huruf di posisi 1.
            Jadi kode (enkripsi) dari I adalah 31. Jadi, kode (enkripsi) dari
            Kata DI adalah 12-31.
          </p>
        </div>
      </div>
    </div>
  );
}
