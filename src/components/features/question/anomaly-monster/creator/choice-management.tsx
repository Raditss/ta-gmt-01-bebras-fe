import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonsterPartType } from '../monster-part.type';
import { AlertCircle, Check, Plus, X, Users, Sparkles } from 'lucide-react';
import { capitalizeFirst } from '@/utils/helpers/common.helper';

interface ChoiceManagementProps {
  currentChoiceSelections: Record<string, string>;
  duplicateChoiceError: string | null;
  editingChoiceId: number | null;
  isCreatingChoice: boolean;
  isCurrentChoiceValid: boolean;
  choicesCount: number;
  onAddChoice: () => void;
  onUpdateChoice: () => void;
  onStartCreating: () => void;
  onCancel: () => void;
}

const ChoiceManagement: React.FC<ChoiceManagementProps> = ({
  currentChoiceSelections,
  duplicateChoiceError,
  editingChoiceId,
  isCreatingChoice,
  isCurrentChoiceValid,
  choicesCount,
  onAddChoice,
  onUpdateChoice,
  onStartCreating,
  onCancel
}) => {
  const attributeLabels = {
    [MonsterPartType.BODY]: 'Body',
    [MonsterPartType.ARM]: 'Arms',
    [MonsterPartType.LEG]: 'Legs',
    [MonsterPartType.COLOR]: 'Color'
  };

  if (isCreatingChoice) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {editingChoiceId
                ? 'Edit Pilihan Monster'
                : 'Buat Pilihan Monster Baru'}
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <X className="h-4 w-4" />
            Batal
          </Button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {editingChoiceId
                ? 'Ubah karakteristik monster menggunakan lemari di sebelah kiri.'
                : 'Pilih semua karakteristik monster menggunakan lemari di sebelah kiri untuk membuat pilihan monster baru.'}
            </p>
          </div>

          {/* Current Selections Display */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Konfigurasi Pilihan Monster
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(attributeLabels).map(([key, label]) => {
                  const partType = key as MonsterPartType;
                  const selection = currentChoiceSelections[partType];
                  const isSelected = !!selection;

                  return (
                    <div key={key} className="text-center">
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        {label}
                      </p>
                      <div className="flex flex-col items-center space-y-2">
                        <Badge
                          variant={isSelected ? 'default' : 'secondary'}
                          className={`w-full justify-center py-2 ${
                            isSelected
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {isSelected ? (
                            <span className="flex items-center">
                              <Check className="h-3 w-3 mr-1" />
                              {capitalizeFirst(selection)}
                            </span>
                          ) : (
                            'Belum dipilih'
                          )}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progres Konfigurasi Pilihan</span>
                  <span>
                    {Object.values(currentChoiceSelections).length}/{' '}
                    {Object.values(MonsterPartType).length} selesai
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(currentChoiceSelections).length / Object.values(MonsterPartType).length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {duplicateChoiceError && (
            <Alert className="bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {duplicateChoiceError}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={editingChoiceId ? onUpdateChoice : onAddChoice}
              disabled={!isCurrentChoiceValid}
              className={`px-8 py-3 font-semibold transition-all duration-200 flex items-center gap-2 ${
                isCurrentChoiceValid
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check className="h-5 w-5" />
              {editingChoiceId ? 'Perbarui Pilihan' : 'Tambah Pilihan'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Manajemen Pilihan Monster
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          {choicesCount === 0
            ? 'Belum ada pilihan monster yang dibuat. Mulai dengan membuat pilihan monster pertama!'
            : `${choicesCount} pilihan monster telah dibuat. Kamu bisa menambah pilihan baru.`}
        </p>

        <Button
          onClick={onStartCreating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Buat Pilihan Monster Baru
        </Button>
      </div>
    </div>
  );
};

export default ChoiceManagement;
