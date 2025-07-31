'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Target
} from 'lucide-react';
import MonsterCharacter from '@/components/features/question/anomaly-monster/monster-character';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';

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
          pohon keputusan monster yang normal yang tersedia. Kamu harus
          mengklasifikasikan semua monster untuk menyelesaikan soal.
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
              Langkah 2: Analisis Monster
            </h4>
            <p className="text-green-700 text-sm">
              Klik pada lingkaran monster di bagian bawah untuk membuka form
              analisis.
            </p>
            <div className="mt-2 flex justify-center">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-xl">
                ❓
              </div>
            </div>
            <p className="text-green-700 text-sm mt-2">
              Lingkaran dengan tanda tanya (❓) menunjukkan monster yang belum
              dianalisis.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">
              Langkah 3: Isi Form Analisis
            </h4>
            <p className="text-purple-700 text-sm">
              Isi form analisis dengan karakteristik monster yang kamu amati:
              <ul className="list-disc pl-5 mt-1">
                <li>Pilih warna monster (Merah, Hijau, Biru)</li>
                <li>Pilih bentuk tubuh (Bulat, Kotak)</li>
                <li>Pilih bentuk mulut (Bertaring, Tidak Beratring)</li>
              </ul>
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">
              Langkah 4: Klasifikasikan Monster
            </h4>
            <p className="text-yellow-700 text-sm">
              Setelah mengisi form analisis, gunakan pohon keputusan untuk
              menentukan klasifikasi:
              <div className="flex justify-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-1 bg-green-100 rounded text-xs">
                  <CheckCircle size={12} className="mr-1" />
                  Tandai Normal
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-red-100 rounded text-xs">
                  <AlertTriangle size={12} className="mr-1" />
                  Tandai Terinfeksi
                </span>
              </div>
              <p className="mt-2">
                Monster yang sudah diklasifikasi akan ditandai dengan:
                <div className="flex justify-center gap-4 mt-2">
                  <span className="inline-flex items-center">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mr-1">
                      😊
                    </div>
                    Normal
                  </span>

                  <span className="inline-flex items-center">
                    <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center mr-1">
                      <AlertTriangle
                        size={12}
                        className="text-yellow-300 drop-shadow-[0_0_2px_black]"
                      />
                    </div>
                    Terinfeksi
                  </span>
                </div>
              </p>
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-800 mb-2">
              Langkah 5: Selesaikan Semua Monster
            </h4>
            <p className="text-indigo-700 text-sm">
              Progress bar akan menunjukkan jumlah monster yang telah diperiksa:
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '65%' }}
                />
              </div>
              <p className="mt-1 text-xs text-indigo-600">
                Kamu telah memeriksa 13 dari 20 monster
              </p>
            </p>
            <p className="text-indigo-700 text-sm mt-2">
              Tombol submit akan aktif setelah semua monster selesai
              diklasifikasikan.
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Tips
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Teliti Karakteristik:</strong> Perhatikan setiap detail
              monster - warna, bentuk tubuh, dan mulut. Karakteristik ini akan
              membantu navigasi pohon keputusan.
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
              <strong>Periksa Progress:</strong> Pastikan semua monster sudah
              diklasifikasikan sebelum submit. Progress bar akan menunjukkan
              jumlah monster yang sudah diperiksa.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Contoh */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">
          Contoh Klasifikasi
        </h3>

        {/* Contoh Normal */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-6">
          <h4 className="font-medium text-green-600">Contoh Monster Normal</h4>
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
            <strong>Diberikan:</strong> Monster dengan karakteristik:
            <ul className="list-disc pl-5 mt-1">
              <li>Warna: Biru</li>
              <li>Bentuk Tubuh: Bulat</li>
              <li>Mulut: Bertaring</li>
            </ul>
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
            height="250px"
          />
          <p className="text-sm text-gray-700">
            <strong>Analisis:</strong> Monster ini biru dengan tubuh bulat dan
            bertaring. Karena terdapat pada pohon keputusan, maka{' '}
            <strong>sesuai</strong> dengan kriteria <strong>normal</strong>.
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✓ Diklasifikasikan sebagai Normal
            </span>
          </div>
        </div>

        {/* Contoh Terinfeksi */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-red-600">
            Contoh Monster Terinfeksi
          </h4>
          <div className="flex justify-center">
            <MonsterCharacter
              selections={{
                Color: 'Red',
                Body: 'Orb',
                Mouth: 'Fangs'
              }}
            />
          </div>
          <p className="text-sm text-gray-700">
            <strong>Diberikan:</strong> Monster dengan karakteristik:
            <ul className="list-disc pl-5 mt-1">
              <li>Warna: Merah</li>
              <li>Bentuk Tubuh: Bulat</li>
              <li>Mulut: Bertaring</li>
            </ul>
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
              Color: 'Red',
              Body: 'Orb',
              Mouth: 'Fangs'
            }}
            height="250px"
          />
          <p className="text-sm text-gray-700">
            <strong>Analisis:</strong> {'  '}
            Monster ini merah dengan tubuh bulat dan bertaring. Karena tidak
            terdapat pada pohon keputusan, maka <strong>
              tidak sesuai
            </strong>{' '}
            dengan kriteria normal (<strong>terinfeksi</strong>).
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              ⚠ Diklasifikasikan sebagai Terinfeksi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
