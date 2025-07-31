'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target, Fish } from 'lucide-react';
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';

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
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <Fish className="w-4 h-4" />
              Langkah 1: Pahami Aturan Perdagangan
            </h4>
            <p className="text-blue-700 text-sm mb-3">
              Lihat tabel aturan di sebelah kiri. Setiap baris menunjukkan
              perdagangan yang bisa dilakukan. Tabel ini interaktif - ketika
              Anda memilih ikan yang tepat, baris yang bisa diterapkan akan
              menyala hijau:
            </p>
            <div className="bg-white p-3 rounded border">
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">
                    Ikan yang Anda miliki
                  </div>
                  <div className="flex justify-center gap-2">
                    <ShapeContainer>
                      <Shape type="FISH_GREEN" size="sm" />
                    </ShapeContainer>
                    <ShapeContainer>
                      <Shape type="FISH_PURPLE" size="sm" />
                    </ShapeContainer>
                  </div>
                </div>
                <div className="text-center text-lg font-bold text-gray-700">
                  →
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">
                    Ditukar menjadi
                  </div>
                  <div className="flex justify-center">
                    <ShapeContainer>
                      <Shape type="FISH_BLUE" size="sm" />
                    </ShapeContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3">
              Langkah 2: Pilih Ikan untuk Ditukar
            </h4>
            <p className="text-green-700 text-sm mb-3">
              Klik pada ikan-ikan di &quot;Koleksi Ikan Sekarang&quot; yang
              sesuai dengan aturan. Ikan yang dipilih akan menyala dengan border
              biru dan beranimasi:
            </p>
            <div className="bg-white p-3 rounded border">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-2">
                  Contoh ikan terpilih:
                </div>
                <div className="flex justify-center gap-2">
                  <ShapeContainer>
                    <Shape type="FISH_GREEN" size="sm" selected={true} />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="FISH_PURPLE" size="sm" selected={true} />
                  </ShapeContainer>
                </div>
              </div>
            </div>
            <p className="text-green-700 text-sm mt-2">
              💡 <strong>Tips:</strong> Urutan pemilihan tidak penting, yang
              penting adalah posisi ikan di koleksi Anda!
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-3">
              Langkah 3: Terapkan Aturan Perdagangan
            </h4>
            <p className="text-purple-700 text-sm mb-3">
              Setelah memilih ikan yang tepat, baris aturan yang bisa diterapkan
              akan menyala hijau di tabel. Klik langsung pada baris hijau
              tersebut untuk menerapkan aturan:
            </p>
            <div className="bg-white p-3 rounded border">
              <div className="bg-green-100 border-4 border-green-400 rounded-lg p-4 transition-all duration-300 ring-4 ring-green-400 ring-opacity-50 shadow-lg cursor-pointer">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-center items-center p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded">
                    <div className="flex gap-2">
                      <ShapeContainer>
                        <Shape type="FISH_GREEN" size="sm" />
                      </ShapeContainer>
                      <ShapeContainer>
                        <Shape type="FISH_PURPLE" size="sm" />
                      </ShapeContainer>
                    </div>
                  </div>
                  <div className="flex justify-center items-center p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded">
                    <div className="flex">
                      <ShapeContainer>
                        <Shape type="FISH_BLUE" size="sm" />
                      </ShapeContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-purple-700 text-sm mt-2">
              💡 <strong>Tips:</strong> Baris hijau menandakan aturan yang bisa
              diterapkan dengan ikan yang Anda pilih!
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">
              Langkah 4: Menuju Target
            </h4>
            <p className="text-orange-700 text-sm">
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
