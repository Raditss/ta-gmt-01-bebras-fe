import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonsterPartType } from '../monster-part.type';
import { AlertCircle, Check, Plus, X, Settings, Zap } from 'lucide-react';
import { capitalizeFirst } from '@/utils/helpers/common.helper';

interface RuleManagementProps {
  currentRuleSelections: Record<string, string>;
  duplicateRuleError: string | null;
  editingRuleId: number | null;
  isCreatingRule: boolean;
  isCurrentRuleValid: boolean;
  rulesCount: number;
  onAddRule: () => void;
  onUpdateRule: () => void;
  onStartCreating: () => void;
  onCancel: () => void;
}

const RuleManagement: React.FC<RuleManagementProps> = ({
  currentRuleSelections,
  duplicateRuleError,
  editingRuleId,
  isCreatingRule,
  isCurrentRuleValid,
  rulesCount,
  onAddRule,
  onUpdateRule,
  onStartCreating,
  onCancel
}) => {
  const attributeLabels = {
    [MonsterPartType.BODY]: 'Body',
    [MonsterPartType.ARM]: 'Arms',
    [MonsterPartType.LEG]: 'Legs',
    // [MonsterPartType.HORN]: 'Horns',
    [MonsterPartType.COLOR]: 'Color'
  };

  if (isCreatingRule) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {editingRuleId ? 'Edit Aturan' : 'Buat Aturan Baru'}
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
              {editingRuleId
                ? 'Ubah karakteristik monster menggunakan lemari di sebelah kiri.'
                : 'Pilih semua karakteristik monster menggunakan lemari di sebelah kiri untuk membuat aturan baru.'}
            </p>
          </div>

          {/* Current Selections Display */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Konfigurasi Aturan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(attributeLabels).map(([key, label]) => {
                  const partType = key as MonsterPartType;
                  const selection = currentRuleSelections[partType];
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
                  <span>Progres Konfigurasi Aturan</span>
                  <span>
                    {Object.values(currentRuleSelections).length}/{' '}
                    {Object.values(MonsterPartType).length} selesai
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(currentRuleSelections).length / Object.values(MonsterPartType).length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {duplicateRuleError && (
            <Alert className="bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {duplicateRuleError}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={editingRuleId ? onUpdateRule : onAddRule}
              disabled={!isCurrentRuleValid}
              className={`px-8 py-3 font-semibold transition-all duration-200 flex items-center gap-2 ${
                isCurrentRuleValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check className="h-5 w-5" />
              {editingRuleId ? 'Perbarui Aturan' : 'Tambah Aturan'}
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
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Manajemen Aturan
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          {rulesCount === 0
            ? 'Belum ada aturan yang dibuat. Mulai dengan membuat aturan pertama!'
            : `${rulesCount} aturan telah dibuat. Kamu bisa menambah aturan baru.`}
        </p>

        <Button
          onClick={onStartCreating}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Buat Aturan Baru
        </Button>
      </div>
    </div>
  );
};

export default RuleManagement;
