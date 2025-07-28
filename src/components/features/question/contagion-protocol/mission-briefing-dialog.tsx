import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface MisssionBriefingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MissionBriefingDialog = ({
  isOpen,
  onOpenChange
}: MisssionBriefingDialogProps) => {
  return (
    <>
      {/* Mission Briefing Dialog */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-900 border-2 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="bg-slate-800 border-b border-slate-600 p-6">
            <DialogTitle className="text-2xl font-bold text-cyan-300 flex items-center gap-3">
              🧬 MISI DIMULAI
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-400 font-mono">LANGSUNG</span>
              </div>
            </DialogTitle>
            <div className="text-sm text-slate-400 font-mono mt-2">
              Lab Dr. Zander • Protokol Darurat • Rahasia
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 text-slate-200">
            {/* Emergency Alert */}
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-red-400 text-2xl">🚨</div>
                <div>
                  <div className="text-red-400 font-mono text-sm font-bold">
                    PERINGATAN DARURAT
                  </div>
                  <div className="text-red-300 font-mono text-lg font-bold">
                    VIRUS TERDETEKSI!
                  </div>
                </div>
              </div>
              <div className="text-sm text-red-200">
                Beberapa monster menunjukkan tanda-tanda infeksi. Ayo bantu kami
                melakukan pemeriksaan!
              </div>
            </div>

            {/* Mission Details */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
                  👩‍🔬 Permintaan Dr. Zander
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">
                    Dr. Zander
                  </span>{' '}
                  dari Laboratorium Monster membutuhkan bantuanmu! Ada virus
                  misterius yang masuk ke laboratorium, dan beberapa monster
                  bisa jadi terinfeksi. Kamu adalah analis pilihan untuk
                  memeriksa mereka.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center gap-2">
                  🎯 Misi Kamu
                </h3>
                <div className="space-y-2 text-slate-300">
                  <p>
                    Periksa ciri-ciri setiap monster dan tentukan apakah mereka
                    sesuai dengan pola{' '}
                    <span className="text-green-400 font-semibold">
                      monster yang sehat
                    </span>{' '}
                    di dalam pohon keputusan, atau menunjukkan gejala{' '}
                    <span className="text-red-400 font-semibold">
                      infeksi virus
                    </span>
                    .
                  </p>

                  <div className="bg-blue-900/20 border border-blue-400/30 rounded p-3 mt-3">
                    <div className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                      🔬 Fakta Ilmiah
                    </div>
                    <div className="text-sm text-blue-200">
                      Monster yang sehat memiliki kombinasi ciri yang cocok
                      dengan data di pohon keputusan. Jika ada monster yang
                      berbeda dari pola itu, bisa jadi ia terinfeksi!
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
                  📋 Langkah Pemeriksaan
                </h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">1.</span>
                    <span>Pilih monster dari daftar di sebelah kiri</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">2.</span>
                    <span>
                      Klik tombol “PERIKSA MONSTER” untuk mulai pemeriksaan
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">3.</span>
                    <span>
                      Perhatikan warna, bentuk tubuh, dan mulut monster
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">4.</span>
                    <span>
                      Cocokkan ciri-cirinya dengan pohon monster yang normal
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">5.</span>
                    <span>Tentukan: NORMAL atau TERINFEKSI</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                  ⚡ Protokol Darurat
                </h3>
                <div className="text-slate-300">
                  <p className="mb-2">
                    Setelah semua monster diperiksa, protokol pengamanan akan
                    aktif.
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="text-red-400 font-semibold">
                      PERHATIAN:
                    </span>{' '}
                    Pemeriksaan harus akurat dan cepat untuk mencegah
                    penyebaran!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border-t border-slate-600 p-4 flex justify-between items-center">
            <div className="text-xs text-slate-400 font-mono">
              Status Misi:{' '}
              <span className="text-green-400 uppercase">SIAP</span>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-mono border border-slate-500"
            >
              Mengerti & Mulai Misi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionBriefingDialog;
