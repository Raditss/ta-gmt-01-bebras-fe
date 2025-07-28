'use client';

import Image from 'next/image';

export type FishermanMood = 'wave' | 'thinking' | 'happy' | 'standard';

export interface FishermanProps {
  mood: FishermanMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showHalfBody?: boolean;
  className?: string;
  position?: 'behind' | 'front';
}

export function Fisherman({
  mood = 'standard',
  size = 'md',
  showHalfBody = false,
  className = '',
  position = 'front'
}: FishermanProps) {
  const getFishermanImage = (mood: FishermanMood) => {
    switch (mood) {
      case 'wave':
        return '/kenney_fish-pack_2/Double/Fisherman-wave.png';
      case 'thinking':
        return '/kenney_fish-pack_2/Double/Fisherman-thinking.png';
      case 'happy':
        return '/kenney_fish-pack_2/Double/Fisherman-happy.png';
      case 'standard':
      default:
        return '/kenney_fish-pack_2/Double/Fisherman-standard.png';
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-30',
    lg: 'w-32 h-40',
    xl: 'w-48 h-60'
  };

  const sizeValues = {
    sm: { width: 64, height: 80 },
    md: { width: 96, height: 120 },
    lg: { width: 128, height: 160 },
    xl: { width: 192, height: 240 }
  };

  const getMoodAltText = (mood: FishermanMood) => {
    switch (mood) {
      case 'wave':
        return 'Nelayan sedang melambaikan tangan';
      case 'thinking':
        return 'Nelayan sedang berpikir';
      case 'happy':
        return 'Nelayan terlihat senang';
      case 'standard':
      default:
        return 'Nelayan';
    }
  };

  const baseClasses = `
    ${sizeClasses[size]}
    relative
    ${position === 'behind' ? 'z-0' : 'z-10'}
    ${showHalfBody ? 'overflow-hidden' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={baseClasses}>
      <Image
        src={getFishermanImage(mood)}
        alt={getMoodAltText(mood)}
        width={sizeValues[size].width}
        height={sizeValues[size].height}
        className={`
          object-contain w-full h-full
          ${showHalfBody ? 'object-top' : ''}
        `}
        priority={mood === 'wave'} // Prioritize wave (intro mood)
      />
      {/* Add subtle animation for mood changes - no pulsating */}
      {mood === 'thinking' && (
        <div className="absolute top-2 right-2">
          <div className="animate-ping bg-yellow-300 opacity-75 rounded-full w-3 h-3" />
        </div>
      )}
    </div>
  );
}

// Fisherman context/story component
export function FishermanStory() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 shadow-lg border border-blue-200">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {/* No pulsating animation - just static fisherman */}
          <Fisherman mood="wave" size="lg" />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            🐟 Petualangan Nelayan Tukar Ikan
          </h2>

          <div className="space-y-3 text-gray-700">
            <p>
              Di sebuah desa pesisir yang indah, hiduplah seorang nelayan bijak
              yang memiliki koleksi ikan yang beragam. Nelayan ini dikenal di
              seluruh desa karena kemampuannya menukar ikan dengan cara yang
              unik dan teratur.
            </p>

            <p>
              Nelayan ini memiliki <strong>aturan khusus</strong> dalam menukar
              ikan-ikannya. Dia tidak bisa menukar ikan secara sembarangan -
              ikan-ikan harus ditukar dalam <strong>urutan yang tepat</strong>{' '}
              agar perdagangan berjalan lancar dan semua pihak mendapat
              keuntungan.
            </p>

            <p>
              Hari ini, nelayan membutuhkan bantuan Anda! Dia ingin mengubah
              koleksi ikan yang dia miliki sekarang menjadi koleksi ikan yang
              diinginkan pelanggannya. Namun, dia harus mengikuti aturan
              perdagangan yang telah ditetapkan di desanya.
            </p>

            <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold text-blue-800">
                🎯 Misi Anda: Bantu nelayan menukar ikan-ikannya dari kondisi
                awal menjadi kondisi target menggunakan aturan perdagangan yang
                tersedia!
              </p>
            </div>

            <p className="text-sm text-gray-600 italic">
              💡 Ingat: Setiap langkah perdagangan harus mengikuti aturan yang
              ada. Pilih ikan-ikan yang akan ditukar, lalu terapkan aturan
              perdagangan yang sesuai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
