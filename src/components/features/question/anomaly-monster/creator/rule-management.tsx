import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonsterPartType } from '../monster-part.type';
import { AlertCircle, Check, Plus, X } from 'lucide-react';
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
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingRuleId ? 'Edit Rule' : 'Create New Rule'}
            </h2>
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {editingRuleId
                  ? 'Modify the monster characteristics using the wardrobe below.'
                  : 'Select all monster characteristics using the wardrobe below to create a new rule.'}
              </p>
            </div>

            {/* Current Selections Display */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-center text-gray-800">
                  Rule Configuration
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(attributeLabels).map(([key, label]) => {
                    const partType = key as MonsterPartType;
                    const selection = currentRuleSelections[partType];
                    const isSelected = !!selection;

                    return (
                      <div key={key} className="text-center">
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          {label}
                        </p>
                        <div className="flex flex-col items-center space-y-1">
                          <Badge
                            variant={isSelected ? 'default' : 'secondary'}
                            className={`w-full justify-center ${
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
                              'Not selected'
                            )}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress indicator */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Rule Configuration Progress</span>
                    <span>
                      {Object.values(currentRuleSelections).length}/{' '}
                      {Object.values(MonsterPartType).length} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
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
                className={`px-8 py-3 font-semibold transition-all duration-200 ${
                  isCurrentRuleValid
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                size="lg"
              >
                {editingRuleId ? 'Update Rule' : 'Add Rule'}
              </Button>
            </div>

            {/* Help text */}
            {!isCurrentRuleValid && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Please select all monster characteristics to create a complete
                  rule.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Rule Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {rulesCount === 0
                ? 'Start building your decision tree by creating your first monster rule. Each rule defines a unique combination of monster characteristics.'
                : `You have created ${rulesCount} rule${rulesCount === 1 ? '' : 's'}. Create more rules to build a comprehensive decision tree.`}
            </p>
          </div>

          {rulesCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(rulesCount, 5) }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )
                  )}
                  {rulesCount > 5 && (
                    <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      +{rulesCount - 5}
                    </div>
                  )}
                </div>
                <span className="text-green-800 font-medium">
                  {rulesCount} Rule{rulesCount === 1 ? '' : 's'} Created
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={onStartCreating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {rulesCount === 0 ? 'Create First Rule' : 'Add Another Rule'}
          </Button>

          {rulesCount === 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                How to create your first rule:
              </h4>
              <ol className="text-sm text-blue-800 text-left space-y-1 max-w-md mx-auto">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>Click &#34;Create First Rule&#34; to start</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span>Use the wardrobe to select each monster part</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>
                    Click &#34;Add Rule&#34; when all parts are selected
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleManagement;
