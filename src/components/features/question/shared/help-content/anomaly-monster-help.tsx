'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Check, Info, Lightbulb, Target, Worm } from 'lucide-react';

export function AnomalyMonsterHelp() {
  return (
    <div className="space-y-6">
      {/* Tujuan */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tujuan
        </h3>
        <p className="text-gray-700">
          Membantu ilmuwan mengklasifikasikan setiap monster sebagai{' '}
          <strong>Normal</strong> atau <strong>Terinfeksi</strong> berdasarkan
          pohon keputusan yang tersedia. Kamu harus mengklasifikasikan semua
          monster untuk menyelesaikan soal.
        </p>
      </div>

      {/* Cara Menyelesaikan */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Cara Menyelesaikan
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Langkah 1: Pelajari Pohon Keputusan
            </h4>
            <p className="text-blue-700 text-sm">
              Pohon keputusan di sebelah kiri menunjukkan aturan logis untuk
              mengklasifikasikan monster. Perhatikan setiap cabang yang mengarah
              ke hasil <strong>Normal</strong> atau <strong>Terinfeksi</strong>.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Langkah 2: Periksa Monster Satu per Satu
            </h4>
            <p className="text-green-700 text-sm">
              Gunakan tombol panah untuk navigasi antar monster. Amati
              karakteristik setiap monster: bentuk tubuh, bentuk tangan, bentuk
              kaki, dan warna. Progress akan ditampilkan di bagian kiri bawah.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Klasifikasikan dengan Tombol
            </h4>
            <p className="text-purple-700 text-sm">
              Setelah menganalisis monster menggunakan pohon keputusan, klik
              tombol
              <span className="inline-flex items-center mx-1 px-2 py-1 bg-green-100 rounded text-xs">
                <Check size={12} className="mr-1" />
                Normal
              </span>{' '}
              atau
              <span className="inline-flex items-center mx-1 px-2 py-1 bg-red-100 rounded text-xs">
                <Worm size={12} className="mr-1" />
                Terinfeksi
              </span>{' '}
              sesuai hasil analisis.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">
              Langkah 4: Selesaikan Semua Monster
            </h4>
            <p className="text-yellow-700 text-sm">
              Lanjutkan hingga semua monster terklasifikasi. Status progress
              akan menunjukkan jumlah monster yang telah diperiksa. Tombol
              submit akan aktif setelah semua monster selesai diklasifikasikan.
            </p>
          </div>
        </div>
      </div>

      {/* Interface */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Navigasi Interface
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Tombol Panah:</strong> Gunakan tombol panah kiri/kanan
              untuk berpindah antar monster yang akan diklasifikasikan.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Progress Bar:</strong> Menunjukkan berapa monster yang
              telah diklasifikasikan dari total monster yang ada.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Status Badge:</strong> Setiap monster menampilkan status
              klasifikasi: Belum diklasifikasikan, Normal, atau Terinfeksi.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Tips Penting
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Teliti Karakteristik:</strong> Perhatikan setiap detail
              monster - bentuk tubuh, bentuk tangan, bentuk kaki, dan warna.
              Karakteristik ini akan membantu navigasi pohon keputusan.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Ikuti Pohon Step by Step:</strong> Mulai dari akar pohon
              dan ikuti cabang sesuai karakteristik monster hingga mencapai daun
              (hasil klasifikasi).
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Reset Jika Perlu:</strong> Gunakan tombol
              &quot;Klasifikasi Ulang Semua Monster&quot; jika ingin memulai
              dari awal.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Periksa Progress:</strong> Pastikan semua monster sudah
              diklasifikasikan sebelum submit. Counter akan menunjukkan progress
              normal vs terinfeksi.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Contoh */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">
          Contoh Klasifikasi
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <p className="text-sm text-gray-700">
            <strong>Diberikan:</strong> Monster dengan karakteristik: bentuk
            tubuh Cube, bentuk tangan Twizzle, bentuk kaki Stomp, warna Green.
          </p>
          <p className="text-sm text-gray-700">
            <strong>Analisis:</strong> Mulai dari akar pohon keputusan → Cek
            bentuk tubuh (Cube) → Cek bentuk tangan (Twizzle) → Cek bentuk kaki
            (Stomp) → Cek warna (Green) → Ikuti cabang hingga hasil.
          </p>
          <p className="text-sm text-gray-700">
            <strong>Aksi:</strong> Berdasarkan hasil pohon keputusan, klik
            tombol yang sesuai: <strong>Normal</strong> atau{' '}
            <strong>Terinfeksi</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
