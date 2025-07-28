'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target, RotateCcw } from 'lucide-react';

export function RingCipherHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tujuan
        </h3>
        <p className="text-gray-700">
          Kamu ditugaskan untuk menemukan kode (enkripsi) dari Kata yang
          diberikan dengan menggunakan cincin sandi.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Cara Menyelesaikan
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Langkah 1: Pahami Cincin
            </h4>
            <p className="text-blue-700 text-sm">
              Terdapat beberapa cincin konsentris, masing-masing berisi
              huruf-huruf yang tersusun melingkar. Setiap cincin dapat diputar
              secara independen. Panah merah di atas menunjukkan posisi
              referensi.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Langkah 2: Pilih Nomor Cincin
            </h4>
            <p className="text-green-700 text-sm">
              Masukkan nomor cincin (1, 2, 3, dst.) yang ingin kamu putar.
              Cincin 1 adalah cincin paling dalam, dan nomor bertambah ke arah
              luar.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Tentukan Langkah Rotasi
            </h4>
            <p className="text-purple-700 text-sm">
              Masukkan jumlah langkah rotasi pada cincin yang dipilih. Setiap
              langkah memutar cincin satu posisi huruf searah jarum jam.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">
              Langkah 4: Temukan Huruf
            </h4>
            <p className="text-orange-700 text-sm">
              Setelah diputar, huruf pada posisi referensi (ditandai panah
              merah) pada cincin target adalah huruf hasil enkripsi.
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
              <strong>Penomoran Cincin:</strong> Cincin dinomori dari dalam ke
              luar. Cincin 1 adalah yang paling dalam.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Posisi Referensi:</strong> Panah merah di atas visualisasi
              menunjukkan posisi referensi tempat membaca huruf hasil enkripsi.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Arah Rotasi:</strong> Setiap langkah rotasi memutar cincin
              searah jarum jam.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Umpan Balik Visual:</strong> Cincin yang dipilih akan
              disorot dengan warna dan border berbeda agar mudah dilacak.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Contoh</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 flex flex-col items-center">
          {/* Ilustrasi sederhana dua cincin */}
          <svg width="120" height="120" viewBox="0 0 120 120" className="mb-2">
            {/* Outer ring */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth="2"
            />
            {/* Inner ring */}
            <circle
              cx="60"
              cy="60"
              r="30"
              fill="#f3e8ff"
              stroke="#a21caf"
              strokeWidth="2"
            />
            {/* Reference arrow */}
            <polygon points="60,10 56,2 64,2" fill="red" />
            {/* Letters on outer ring */}
            <text
              x="60"
              y="18"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              A
            </text>
            <text
              x="100"
              y="60"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              B
            </text>
            <text
              x="60"
              y="110"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              C
            </text>
            <text
              x="20"
              y="60"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              D
            </text>
            {/* Letters on inner ring */}
            <text
              x="60"
              y="38"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              E
            </text>
            <text
              x="80"
              y="60"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              F
            </text>
            <text
              x="60"
              y="82"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              G
            </text>
            <text
              x="40"
              y="60"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#111827"
            >
              H
            </text>
          </svg>
          <p className="text-sm text-gray-700">
            <b>Diberikan:</b> Cincin 2 (luar) berisi huruf &quot;ABCD&quot;,
            diputar 2 langkah searah jarum jam
          </p>
          <p className="text-sm text-gray-700">
            <b>Penyelesaian:</b> Setelah diputar 2 langkah, huruf pada posisi
            referensi (panah merah) pada Cincin 2 adalah huruf &quot;C&quot;.
            Maka kode (enkripsi) untuk huruf tersebut adalah 22 (2 = nomor
            cincin, 2 = langkah rotasi).
          </p>
          <p className="text-sm text-gray-700">
            Jika ingin mengenkripsi kata &quot;EG&quot;, lakukan langkah serupa
            pada cincin dan langkah rotasi yang sesuai untuk setiap huruf, lalu
            gabungkan hasilnya dengan tanda &quot;-&quot;.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Mekanisme Cincin
        </h3>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-indigo-700 text-sm">
            Setiap cincin dapat diputar secara independen. Ketika kamu memutar
            sebuah cincin, semua huruf pada cincin tersebut ikut bergerak,
            sementara cincin lain tetap diam. Tujuan akhirnya adalah menyusun
            huruf-huruf hasil enkripsi dari setiap langkah untuk membentuk pesan
            sandi.
          </p>
        </div>
      </div>
    </div>
  );
}
