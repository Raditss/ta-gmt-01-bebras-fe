import { Microscope, Shield, Skull, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GeneratedResultDialogProps {
  isOpen: boolean;
  isCorrect?: boolean | null;
  onClose?: () => void;
}

const GeneratedContagionProtocolResultDialog = ({
  isOpen,
  isCorrect,
  onClose
}: GeneratedResultDialogProps) => {
  const router = useRouter();
  if (!isOpen) return null;

  const getStatusInfo = () => {
    if (isCorrect) {
      return {
        status: 'BENAR',
        threat: 'MONSTER BERHASIL DIEVAKUASI',
        message:
          'Protokol kontainmen berhasil! Monster telah diamankan dan dipindahkan ke fasilitas karantina. Laboratorium tetap aman.',
        color: 'text-emerald-400',
        bgGlow: 'bg-emerald-500/20',
        borderGlow: 'border-emerald-500/50',
        icon: <Shield className="w-12 h-12 text-emerald-400" />,
        bgPattern: 'bg-emerald-950/30'
      };
    }
    return {
      status: 'SALAH',
      threat: 'VIRUS MENYEBAR KE LABORATORIUM',
      message:
        'Kontainmen gagal! Virus telah menyebar ke seluruh fasilitas laboratorium. Tim dekontaminasi darurat telah dikerahkan.',
      color: 'text-red-400',
      bgGlow: 'bg-red-500/20',
      borderGlow: 'border-red-500/50',
      icon: <Skull className="w-12 h-12 text-red-400" />,
      bgPattern: 'bg-red-950/30'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Microscope className="w-8 h-8 text-cyan-300" />
              <div>
                <h2 className="text-2xl font-bold text-cyan-300">HASIL</h2>
                <p className="text-slate-400 text-sm">Analisis Selesai</p>
              </div>
            </div>

            {onClose ? (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-cyan-300 transition-colors p-2 hover:bg-slate-700 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push('/problems');
                }}
                className="text-slate-400 hover:text-cyan-300 transition-colors p-2 hover:bg-slate-700 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Tampilan Utama Hasil */}
          <div
            className={`${statusInfo.bgGlow} ${statusInfo.bgPattern} border-2 ${statusInfo.borderGlow} rounded-lg p-8 mb-6`}
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">{statusInfo.icon}</div>

              <h3 className={`text-4xl font-bold mb-2 ${statusInfo.color}`}>
                {statusInfo.status}
              </h3>

              <p className={`text-lg ${statusInfo.color} opacity-80 mb-6`}>
                {statusInfo.threat}
              </p>

              <div className="bg-slate-800/40 border border-slate-600/30 rounded-lg p-4 mb-6 max-w-lg mx-auto">
                <p className="text-slate-200 text-sm leading-relaxed">
                  {statusInfo.message}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Laboratorium */}
          <div className="text-center text-slate-500 text-xs mt-8">
            <p>█ SISTEM LABORATORIUM v2.1.4 █</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedContagionProtocolResultDialog;
