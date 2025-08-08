import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RulesTableShared } from '@/components/features/question/cfg/shared/rules-table.shared';
import { StateDisplaySolve } from '@/components/features/question/cfg/solve/state-display.solve';
import {
  FishermanStory,
  Fisherman
} from '@/components/features/question/cfg/shared/fisherman';
import { Rule, State } from '@/types/cfg.type';
import {
  IntroductionPage,
  ComponentsPage,
  DerivationPage,
  ParseTreePage,
  ApplicationsPage
} from './cfg-pages';

interface CFGStudyProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

// Game intro component with interactive demo - exact replica of solver layout
const GameIntroPage = ({
  startGame,
  selectedIndices,
  currentDemoState,
  exampleTargetState,
  exampleRules,
  handleStateClick,
  applyDemoRule,
  resetDemo,
  _exampleStartState
}: {
  startGame: (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT') => void;
  selectedIndices: number[];
  currentDemoState: State[];
  exampleTargetState: State[];
  exampleRules: Rule[];
  handleStateClick: (index: number) => void;
  applyDemoRule: (rule: Rule) => void;
  resetDemo: () => void;
  _exampleStartState: State[];
}) => {
  // Demo logic for applicable rules - simplified version
  const getDemoApplicableRules = () => {
    if (selectedIndices.length === 0) return [];

    const selectedTypes = selectedIndices
      .sort((a, b) => a - b)
      .map((i) => currentDemoState[i]?.type)
      .filter(Boolean);

    return exampleRules.filter((rule) => {
      if (rule.before.length !== selectedTypes.length) return false;
      return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
    });
  };

  const getCurrentHint = () => {
    // Check if game is complete
    const isComplete =
      JSON.stringify(currentDemoState.map((s) => s.type).sort()) ===
      JSON.stringify(exampleTargetState.map((s) => s.type).sort());

    if (isComplete) {
      return {
        type: 'success',
        message: '🎉 Selamat! Anda telah mencapai target koleksi ikan!'
      };
    }

    if (selectedIndices.length === 0) {
      return {
        type: 'info',
        message:
          '👆 Mulai dengan mengklik ikan di "Koleksi Ikan Sekarang" yang ingin Anda tukar. Lihat aturan perdagangan di sebelah kiri untuk mengetahui kombinasi ikan yang bisa ditukar.'
      };
    }

    const applicableRules = getDemoApplicableRules();
    if (applicableRules.length === 0) {
      return {
        type: 'warning',
        message:
          '⚠️ Tidak ada aturan yang bisa diterapkan untuk ikan yang dipilih. Coba pilih kombinasi ikan lain yang sesuai dengan aturan perdagangan.'
      };
    }

    return {
      type: 'success',
      message: `✅ Bagus! Ada ${applicableRules.length} aturan perdagangan yang bisa diterapkan. Klik pada baris biru di tabel aturan perdagangan untuk menerapkannya.`
    };
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl">🎮</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Game: Petualangan Nelayan CFG
        </h1>
        <p className="text-lg text-gray-600">
          Mari belajar CFG melalui game interaktif yang menyenangkan!
        </p>
      </div>

      {/* Game Story */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-3xl border border-purple-200">
        <FishermanStory />
      </div>

      {/* How to Play Instructions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl border-2 border-green-300 shadow-lg">
        <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">
          📖 Cara Bermain Game Fish Trader CFG
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm">
              <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Pilih Ikan untuk Ditukar
              </h4>
              <p className="text-gray-700 mb-3">
                Klik pada ikan di &quot;Koleksi Ikan Sekarang&quot; yang ingin
                Anda tukar. Ikan yang dipilih akan menyala biru dengan efek
                animasi.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  💡 <strong>Tips:</strong> Urutan mengklik tidak penting, yang
                  penting adalah memilih ikan yang sesuai dengan aturan
                  perdagangan.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm">
              <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Lihat Aturan yang Bisa Diterapkan
              </h4>
              <p className="text-gray-700 mb-3">
                Setelah memilih ikan yang tepat, baris di &quot;Meja Perdagangan
                Ikan&quot; akan berkedip biru, menandakan aturan yang bisa
                diterapkan.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  💡 <strong>Tips:</strong> Jika tidak ada baris yang berkedip
                  biru, berarti kombinasi ikan yang Anda pilih tidak sesuai
                  dengan aturan manapun.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm">
              <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Klik Aturan Perdagangan
              </h4>
              <p className="text-gray-700 mb-3">
                Klik pada baris yang berkedip biru untuk menerapkan aturan
                perdagangan. Ikan akan berubah sesuai dengan aturan yang
                dipilih.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  💡 <strong>Tips:</strong> Perhatikan kolom kiri (ikan yang
                  diberikan) dan kolom kanan (ikan yang didapat) di tabel
                  aturan.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm">
              <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Ulangi Sampai Target Tercapai
              </h4>
              <p className="text-gray-700 mb-3">
                Lanjutkan proses perdagangan sampai &quot;Koleksi Ikan
                Sekarang&quot; sama persis dengan &quot;Target Koleksi
                Ikan&quot;.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  💡 <strong>Tips:</strong> Gunakan tombol &quot;Reset
                  Demo&quot; jika ingin mengulang dari awal.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border border-yellow-300">
          <h4 className="text-xl font-bold text-yellow-800 mb-3 text-center">
            🎯 Tujuan Game
          </h4>
          <p className="text-center text-gray-700 text-lg">
            Bantu nelayan mengubah koleksi ikan yang dia miliki sekarang menjadi
            koleksi ikan yang diinginkan pelanggannya dengan menggunakan aturan
            perdagangan yang tersedia!
          </p>
        </div>
      </div>

      {/* Interactive Demo - EXACT same layout as solver page */}
      <div className="max-w-full mx-auto p-6 bg-white border-2 border-purple-300 rounded-3xl shadow-lg">
        <h3 className="text-3xl font-bold text-purple-800 mb-4 text-center">
          Demo Interaktif Game CFG
        </h3>

        {/* Guided Hints Section - same as solver */}
        <div className="mb-6">
          {(() => {
            const hint = getCurrentHint();
            if (!hint) return null;

            const bgColor = {
              info: 'bg-blue-50 border-blue-200',
              warning: 'bg-yellow-50 border-yellow-200',
              success: 'bg-green-50 border-green-200'
            }[hint.type];

            const textColor = {
              info: 'text-blue-800',
              warning: 'text-yellow-800',
              success: 'text-green-800'
            }[hint.type];

            return (
              <div className={`${bgColor} border-2 rounded-lg p-4`}>
                <div className={`${textColor} font-medium`}>{hint.message}</div>
              </div>
            );
          })()}
        </div>

        {/* Main Layout - 50/50 Split EXACTLY like solver */}
        <div className="grid grid-cols-2 gap-6">
          {/* Trading Table - Left side (50% width) */}
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex justify-center items-start mb-2">
              <h2 className="text-2xl font-bold text-center text-foreground">
                📋 Meja Perdagangan Ikan
              </h2>
            </div>
            <div className="overflow-visible">
              <RulesTableShared
                rules={exampleRules}
                isInteractive={true}
                applicableRules={getDemoApplicableRules()}
                onApplyRule={applyDemoRule}
              />
            </div>
          </div>

          {/* Right side - Current and Target states (50% width) */}
          <div className="space-y-4">
            <div className="sticky top-[12vh]">
              {/* Current State Title */}
              <h2 className="text-xl font-bold mb-4 text-center">
                🐟 Koleksi Ikan Sekarang
              </h2>

              {/* Current State with Fisherman - EXACT same as solver */}
              <div className="bg-card rounded-lg p-4 shadow-lg border mb-6 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-0">
                  <Fisherman
                    mood={selectedIndices.length > 0 ? 'thinking' : 'wave'}
                    size="md"
                    showHalfBody={true}
                    position="behind"
                    className="opacity-90"
                  />
                </div>
                <StateDisplaySolve
                  title=""
                  state={currentDemoState}
                  isInteractive={true}
                  selectedIndices={selectedIndices}
                  onObjectClick={handleStateClick}
                  containerClassName="bg-transparent border-none p-0 relative z-10"
                />
              </div>

              {/* Blinking Arrow - same as solver */}
              <div className="flex justify-center mb-3 items-center gap-3">
                <div className="animate-bounce">
                  <span className="text-2xl">⬇️</span>
                </div>
                <div className="flex items-center">
                  <span className="text-base font-bold text-white bg-blue-600 px-2 py-1 rounded-full">
                    Tukar menjadi
                  </span>
                </div>
                <div className="animate-bounce">
                  <span className="text-2xl">⬇️</span>
                </div>
              </div>

              {/* Target State Title */}
              <h2 className="text-xl font-bold mb-3 text-center">
                🎯 Target Koleksi Ikan
              </h2>

              {/* Target State - same as solver */}
              <div className="bg-card rounded-lg p-4 shadow-lg border">
                <StateDisplaySolve
                  title=""
                  state={exampleTargetState}
                  containerClassName="bg-transparent border-none p-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - same as solver */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button onClick={resetDemo} variant="outline">
            🔄 Reset Demo
          </Button>
        </div>
      </div>

      {/* Fisherman Character - Centered */}
      <div className="flex flex-col items-center justify-center text-center">
        <Fisherman mood="wave" />
        <p className="text-purple-700 mt-4 italic text-lg max-w-2xl">
          &quot;Selamat datang di dunia CFG! Mari kita mulai berdagang
          ikan!&quot;
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white p-8 rounded-3xl border-2 border-purple-300 shadow-lg">
        <h3 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          🎯 Mulai Bermain!
        </h3>
        <p className="text-purple-700 mb-8 text-center text-lg">
          Pilih tingkat kesulitan untuk memulai petualangan CFG Anda:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Button
            onClick={() => startGame('EASY')}
            className="bg-green-500 hover:bg-green-600 text-white h-20 text-lg font-bold transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-xl">🟢 Mudah</div>
              <div className="text-sm opacity-90">2-3 langkah</div>
            </div>
          </Button>

          <Button
            onClick={() => startGame('MEDIUM')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white h-20 text-lg font-bold transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-xl">🟡 Sedang</div>
              <div className="text-sm opacity-90">3-5 langkah</div>
            </div>
          </Button>

          <Button
            onClick={() => startGame('HARD')}
            className="bg-orange-500 hover:bg-orange-600 text-white h-20 text-lg font-bold transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-xl">🟠 Sulit</div>
              <div className="text-sm opacity-90">5-8 langkah</div>
            </div>
          </Button>

          <Button
            onClick={() => startGame('EXPERT')}
            className="bg-red-500 hover:bg-red-600 text-white h-20 text-lg font-bold transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-xl">🔴 Ahli</div>
              <div className="text-sm opacity-90">7-10 langkah</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Example data for game demonstration using proper fish types
const exampleRules: Rule[] = [
  {
    id: 'rule1',
    before: [
      { id: 1, type: 'fish_green' },
      { id: 2, type: 'fish_pink' }
    ],
    after: [{ id: 3, type: 'fish_blue' }]
  },
  {
    id: 'rule2',
    before: [{ id: 4, type: 'fish_orange' }],
    after: [
      { id: 5, type: 'fish_pink' },
      { id: 6, type: 'fish_green' }
    ]
  },
  {
    id: 'rule3',
    before: [{ id: 7, type: 'fish_blue' }],
    after: [
      { id: 8, type: 'fish_brown' },
      { id: 9, type: 'fish_red' }
    ]
  }
];

const exampleStartState: State[] = [
  { id: 1, type: 'fish_green' },
  { id: 2, type: 'fish_pink' },
  { id: 3, type: 'fish_orange' }
];

const exampleTargetState: State[] = [
  { id: 1, type: 'fish_blue' },
  { id: 2, type: 'fish_orange' }
];

export default function CFGStudy({
  currentPage,
  setCurrentPage: _setCurrentPage
}: CFGStudyProps) {
  const router = useRouter();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentDemoState, setCurrentDemoState] =
    useState<State[]>(exampleStartState);

  const handleStateClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const applyDemoRule = (rule: Rule) => {
    if (selectedIndices.length === 0) return;

    // Sort indices to maintain proper order
    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    const newState = [...currentDemoState];

    // Remove the selected items (from highest index to lowest to avoid shifting)
    for (let i = sortedIndices.length - 1; i >= 0; i--) {
      newState.splice(sortedIndices[i], 1);
    }

    // Add the new items at the position of the first selected item
    newState.splice(sortedIndices[0], 0, ...rule.after);

    setCurrentDemoState(newState);
    setSelectedIndices([]);
  };

  const startGame = (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT') => {
    // Clear any existing question first
    sessionStorage.removeItem('generatedQuestion');
    console.log('🎯 Starting game with difficulty:', difficulty);
    // Navigate to generated solve page with difficulty as query parameter
    router.push(`/problems/generated/CFG/solve?difficulty=${difficulty}`);
  };

  const resetDemo = () => {
    setCurrentDemoState([...exampleStartState]);
    setSelectedIndices([]);
  };

  // Array of page components
  const pageComponents = [
    IntroductionPage,
    ComponentsPage,
    DerivationPage,
    ParseTreePage,
    ApplicationsPage,
    () => (
      <GameIntroPage
        startGame={startGame}
        selectedIndices={selectedIndices}
        currentDemoState={currentDemoState}
        exampleTargetState={exampleTargetState}
        exampleRules={exampleRules}
        handleStateClick={handleStateClick}
        applyDemoRule={applyDemoRule}
        resetDemo={resetDemo}
        _exampleStartState={exampleStartState}
      />
    )
  ];

  // Get the current page component
  const CurrentPageComponent = pageComponents[currentPage] || pageComponents[0];

  return <CurrentPageComponent />;
}
