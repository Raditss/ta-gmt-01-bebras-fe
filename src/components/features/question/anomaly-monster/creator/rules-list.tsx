import React, { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Monster } from '@/models/anomaly-monster/anomaly-monster.model.type';
import { MonsterPartOptionType, MonsterPartType } from '../monster-part.type';
import { AlertTriangle, Edit2, Eye, Trash2, TreePine } from 'lucide-react';
import { monsterParts } from '@/components/features/question/anomaly-monster/helper';

interface RulesListProps {
  rules: Monster[];
  selectedRuleId: number | null;
  editingRuleId: number | null;
  isCreatingRule: boolean;
  onEditRule: (ruleId: number) => void;
  onDeleteRule: (ruleId: number) => void;
  onSelectRule: (ruleId: number | null) => void;
}

const RulesList: React.FC<RulesListProps> = ({
  rules,
  selectedRuleId,
  editingRuleId,
  isCreatingRule,
  onEditRule,
  onDeleteRule,
  onSelectRule
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    ruleId: number | null;
    ruleIndex: number;
  }>({
    isOpen: false,
    ruleId: null,
    ruleIndex: 0
  });

  const attributeLabels = {
    body: 'Body',
    arms: 'Arms',
    legs: 'Legs',
    // horns: 'Horns',
    color: 'Color'
  };

  const getDisplayValue = (attribute: string, value: string) => {
    let partType: MonsterPartType;
    switch (attribute) {
      case 'body':
        partType = MonsterPartType.BODY;
        break;
      case 'arms':
        partType = MonsterPartType.ARM;
        break;
      case 'legs':
        partType = MonsterPartType.LEG;
        break;
      case 'color':
        partType = MonsterPartType.COLOR;
        break;
      default:
        return value;
    }

    const options = monsterParts[partType];
    return (
      options?.find((opt: MonsterPartOptionType) => opt.value === value)
        ?.label || value
    );
  };

  const handleDeleteClick = useCallback((ruleId: number, index: number) => {
    setDeleteDialog({
      isOpen: true,
      ruleId,
      ruleIndex: index
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.ruleId !== null) {
      onDeleteRule(deleteDialog.ruleId);
    }
    setDeleteDialog({ isOpen: false, ruleId: null, ruleIndex: 0 });
  }, [deleteDialog.ruleId, onDeleteRule]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ isOpen: false, ruleId: null, ruleIndex: 0 });
  }, []);

  if (rules.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TreePine className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              Daftar Aturan ({rules.length})
            </h3>
          </div>
          <div className="text-sm text-gray-500">
            {selectedRuleId
              ? 'Aturan dipilih untuk preview'
              : 'Klik aturan untuk memilih'}
          </div>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => {
            const isSelected = selectedRuleId === rule.id;
            const isEditing = editingRuleId === rule.id;

            return (
              <Card
                key={rule.id}
                className={`border-l-4 transition-all duration-200 cursor-pointer transform hover:scale-[1.01] ${
                  isSelected
                    ? 'border-l-blue-500 bg-blue-50 shadow-lg'
                    : isEditing
                      ? 'border-l-yellow-500 bg-yellow-50 shadow-md'
                      : 'border-l-gray-300 hover:border-l-blue-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                }`}
                onClick={() => onSelectRule(isSelected ? null : rule.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Aturan #{index + 1}
                        </h4>

                        {isSelected && (
                          <Badge
                            variant="default"
                            className="bg-blue-100 text-blue-800 border-blue-300"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Dipilih
                          </Badge>
                        )}

                        {isEditing && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 border-yellow-300"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Sedang Diedit
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {rule.conditions.map((condition) => (
                          <div
                            key={condition.attribute}
                            className="flex flex-col"
                          >
                            <span className="text-sm text-gray-500 mb-2 font-medium">
                              {
                                attributeLabels[
                                  condition.attribute as unknown as keyof typeof attributeLabels
                                ]
                              }
                            </span>
                            <Badge
                              variant="outline"
                              className="w-full justify-center text-sm bg-white border-2 py-2 font-medium"
                            >
                              {getDisplayValue(
                                condition.attribute,
                                condition.value
                              )}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditRule(rule.id);
                        }}
                        disabled={isCreatingRule}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(rule.id, index);
                        }}
                        disabled={isCreatingRule}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">
                          Aturan ini dipilih untuk preview di pohon keputusan
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {rules.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Tips:</strong> Klik aturan untuk memilih dan melihat
              preview di pohon keputusan. Gunakan tombol Edit untuk mengubah
              aturan yang ada.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Konfirmasi Hapus Aturan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Aturan #
              {deleteDialog.ruleIndex + 1}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RulesList;
