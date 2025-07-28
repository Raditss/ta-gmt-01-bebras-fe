'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Info,
  Lightbulb,
  Search,
  Target
} from 'lucide-react';
import MonsterCharacter from '@/components/features/question/anomaly-monster/monster-character';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import { Button } from '@/components/ui/button';

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
              mengklasifikasikan monster. Cabang-cabang yang terdapat pada Pohon
              Keputusan merupakan Monster yang <strong>Normal</strong>.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              Langkah 2: Periksa Monster dengan menekan tombol
            </h4>
            <Button
              className="flex self-center justify-self-center
               border-2 border-gray-400 text-green-600 bg-white
               hover:bg-white hover:text-green-600 hover:border-gray-400 cursor-default"
            >
              <Search size={12} />
              Klasifikasikan
            </Button>
            <p className="text-green-700 text-sm">
              Gunakan tombol panah untuk navigasi antar monster. Amati
              karakteristik setiap monster: warna, bentuk tubuh, dan mulut
              monster. Lalu, pilih opsi yang tersedia pada form analisis sesuai
              dengan yang kamu amati pada monster.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Klasifikasikan dengan Tombol
            </h4>
            <p className="text-purple-700 text-sm">
              Analisis hasil dengan menggunakan pohon keputusan yang ada di
              sebelah kiri, Setelah menganalisis monster menggunakan pohon
              keputusan, klik tombol
              <span className="inline-flex items-center mx-1 px-2 py-1 bg-green-100 rounded text-xs">
                <CheckCircle size={12} className="mr-1" />
                Tandai Normal
              </span>{' '}
              atau
              <span className="inline-flex items-center mx-1 px-2 py-1 bg-red-100 rounded text-xs">
                <AlertTriangle size={12} className="mr-1" />
                Tandai Terinfeksi
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
            <Button
              className={`flex justify-self-center flex-1 py-3 text-base bg-green-500 hover:bg-green-500 text-white hover:text-white cursor-default`}
            >
              Submit Jawaban
            </Button>
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
              monster - warna, bentuk tubuh, dan mulut dan masukkan pada form
              analisis. Karakteristik ini akan membantu navigasi pohon
              keputusan.
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
          <div className="flex justify-center">
            <MonsterCharacter
              selections={{
                Color: 'Blue',
                Body: 'Orb',
                Mouth: 'Fangs'
              }}
            />
          </div>
          <p className="text-sm text-gray-700">
            <strong>Diberikan:</strong> Monster dengan karakteristik: warna
            biru, bentuk tubuh bulat, dan bertaring.
          </p>
          <p className="text-sm text-gray-700">
            <strong>Analisis:</strong> Masukkan pada form analisis yang diminta,
            Lalu lihat pada pohon keputusan
          </p>
          <DecisionTreeAnomalyTree
            rules={[
              {
                id: 1,
                conditions: [
                  { attribute: 'Color', value: 'Green' },
                  { attribute: 'Body', value: 'Orb' },
                  { attribute: 'Mouth', value: 'Closedteeth' }
                ]
              },
              {
                id: 2,
                conditions: [
                  { attribute: 'Color', value: 'Red' },
                  { attribute: 'Body', value: 'Cube' },
                  { attribute: 'Mouth', value: 'Closedteeth' }
                ]
              },
              {
                id: 3,
                conditions: [
                  { attribute: 'Color', value: 'Blue' },
                  { attribute: 'Body', value: 'Orb' },
                  { attribute: 'Mouth', value: 'Fangs' }
                ]
              },
              {
                id: 4,
                conditions: [
                  { attribute: 'Color', value: 'Blue' },
                  { attribute: 'Body', value: 'Orb' },
                  { attribute: 'Mouth', value: 'Closedteeth' }
                ]
              }
            ]}
            selections={{
              Color: 'Blue',
              Body: 'Orb',
              Mouth: 'Fangs'
            }}
            height="300px"
          />
          <p className="text-sm text-gray-700">
            <strong>Aksi:</strong> Berdasarkan hasil pohon keputusan, klik
            tombol yang sesuai: <strong>Normal</strong> atau{' '}
            <strong>Terinfeksi</strong>. Pada kasus ini Jawabannya adalah{' '}
            <strong>Normal</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
