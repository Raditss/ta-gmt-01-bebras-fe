import {
  Monster,
  MonsterAnswer
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import { Fragment, useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FlaskConical,
  Microscope,
  Radio
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface MonsterListProps {
  monstersQuestion: Monster[];
  monstersAnswer: MonsterAnswer[];
  onClick: (monsterId: string) => void;
}

export interface MonsterListRowProps {
  monsterQuestion: Monster;
  monsterAnswer?: MonsterAnswer;
  onClick: () => void;
  selected: boolean;
}

const MonsterListRow = ({
  monsterQuestion,
  monsterAnswer,
  onClick,
  selected
}: MonsterListRowProps) => {
  const [scanAnimation, setScanAnimation] = useState(false);

  const getStatusInfo = () => {
    if (!monsterAnswer) {
      return {
        text: 'BELUM DIANALISIS',
        status: 'BELUM DIPINDAI',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        icon: <Clock className="w-3 h-3" />,
        pulse: true
      };
    }

    if (monsterAnswer.isNormal) {
      return {
        text: 'NORMAL',
        status: 'AMAN',
        color: 'bg-green-500/20 text-green-400 border-green-500/40',
        icon: <CheckCircle className="w-3 h-3" />,
        pulse: false
      };
    }

    return {
      text: 'INFECTED',
      status: 'INFEKSI TERDETEKSI',
      color: 'bg-red-500/20 text-red-400 border-red-500/40',
      icon: <AlertTriangle className="w-3 h-3" />,
      pulse: true
    };
  };

  const statusInfo = getStatusInfo();

  const handleClick = () => {
    setScanAnimation(true);
    setTimeout(() => setScanAnimation(false), 1000);
    onClick();
  };

  return (
    <div
      className={`
        relative bg-slate-900/50 border border-slate-700/50 rounded-lg mb-2 
        cursor-pointer hover:bg-slate-800/60 hover:border-blue-500/40 
        transition-all duration-300 backdrop-blur-sm
        ${scanAnimation ? 'ring-2 ring-blue-400/50 animate-pulse' : ''}
        ${selected ? 'ring-2 ring-blue-500/60 border-blue-500/50' : ''}
      `}
      onClick={handleClick}
    >
      {/* Scan line animation */}
      {scanAnimation && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan" />
        </div>
      )}

      <div className="p-4 flex items-center justify-between relative">
        {/* Monster Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-800 rounded border border-slate-600 flex items-center justify-center">
            <Radio className="w-5 h-5 text-blue-400" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                NAMA MONSTER
              </span>
              <Activity
                className={`w-3 h-3 ${statusInfo.pulse ? 'animate-pulse text-blue-400' : 'text-slate-500'}`}
              />
            </div>
            <span className="font-mono text-lg text-slate-200 font-bold">
              {monsterQuestion.name}
            </span>
          </div>
        </div>

        {/* Status Display */}
        <div className="flex flex-col items-end space-y-1">
          <div
            className={`
            px-3 py-1 rounded-full border text-xs font-mono font-bold 
            flex items-center space-x-1 ${statusInfo.color}
          `}
          >
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase">
            {statusInfo.status}
          </span>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

const MonsterList = ({
  monstersQuestion,
  monstersAnswer,
  onClick
}: MonsterListProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: monstersQuestion.length,
    scanned: monstersAnswer.length,
    infected: monstersAnswer.filter((m) => !m.isNormal).length,
    normal: monstersAnswer.filter((m) => m.isNormal).length
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Laboratory Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/40">
              <FlaskConical className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-slate-200">
                PENGANALISIS PROTOKOL INFEKSI
              </h2>
              <p className="text-sm font-mono text-slate-400">
                Versi Sistem Klasifikasi Spesimen 2.1
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green-400 font-bold">
                ONLINE
              </span>
            </div>
            <Microscope className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { label: 'TOTAL', value: stats.total, color: 'text-blue-400' },
            {
              label: 'DIPINDAI',
              value: stats.scanned,
              color: 'text-slate-300'
            },
            {
              label: 'TERINFEKSI',
              value: stats.infected,
              color: 'text-red-400'
            },
            { label: 'NORMAL', value: stats.normal, color: 'text-green-400' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded p-3 border border-slate-700/50"
            >
              <div className="text-xs font-mono text-slate-400 mb-1">
                {stat.label}
              </div>
              <div className={`text-2xl font-mono font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Scan Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-slate-400">
              PEMINDAIAN SISTEM
            </span>
            <span className="text-xs font-mono text-slate-400">
              {scanProgress}%
            </span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Monster List */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-mono text-slate-400 uppercase tracking-wide">
            Monster Aktif
          </span>
        </div>

        <ScrollArea className="h-96 overflow-y-auto">
          <div className="pr-4">
            {monstersQuestion.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                <FlaskConical className="w-8 h-8 mb-2 opacity-50" />
                <p className="font-mono text-sm">TIDAK ADA SPESIMEN DIMUAT</p>
                <p className="font-mono text-xs opacity-75">
                  Inisialisasi pemindai untuk memulai
                </p>
              </div>
            ) : (
              monstersQuestion.map((monsterQ) => {
                const monsterAnswer = monstersAnswer.find(
                  (monsterA) => monsterA.id === monsterQ.id
                );
                return (
                  <Fragment key={monsterQ.id}>
                    <MonsterListRow
                      key={monsterQ.id}
                      monsterQuestion={monsterQ}
                      monsterAnswer={monsterAnswer}
                      onClick={() => {
                        setSelectedId(monsterQ.id);
                        onClick(monsterQ.id);
                      }}
                      selected={selectedId === monsterQ.id}
                    />
                  </Fragment>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="bg-slate-900/50 border-t border-slate-700 p-3 flex justify-center">
        <span className="text-xs font-mono text-slate-500">
          [ SECURE LABORATORY INTERFACE ] - HANYA UNTUK PETUGAS RESMI
        </span>
      </div>
    </div>
  );
};

export default MonsterList;
