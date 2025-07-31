'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, BookOpen } from 'lucide-react';

export function NotImplementedHelp() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Help Not Available
        </h3>
        <p className="text-gray-700">
          Help content for this question type is not yet available. Please refer
          to the question description and instructions for guidance on how to
          solve this problem.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Info className="w-5 h-5" />
          General Tips
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Baca Instruksi dengan Teliti
            </h4>
            <p className="text-blue-700 text-sm">
              Pastikan untuk membaca semua instruksi dan deskripsi soal dengan
              teliti. Deskripsi masalah biasanya berisi petunjuk penting tentang
              cara mendekati solusi.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Pahami Tujuan</h4>
            <p className="text-green-700 text-sm">
              Identifikasi apa yang diminta oleh soal. Cari kata kunci seperti
              &quot;temukan&quot;, &quot;hitung&quot;, &quot;tentukan&quot;,
              atau &quot;selesaikan&quot; untuk memahami hasil yang diharapkan.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Pecah Masalah</h4>
            <p className="text-purple-700 text-sm">
              Coba pecah masalah menjadi langkah-langkah yang lebih kecil dan
              dapat dikelola. Ini sering membuat masalah kompleks lebih mudah
              dipahami dan diselesaikan.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Sumber Belajar
        </h3>
        <div className="space-y-2">
          <Alert>
            <AlertDescription>
              <strong>Materi Kursus:</strong> Tinjau materi kursus, buku teks,
              dan catatan kuliah untuk konsep dan contoh yang relevan.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Soal Latihan:</strong> Cari soal latihan atau contoh
              serupa yang mungkin membantu Anda memahami pendekatan.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Minta Bantuan:</strong> Jangan ragu untuk bertanya kepada
              instruktur atau teman sekelas untuk klarifikasi jika Anda bingung.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-600">
          Strategi Pemecahan Masalah
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-700">
            <strong>1. Pahami:</strong> Baca masalah dengan teliti dan
            identifikasi apa yang perlu Anda temukan.
          </p>
          <p className="text-sm text-gray-700">
            <strong>2. Rencanakan:</strong> Pikirkan langkah-langkah yang perlu
            Anda ambil untuk mencapai solusi.
          </p>
          <p className="text-sm text-gray-700">
            <strong>3. Jalankan:</strong> Ikuti rencana Anda langkah demi
            langkah, periksa pekerjaan Anda saat berjalan.
          </p>
          <p className="text-sm text-gray-700">
            <strong>4. Tinjau:</strong> Periksa kembali jawaban Anda dan
            pastikan masuk akal.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Bantuan Umum</Badge>
        <Badge variant="secondary">Pemecahan Masalah</Badge>
        <Badge variant="secondary">Sumber Belajar</Badge>
        <Badge variant="secondary">Tips Belajar</Badge>
      </div>
    </div>
  );
}
