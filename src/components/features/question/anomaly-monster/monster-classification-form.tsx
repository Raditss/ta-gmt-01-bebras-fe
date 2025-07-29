import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  BodyOptions,
  BodyType,
  ColorOptions,
  ColorType,
  MouthOptions,
  MouthType
} from '@/components/features/question/anomaly-monster/monster.type';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import {
  AnomalyMonsterForm,
  Monster
} from '@/models/anomaly-monster/anomaly-monster.model.type';

interface MonsterFormProps {
  currentMonster: Monster;
  currentForm: AnomalyMonsterForm | undefined;
  setForms: Dispatch<SetStateAction<AnomalyMonsterForm[]>>;
  onClose: () => void;
  onClassifyAsNormal: () => void;
  onClassifyAsAnomaly: () => void;
  isAlreadyClassified: {
    isNormal: boolean;
    isAnomaly: boolean;
  };
}

export default function MonsterClassificationForm({
  currentMonster,
  currentForm,
  setForms,
  onClose,
  onClassifyAsNormal,
  onClassifyAsAnomaly,
  isAlreadyClassified
}: MonsterFormProps) {
  const [selectedColor, setSelectedColor] = useState<ColorType | undefined>(
    currentForm?.Color
  );
  const [selectedBody, setSelectedBody] = useState<BodyType | undefined>(
    currentForm?.Body
  );
  const [selectedMouth, setSelectedMouth] = useState<MouthType | undefined>(
    currentForm?.Mouth
  );

  useEffect(() => {
    setSelectedColor(currentForm?.Color ?? undefined);
    setSelectedBody(currentForm?.Body ?? undefined);
    setSelectedMouth(currentForm?.Mouth ?? undefined);
  }, [currentMonster.id]);

  useEffect(() => {
    setForms((prevForms) => {
      const existingIndex = prevForms.findIndex(
        (form) => form.id === currentMonster.id
      );

      const updatedForm: AnomalyMonsterForm = {
        id: currentMonster.id,
        Color: selectedColor,
        Body: selectedBody,
        Mouth: selectedMouth
      };

      if (existingIndex !== -1) {
        const updatedForms = [...prevForms];
        updatedForms[existingIndex] = updatedForm;
        return updatedForms;
      } else {
        return [...prevForms, updatedForm];
      }
    });
  }, [selectedColor, selectedBody, selectedMouth, currentMonster, setForms]);

  return (
    <div className="bg-white rounded-xl shadow-lg flex-1">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800">
          Form Analisis Monster {currentMonster.name}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </Button>
      </div>

      <div className="p-6">
        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Warna Monster
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ColorOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedColor(option.value as ColorType)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedColor === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full mx-auto mb-1 ${
                    option.value === 'Red'
                      ? 'bg-red-500'
                      : option.value === 'Green'
                        ? 'bg-green-500'
                        : 'bg-[#43d7e5]'
                  }`}
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bentuk Tubuh
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BodyOptions.map((option) => (
              <button
                key={option.value}
                disabled={!selectedColor}
                onClick={() => setSelectedBody(option.value as BodyType)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all 
                  ${
                    !selectedColor
                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                      : selectedBody === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }
              `}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-1 ${
                    option.value === 'Orb'
                      ? 'rounded-full bg-gray-400'
                      : 'bg-gray-400'
                  }`}
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mouth Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mulut Monster
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MouthOptions.map((option) => (
              <button
                key={option.value}
                disabled={!selectedBody}
                onClick={() => setSelectedMouth(option.value as MouthType)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all
                  ${
                    !selectedBody
                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-50'
                      : selectedMouth === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Classification Result */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={() => {
              onClassifyAsNormal();
              // onClose();
            }}
            disabled={
              isAlreadyClassified.isNormal ||
              (!selectedColor && !selectedBody && !selectedMouth)
            }
            className={`flex-1 ${
              isAlreadyClassified.isNormal
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <CheckCircle size={16} className="mr-2" />
            {isAlreadyClassified.isNormal ? 'Sudah Normal' : 'Tandai Normal'}
          </Button>
          <Button
            onClick={() => {
              onClassifyAsAnomaly();
              // onClose();
            }}
            disabled={
              isAlreadyClassified.isAnomaly ||
              (!selectedColor && !selectedBody && !selectedMouth)
            }
            className={`flex-1 ${
              isAlreadyClassified.isAnomaly
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            <AlertTriangle size={16} className="mr-2" />
            {isAlreadyClassified.isAnomaly
              ? 'Sudah Terinfeksi'
              : 'Tandai Terinfeksi'}
          </Button>
        </div>

        {/* Current Classification Status */}
        {(isAlreadyClassified.isNormal || isAlreadyClassified.isAnomaly) && (
          <div
            className={`p-3 rounded-lg text-center text-sm mt-2 ${
              isAlreadyClassified.isNormal
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            Monster ini sudah diklasifikasikan sebagai{' '}
            <span className="font-semibold text-sm">
              {isAlreadyClassified.isNormal ? 'NORMAL' : 'TERINFEKSI'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
