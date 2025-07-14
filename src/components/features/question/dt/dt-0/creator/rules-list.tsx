import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rule } from '@/models/dt-0/dt-0.model.type';
import {
  MonsterPartOptionType,
  MonsterPartType
} from '../../monster-part.type';
import { Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { monsterParts } from '@/components/features/question/dt/dt-0/helper';

interface RulesListProps {
  rules: Rule[];
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
      // case 'horns':
      //   partType = MonsterPartType.HORN;
      //   break;
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

  if (rules.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Created Rules ({rules.length})
          </h3>
          <div className="text-sm text-gray-500">
            {selectedRuleId ? 'Rule selected' : 'Click a rule to select it'}
          </div>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => {
            const isSelected = selectedRuleId === rule.id;
            const isEditing = editingRuleId === rule.id;

            return (
              <Card
                key={rule.id}
                className={`border-l-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-l-blue-500 bg-blue-50 shadow-md'
                    : isEditing
                      ? 'border-l-yellow-500 bg-yellow-50'
                      : 'border-l-gray-300 hover:border-l-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => onSelectRule(isSelected ? null : rule.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold text-gray-900">
                          Rule #{index + 1}
                        </h4>

                        {isSelected && (
                          <Badge
                            variant="default"
                            className="bg-blue-100 text-blue-800"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Selected
                          </Badge>
                        )}

                        {isEditing && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Editing
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {rule.conditions.map((condition) => (
                          <div
                            key={condition.attribute}
                            className="flex flex-col"
                          >
                            <span className="text-xs text-gray-500 mb-1">
                              {
                                attributeLabels[
                                  condition.attribute as keyof typeof attributeLabels
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
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-sm text-blue-700">
                            This rule defines a monster with the characteristics
                            shown above. Students will encounter this
                            combination when navigating the decision tree.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditRule(rule.id);
                        }}
                        disabled={isCreatingRule}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              'Are you sure you want to delete this rule?'
                            )
                          ) {
                            onDeleteRule(rule.id);
                          }
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedRuleId && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Rule #{rules.findIndex((r) => r.id === selectedRuleId) + 1}{' '}
                  Actions
                </h4>
                <p className="text-sm text-blue-700">
                  You can edit this rule to modify its characteristics or delete
                  it to remove it from the decision tree.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectRule(null)}
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
            Rule Management Tips
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click on a rule to select it and see available actions</li>
            <li>• Edit rules to modify monster characteristics</li>
            <li>• Delete rules that are no longer needed</li>
            <li>• Each rule should represent a unique monster combination</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulesList;
