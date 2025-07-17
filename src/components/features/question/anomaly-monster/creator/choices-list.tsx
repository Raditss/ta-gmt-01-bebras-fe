import React, { useState, useCallback } from 'react';
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
import { Edit2, Eye, Trash2, Users, AlertTriangle } from 'lucide-react';
import { monsterParts } from '@/components/features/question/anomaly-monster/helper';

interface ChoicesListProps {
  choices: Monster[];
  selectedChoiceId: number | null;
  editingChoiceId: number | null;
  isCreatingChoice: boolean;
  onEditChoice: (choiceId: number) => void;
  onDeleteChoice: (choiceId: number) => void;
  onSelectChoice: (choiceId: number | null) => void;
}

const ChoicesList: React.FC<ChoicesListProps> = ({
  choices,
  selectedChoiceId,
  editingChoiceId,
  isCreatingChoice,
  onEditChoice,
  onDeleteChoice,
  onSelectChoice
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    choiceId: number | null;
    choiceIndex: number;
  }>({
    isOpen: false,
    choiceId: null,
    choiceIndex: 0
  });

  const attributeLabels = {
    body: 'Body',
    arms: 'Arms',
    legs: 'Legs',
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

  const handleDeleteClick = useCallback((choiceId: number, index: number) => {
    setDeleteDialog({
      isOpen: true,
      choiceId,
      choiceIndex: index
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.choiceId !== null) {
      onDeleteChoice(deleteDialog.choiceId);
    }
    setDeleteDialog({ isOpen: false, choiceId: null, choiceIndex: 0 });
  }, [deleteDialog.choiceId, onDeleteChoice]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ isOpen: false, choiceId: null, choiceIndex: 0 });
  }, []);

  if (choices.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              Daftar Pilihan Monster ({choices.length})
            </h3>
          </div>
          <div className="text-sm text-gray-500">
            {selectedChoiceId
              ? 'Pilihan dipilih untuk preview'
              : 'Klik pilihan untuk memilih'}
          </div>
        </div>

        <div className="space-y-4">
          {choices.map((choice, index) => {
            const isSelected = selectedChoiceId === choice.id;
            const isEditing = editingChoiceId === choice.id;

            return (
              <Card
                key={choice.id}
                className={`border-l-4 transition-all duration-200 cursor-pointer transform hover:scale-[1.01] ${
                  isSelected
                    ? 'border-l-purple-500 bg-purple-50 shadow-lg'
                    : isEditing
                      ? 'border-l-yellow-500 bg-yellow-50 shadow-md'
                      : 'border-l-gray-300 hover:border-l-purple-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                }`}
                onClick={() => onSelectChoice(isSelected ? null : choice.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Monster #{index + 1}
                        </h4>

                        {isSelected && (
                          <Badge
                            variant="default"
                            className="bg-purple-100 text-purple-800 border-purple-300"
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
                        {choice.conditions.map((condition) => (
                          <div
                            key={condition.attribute}
                            className="flex flex-col"
                          >
                            <span className="text-sm text-gray-500 mb-2 font-medium">
                              {attributeLabels[
                                condition.attribute as unknown as keyof typeof attributeLabels
                              ] || condition.attribute}
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
                          onEditChoice(choice.id);
                        }}
                        disabled={isCreatingChoice}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(choice.id, index);
                        }}
                        disabled={isCreatingChoice}
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
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">
                          Monster ini akan menjadi pilihan yang harus
                          diklasifikasi oleh siswa
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {choices.length > 0 && (
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 text-center">
              <strong>Tips:</strong> Setiap pilihan monster akan ditampilkan
              kepada siswa untuk diklasifikasi. Pastikan ada variasi
              karakteristik yang cukup untuk membuat soal menarik.
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
              Konfirmasi Hapus Monster
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Monster #
              {deleteDialog.choiceIndex + 1}? Tindakan ini tidak dapat
              dibatalkan.
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

export default ChoicesList;
