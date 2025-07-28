'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target, Fish } from 'lucide-react';

export function CfgHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tujuan Permainan
        </h3>
        <p className="text-gray-700">
          Bantu nelayan untuk menukar koleksi ikan yang dia miliki sekarang
          menjadi koleksi ikan yang diinginkan pelanggannya. Gunakan aturan
          perdagangan yang tersedia untuk melakukan pertukaran ikan.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Cara Bermain
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Fish className="w-4 h-4" />
              Langkah 1: Pilih Ikan untuk Ditukar
            </h4>
            <p className="text-blue-700 text-sm">
              Klik pada ikan-ikan di &quot;Koleksi Ikan Sekarang&quot; yang
              ingin Anda tukar. Ikan yang dipilih akan tampak lebih besar dan
              beranimasi mengambang.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Langkah 2: Terapkan Aturan Perdagangan
            </h4>
            <p className="text-green-700 text-sm">
              Setelah memilih ikan, lihat bagian &quot;Perdagangan yang
              Tersedia&quot;. Klik pada salah satu tombol perdagangan untuk
              menukar ikan yang dipilih dengan ikan baru sesuai aturan.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Menuju Target
            </h4>
            <p className="text-purple-700 text-sm">
              Ulangi proses hingga koleksi ikan Anda sama persis dengan
              &quot;Target Koleksi Ikan&quot;. Nelayan akan terlihat senang
              ketika Anda berhasil mencapai target!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Tips & Trik
        </h3>
        <div className="space-y-3">
          <Alert>
            <Fish className="h-4 w-4" />
            <AlertDescription>
              <strong>Perhatikan Meja Perdagangan:</strong> Lihat semua aturan
              perdagangan yang tersedia. Aturan menunjukkan ikan mana yang bisa
              ditukar dengan ikan apa.
            </AlertDescription>
          </Alert>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Urutan Perdagangan:</strong> Terkadang Anda perlu
              melakukan beberapa perdagangan secara berurutan untuk mencapai
              target. Rencanakan langkah Anda!
            </AlertDescription>
          </Alert>

          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              <strong>Gunakan Tombol Bantuan:</strong> Jika terjebak, gunakan
              tombol &quot;Batalkan&quot; untuk membatalkan langkah terakhir,
              atau &quot;Reset&quot; untuk memulai dari awal.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
        <h4 className="font-semibold text-cyan-800 mb-2">
          🎣 Tentang Nelayan dan Ikan
        </h4>
        <p className="text-cyan-700 text-sm">
          Nelayan akan menunjukkan ekspresi berbeda selama permainan:
        </p>
        <ul className="list-disc list-inside text-cyan-700 text-sm mt-2 space-y-1">
          <li>
            <strong>Melambaikan tangan:</strong> Siap memulai atau menunggu aksi
          </li>
          <li>
            <strong>Berpikir:</strong> Sedang mempertimbangkan pilihan ikan yang
            dipilih
          </li>
          <li>
            <strong>Senang:</strong> Target tercapai! Perdagangan berhasil!
          </li>
        </ul>
      </div>
    </div>
  );
}
