'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Target } from 'lucide-react';
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
          Tujuan
        </h3>
        <p className="text-gray-700">
          Kamu perlu mengubah keadaan awal (Current State) menjadi keadaan
          target (Target State) dengan menggunakan aturan transformasi yang
          tersedia.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Komponen-komponen Halaman
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Tabel Aturan (Rules Table)
            </h4>
            <p className="text-blue-700 text-sm mb-3">
              Menampilkan semua aturan transformasi yang tersedia. Setiap aturan
              menunjukkan bentuk &quot;sebelum&quot; dan &quot;sesudah&quot;
              transformasi.
            </p>
            <div className="bg-white p-3 rounded border flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Sebelum:</span>
                <div className="flex gap-1">
                  <ShapeContainer>
                    <Shape type="circle" size="sm" />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="square" size="sm" />
                  </ShapeContainer>
                </div>
              </div>
              <span className="text-gray-500">→</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Sesudah:</span>
                <div className="flex gap-1">
                  <ShapeContainer>
                    <Shape type="triangle" size="sm" />
                  </ShapeContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Keadaan Target (Target State)
            </h4>
            <p className="text-green-700 text-sm mb-3">
              Keadaan akhir yang harus kamu capai. Ini adalah tujuan dari
              permainan.
            </p>
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs text-gray-600">Target:</span>
                <div className="flex gap-1">
                  <ShapeContainer>
                    <Shape type="star" size="sm" />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="hexagon" size="sm" />
                  </ShapeContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Keadaan Sekarang (Current State)
            </h4>
            <p className="text-purple-700 text-sm mb-3">
              Keadaan saat ini yang bisa kamu ubah. Klik pada objek untuk
              memilihnya.
            </p>
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs text-gray-600">Sekarang:</span>
                <div className="flex gap-1">
                  <ShapeContainer>
                    <Shape type="circle" size="sm" selected />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="square" size="sm" selected />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="diamond" size="sm" />
                  </ShapeContainer>
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-1 text-center">
                Objek yang dipilih ditandai dengan ring biru
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">
              Aturan yang Bisa Diterapkan (Applicable Rules)
            </h4>
            <p className="text-orange-700 text-sm mb-3">
              Aturan yang bisa diterapkan pada objek yang sedang dipilih. Klik
              untuk menerapkan.
            </p>
            <div className="bg-white p-3 rounded border flex justify-center">
              <button className="p-2 bg-green-100 border border-green-300 rounded flex items-center gap-2 text-sm">
                <div className="flex gap-1">
                  <ShapeContainer>
                    <Shape type="circle" size="sm" />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="square" size="sm" />
                  </ShapeContainer>
                </div>
                <span>→</span>
                <div className="flex gap-1">
                  <ShapeContainer>
                    <Shape type="triangle" size="sm" />
                  </ShapeContainer>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Cara Bermain
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Langkah 1: Pilih Objek
            </h4>
            <p className="text-blue-700 text-sm">
              Klik pada objek di keadaan sekarang (Current State) untuk
              memilihnya. Objek harus dipilih secara berurutan dan bersebelahan.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Langkah 2: Lihat Aturan yang Tersedia
            </h4>
            <p className="text-green-700 text-sm">
              Setelah memilih objek, lihat bagian &quot;Aturan yang Bisa
              Diterapkan&quot; untuk melihat transformasi apa yang bisa
              dilakukan.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Terapkan Aturan
            </h4>
            <p className="text-purple-700 text-sm">
              Klik pada aturan yang ingin diterapkan. Objek yang dipilih akan
              berubah sesuai dengan aturan tersebut.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">
              Langkah 4: Ulangi Sampai Selesai
            </h4>
            <p className="text-orange-700 text-sm">
              Terus lakukan transformasi sampai keadaan sekarang sama dengan
              keadaan target, lalu klik &quot;Submit&quot;.
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
              <strong>Pemilihan Objek:</strong>
              Kamu hanya bisa memilih objek yang bersebelahan. Jika ingin
              memilih beberapa objek, pastikan mereka berurutan tanpa terputus.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Strategi:</strong>
              Perhatikan keadaan target terlebih dahulu, lalu pikirkan aturan
              mana yang bisa membawa kamu lebih dekat ke tujuan.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Urungkan/Ulangi:</strong>
              Gunakan tombol Urungkan jika melakukan kesalahan, atau Ulangi
              untuk mengulangi langkah yang dibatalkan.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Reset:</strong>
              Jika ingin memulai dari awal, klik tombol Reset untuk kembali ke
              keadaan awal.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Contoh</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="text-center">
            <h4 className="font-medium mb-3">
              Skenario: Ubah Lingkaran + Persegi menjadi Segitiga
            </h4>

            <div className="space-y-3">
              {/* Initial state */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm font-medium">Awal:</span>
                <div className="flex gap-1 bg-white p-2 rounded border">
                  <ShapeContainer>
                    <Shape type="circle" size="sm" />
                  </ShapeContainer>
                  <ShapeContainer>
                    <Shape type="square" size="sm" />
                  </ShapeContainer>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-2xl text-gray-400">↓</div>

              {/* Rule application */}
              <div className="bg-yellow-100 p-3 rounded">
                <p className="text-sm mb-2">1. Pilih lingkaran dan persegi</p>
                <p className="text-sm mb-2">
                  2. Terapkan aturan: lingkaran + persegi → segitiga
                </p>
              </div>

              {/* Arrow */}
              <div className="text-2xl text-gray-400">↓</div>

              {/* Final state */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm font-medium">Hasil:</span>
                <div className="flex gap-1 bg-white p-2 rounded border">
                  <ShapeContainer>
                    <Shape type="triangle" size="sm" />
                  </ShapeContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
