'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Info,
  Lightbulb,
  Target,
  Fish,
  MousePointer,
  Eye,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Shape } from '@/components/features/question/cfg/shared/shape';

export function CfgHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tujuan Permainan
        </h3>
        <p className="text-gray-700 text-base">
          <strong>Misi Anda:</strong> Bantu nelayan menukar koleksi ikan yang
          dia miliki sekarang menjadi koleksi ikan yang diinginkan pelanggannya.
          Anda adalah &quot;penasihat perdagangan&quot; yang akan membantu
          nelayan memilih aturan perdagangan yang tepat untuk mencapai target.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Kenali Elemen-elemen di Layar
        </h3>
        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-base font-bold flex-shrink-0 mt-1">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-base mb-1">
                  Meja Perdagangan Ikan (Kiri)
                </p>
                <p className="text-red-700 text-sm leading-relaxed">
                  Tabel yang menampilkan semua aturan perdagangan. Setiap baris
                  = 1 aturan. Kolom kiri = ikan yang harus Anda berikan, kolom
                  kanan = ikan yang akan Anda dapatkan.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-base font-bold flex-shrink-0 mt-1">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-base mb-1">
                  Koleksi Ikan Sekarang (Kanan Atas)
                </p>
                <p className="text-red-700 text-sm leading-relaxed">
                  Ikan-ikan yang dimiliki nelayan saat ini. Anda bisa KLIK
                  ikan-ikan ini untuk memilihnya.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-base font-bold flex-shrink-0 mt-1">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-base mb-1">
                  Target Koleksi Ikan (Kanan Bawah)
                </p>
                <p className="text-red-700 text-sm leading-relaxed">
                  Koleksi ikan yang diinginkan pelanggan. Ini adalah tujuan
                  akhir Anda.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-base font-bold flex-shrink-0 mt-1">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-base mb-1">
                  Petunjuk Dinamis (Atas)
                </p>
                <p className="text-red-700 text-sm leading-relaxed">
                  Kotak berwarna yang memberikan petunjuk tentang apa yang harus
                  Anda lakukan selanjutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Langkah-langkah Bermain (IKUTI URUTAN INI!)
        </h3>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-2 border-green-400">
          <h4 className="font-bold text-green-800 mb-3 text-lg">
            🎯 CONTOH LENGKAP: Dari Awal Sampai Selesai
          </h4>
          <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
            <p className="font-semibold text-blue-800 mb-3">
              Skenario: Anda memiliki ikan Hijau dan Pink, ingin mendapatkan
              ikan Biru
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Koleksi Saat Ini:
                  </p>
                  <div className="flex justify-center gap-3 p-4 bg-gray-100 rounded min-h-[100px] items-center">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <Shape type="fish_green" size="sm" />
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center">
                      <Shape type="fish_pink" size="sm" />
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center">
                      <Shape type="fish_orange" size="sm" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <ArrowRight className="w-8 h-8 mx-auto text-blue-600" />
                  <p className="text-sm font-bold text-blue-600">GOAL</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Target:
                  </p>
                  <div className="flex justify-center gap-3 p-4 bg-yellow-100 rounded min-h-[100px] items-center">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <Shape type="fish_blue" size="sm" />
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center">
                      <Shape type="fish_orange" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                1
              </div>
              LANGKAH 1: Baca Meja Perdagangan
            </h4>
            <div className="space-y-3">
              <p className="text-blue-700 font-medium">
                Pertama-tama, lihat tabel aturan perdagangan di sebelah KIRI
                layar.
              </p>
              <div className="bg-white p-4 rounded border-2 border-blue-200">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Contoh aturan yang tersedia:</strong>
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center p-3 bg-gray-50 rounded">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Berikan:</p>
                      <div className="flex justify-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_green" size="sm" />
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_pink" size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-lg font-bold text-gray-700">
                      →
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Dapatkan:</p>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_blue" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center p-3 bg-gray-50 rounded">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Berikan:</p>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_orange" size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-lg font-bold text-gray-700">
                      →
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Dapatkan:</p>
                      <div className="flex justify-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_pink" size="sm" />
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_green" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>PENTING:</strong> Lihat semua aturan yang tersedia
                  sebelum mulai bermain. Rencanakan strategi Anda!
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                2
              </div>
              LANGKAH 2: Pilih Ikan dengan KLIK
            </h4>
            <div className="space-y-3">
              <p className="text-green-700 font-medium">
                Klik pada ikan-ikan di &quot;Koleksi Ikan Sekarang&quot; (kotak
                kanan atas) yang sesuai dengan aturan.
              </p>
              <div className="bg-white p-4 rounded border-2 border-green-200">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>
                    Contoh: Untuk menggunakan aturan Hijau+Pink→Biru, klik ikan
                    hijau dan pink:
                  </strong>
                </p>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Sebelum diklik (normal):
                    </p>
                    <div className="flex justify-center gap-3 p-6 bg-gray-100 rounded min-h-[120px] items-center">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Shape type="fish_green" size="sm" />
                      </div>
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Shape type="fish_pink" size="sm" />
                      </div>
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Shape type="fish_orange" size="sm" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <ArrowRight className="w-6 h-6 mx-auto text-green-600" />
                    <p className="text-sm font-bold text-green-600">
                      KLIK ikan hijau dan pink
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Setelah diklik (menyala biru dengan animasi):
                    </p>
                    <div className="flex justify-center gap-3 p-6 bg-gray-100 rounded min-h-[120px] items-center">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Shape type="fish_green" size="sm" selected={true} />
                      </div>
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Shape type="fish_pink" size="sm" selected={true} />
                      </div>
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Shape type="fish_orange" size="sm" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      ⚠️ Perhatikan: Ikan yang dipilih memiliki border biru,
                      background biru muda, efek bayangan, dan beranimasi!
                    </p>
                  </div>
                </div>
              </div>
              <Alert>
                <MousePointer className="h-4 w-4" />
                <AlertDescription>
                  <strong>TIPS PENTING:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>
                      Urutan mengklik tidak penting (bisa klik pink dulu, hijau
                      dulu, sama saja)
                    </li>
                    <li>
                      Yang penting: pilih ikan yang BERSEBELAHAN di koleksi Anda
                    </li>
                    <li>Ikan terpilih akan menyala biru dan beranimasi</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </div>
              LANGKAH 3: Lihat Baris Hijau di Tabel
            </h4>
            <div className="space-y-3">
              <p className="text-purple-700 font-medium">
                Setelah memilih ikan yang tepat, baris di tabel perdagangan akan
                MENYALA HIJAU dan BERKILAU.
              </p>
              <div className="bg-white p-4 rounded border-2 border-purple-200">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>
                    Contoh baris yang bisa diterapkan (menyala hijau):
                  </strong>
                </p>
                <div
                  className="border-b-4 border-blue-400 last:border-b-0 transition-all duration-500 bg-gradient-to-r from-green-300 to-green-400 ring-4 ring-green-500 ring-opacity-90 shadow-2xl cursor-pointer animate-pulse border-green-500"
                  style={{
                    boxShadow:
                      '0 0 40px rgba(34, 197, 94, 1), 0 0 80px rgba(34, 197, 94, 0.8), 0 0 120px rgba(34, 197, 94, 0.6)',
                    animation: 'glowOutward 1.5s ease-in-out infinite alternate'
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-center items-center p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_green" size="sm" />
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_pink" size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded">
                      <div className="flex">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Shape type="fish_blue" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <style jsx>{`
                  @keyframes glowOutward {
                    0% {
                      box-shadow:
                        0 0 20px rgba(34, 197, 94, 0.7),
                        0 0 40px rgba(34, 197, 94, 0.5),
                        0 0 60px rgba(34, 197, 94, 0.3);
                    }
                    100% {
                      box-shadow:
                        0 0 40px rgba(34, 197, 94, 1),
                        0 0 80px rgba(34, 197, 94, 0.8),
                        0 0 120px rgba(34, 197, 94, 0.6);
                    }
                  }
                `}</style>
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>VISUAL YANG HARUS DICARI:</strong> Baris hijau terang
                  dengan efek berkilau menandakan aturan yang bisa diterapkan!
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                4
              </div>
              LANGKAH 4: KLIK Baris Hijau
            </h4>
            <div className="space-y-3">
              <p className="text-orange-700 font-medium">
                Klik langsung pada baris hijau tersebut untuk menerapkan aturan
                perdagangan.
              </p>
              <div className="bg-white p-4 rounded border-2 border-orange-200">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Apa yang terjadi setelah klik:</strong>
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Sebelum:
                      </p>
                      <div className="flex justify-center gap-3 p-6 bg-gray-100 rounded min-h-[120px] items-center">
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Shape type="fish_green" size="sm" selected={true} />
                        </div>
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Shape type="fish_pink" size="sm" selected={true} />
                        </div>
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Shape type="fish_orange" size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <ArrowRight className="w-8 h-8 mx-auto text-orange-600" />
                      <p className="text-sm font-bold text-orange-600">
                        KLIK BARIS HIJAU
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Sesudah:
                      </p>
                      <div className="flex justify-center gap-4 p-6 bg-green-100 rounded min-h-[120px] items-center">
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Shape type="fish_blue" size="sm" />
                        </div>
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Shape type="fish_orange" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Alert>
                <Fish className="h-4 w-4" />
                <AlertDescription>
                  <strong>HASIL:</strong> Ikan hijau + pink hilang, diganti
                  dengan ikan biru. Sekarang Anda sudah mencapai target!
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                5
              </div>
              LANGKAH 5: Ulangi Jika Belum Selesai
            </h4>
            <div className="space-y-3">
              <p className="text-yellow-700 font-medium">
                Jika koleksi Anda belum sama dengan target, ulangi langkah 2-4
                sampai selesai.
              </p>
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>SELESAI:</strong> Permainan berakhir ketika
                  &quot;Koleksi Ikan Sekarang&quot; PERSIS SAMA dengan
                  &quot;Target Koleksi Ikan&quot;. Nelayan akan terlihat senang!
                  🎉
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Tips Penting untuk Sukses
        </h3>
        <div className="space-y-4">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              <strong>STRATEGI UTAMA:</strong> Selalu mulai dengan melihat
              TARGET terlebih dahulu, lalu cari aturan perdagangan yang bisa
              membantu Anda mencapainya. Jangan asal pilih ikan!
            </AlertDescription>
          </Alert>

          <Alert>
            <MousePointer className="h-4 w-4" />
            <AlertDescription>
              <strong>CARA KLIK YANG BENAR:</strong> Klik ikan satu per satu
              sampai semuanya menyala biru. Kalau ada yang salah, klik lagi
              untuk membatalkan pilihan.
            </AlertDescription>
          </Alert>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>TANDA SUKSES:</strong> Jika Anda memilih ikan yang benar,
              akan ada baris hijau berkilau di tabel. Kalau tidak ada yang
              hijau, berarti pilihan Anda salah.
            </AlertDescription>
          </Alert>

          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              <strong>JIKA STUCK:</strong> Gunakan tombol &quot;Batalkan&quot;
              untuk mundur satu langkah, atau &quot;Reset&quot; untuk mulai dari
              awal. Jangan malu untuk mengulang!
            </AlertDescription>
          </Alert>

          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-400">
            <h4 className="font-bold text-red-800 mb-3">
              ⚠️ KESALAHAN UMUM YANG HARUS DIHINDARI:
            </h4>
            <ul className="space-y-2 text-red-700">
              <li>
                • <strong>Tidak baca target dulu:</strong> Harus lihat target
                sebelum pilih ikan!
              </li>
              <li>
                • <strong>Pilih ikan yang tidak bersebelahan:</strong> Ikan
                harus bersebelahan di koleksi Anda!
              </li>
              <li>
                • <strong>Tidak lihat baris hijau:</strong> Kalau tidak ada yang
                hijau, jangan dipaksa klik!
              </li>
              <li>
                • <strong>Terburu-buru:</strong> Ambil waktu untuk merencanakan
                strategi!
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border-2 border-cyan-400">
        <h4 className="font-semibold text-cyan-800 mb-3 text-lg flex items-center gap-2">
          🎣 Petunjuk Visual dari Nelayan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-cyan-200">
            <div className="text-center mb-2">
              <div className="text-3xl">👋</div>
              <p className="font-bold text-cyan-800">Melambaikan Tangan</p>
            </div>
            <p className="text-cyan-700 text-sm">
              Nelayan siap memulai atau menunggu Anda mengambil tindakan
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-cyan-200">
            <div className="text-center mb-2">
              <div className="text-3xl">🤔</div>
              <p className="font-bold text-cyan-800">Berpikir</p>
            </div>
            <p className="text-cyan-700 text-sm">
              Nelayan sedang mempertimbangkan pilihan ikan yang Anda pilih
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-cyan-200">
            <div className="text-center mb-2">
              <div className="text-3xl">😄</div>
              <p className="font-bold text-cyan-800">Senang</p>
            </div>
            <p className="text-cyan-700 text-sm">
              Target tercapai! Perdagangan berhasil diselesaikan!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg border-2 border-yellow-500">
        <h4 className="font-bold text-yellow-800 mb-3 text-lg">
          🚀 RINGKASAN CEPAT:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="font-semibold text-yellow-800">LANGKAH SINGKAT:</p>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Lihat TARGET di kanan bawah</li>
              <li>Pilih ikan dengan KLIK</li>
              <li>Cari baris HIJAU di tabel</li>
              <li>KLIK baris hijau</li>
              <li>Ulangi sampai selesai</li>
            </ol>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-yellow-800">
              TANDA VISUAL PENTING:
            </p>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>Ikan terpilih: border biru + animasi</li>
              <li>Aturan bisa dipakai: baris hijau berkilau</li>
              <li>Nelayan senang: target tercapai!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
