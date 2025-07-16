import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monster } from '@/models/anomaly-monster/anomaly-monster.model.type';
import { MonsterPartOptionType, MonsterPartType } from '../monster-part.type';
import { Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
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

  if (choices.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Created Choices ({choices.length})
          </h3>
          <div className="text-sm text-gray-500">
            {selectedChoiceId
              ? 'Choice selected'
              : 'Click a choice to select it'}
          </div>
        </div>

        <div className="space-y-4">
          {choices.map((choice, index) => {
            const isSelected = selectedChoiceId === choice.id;
            const isEditing = editingChoiceId === choice.id;

            return (
              <Card
                key={choice.id}
                className={`border-l-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-l-purple-500 bg-purple-50 shadow-md'
                    : isEditing
                      ? 'border-l-yellow-500 bg-yellow-50'
                      : 'border-l-gray-300 hover:border-l-purple-300 hover:bg-gray-50'
                }`}
                onClick={() => onSelectChoice(isSelected ? null : choice.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          Choice #{index + 1}
                        </h4>
                        {isEditing && (
                          <Badge variant="outline" className="bg-yellow-100">
                            Editing
                          </Badge>
                        )}
                        {isSelected && !isEditing && (
                          <Badge variant="outline" className="bg-purple-100">
                            Selected
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectChoice(isSelected ? null : choice.id);
                          }}
                          className="text-gray-500 hover:text-purple-600"
                        >
                          {isSelected ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditChoice(choice.id);
                          }}
                          disabled={isCreatingChoice}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Are you sure you want to delete Choice #${index + 1}?`
                              )
                            ) {
                              onDeleteChoice(choice.id);
                            }
                          }}
                          disabled={isCreatingChoice}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {choice.conditions.map((condition) => (
                        <div
                          key={condition.attribute}
                          className="flex flex-col"
                        >
                          <span className="text-xs text-gray-500 mb-1">
                            {
                              attributeLabels[
                                condition.attribute as unknown as keyof typeof attributeLabels
                              ]
                            }
                          </span>
                          <Badge
                            variant="outline"
                            className="w-full justify-center text-xs bg-white"
                          >
                            {getDisplayValue(
                              condition.attribute,
                              condition.value
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <p className="text-sm text-purple-700">
                          This choice defines a monster that students will need
                          to classify using the decision tree. Students will
                          determine whether this monster matches the tree rules
                          or is an anomaly.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedChoiceId && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-900 mb-1">
                  Choice #
                  {choices.findIndex((c) => c.id === selectedChoiceId) + 1}{' '}
                  Actions
                </h4>
                <p className="text-sm text-purple-700">
                  You can edit this choice to modify its characteristics or
                  delete it to remove it from the choices list.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectChoice(null)}
                className="flex items-center gap-1"
              >
                <EyeOff className="h-3 w-3" />
                Deselect
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Choice Management Tips
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click on a choice to select it and see available actions</li>
            <li>• Edit choices to modify monster characteristics</li>
            <li>• Delete choices that are no longer needed</li>
            <li>• Each choice should represent a unique monster combination</li>
            <li>• Mix normal and anomaly monsters for balanced difficulty</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChoicesList;
