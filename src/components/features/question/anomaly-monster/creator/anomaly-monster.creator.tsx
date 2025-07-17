'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Save,
  TreePine,
  Users,
  Wand2
} from 'lucide-react';

// Hooks
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { useAnomalyMonsterTreeCreator } from '@/components/features/question/anomaly-monster/creator/useAnomalyMonsterTreeCreator';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';

// Models and Types
import { AnomalyMonsterCreateModel } from '@/models/anomaly-monster/anomaly-monster-create.model';
import { MonsterPartType } from '@/components/features/question/anomaly-monster/monster-part.type';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import MonsterCharacter from '@/components/features/question/anomaly-monster/monster-character';
import MonsterPartWardrobe from '@/components/features/question/anomaly-monster/monster-part-wardrobe';
import RuleManagement from './rule-management';
import RulesList from './rules-list';
import ChoiceManagement from './choice-management';
import ChoicesList from './choices-list';

export default function AnomalyMonsterCreator({
  initialDataQuestion
}: BaseCreatorProps) {
  const router = useRouter();

  // Core question management
  const {
    question,
    error: creationError,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged,
    clearError
  } = useCreateQuestion<AnomalyMonsterCreateModel>(
    initialDataQuestion,
    AnomalyMonsterCreateModel
  );

  // DecisionTree-specific logic
  const {
    // Tree Rules
    rules,
    currentRuleSelections,
    isCreatingRule,
    editingRuleId,
    selectedRuleId,
    duplicateRuleError,
    isCurrentRuleValid,
    handleRuleSelection,
    addRule,
    editRule,
    updateRule,
    deleteRule,
    cancelRule,
    startCreatingRule,
    setSelectedRuleId,

    // Choices
    choices,
    currentChoiceSelections,
    isCreatingChoice,
    editingChoiceId,
    selectedChoiceId,
    duplicateChoiceError,
    isCurrentChoiceValid,
    handleChoiceSelection,
    addChoice,
    editChoice,
    updateChoice,
    deleteChoice,
    cancelChoice,
    startCreatingChoice,
    setSelectedChoiceId
  } = useAnomalyMonsterTreeCreator({ question, markAsChanged });

  // Navigation guard
  const {
    showDialog: showNavigationDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    setShowDialog
  } = usePageNavigationGuard({
    hasUnsavedChanges,
    onSave: saveDraft
  });

  // Component state
  const [activeTab, setActiveTab] = useState('rules');
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [validationDialog, setValidationDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  // Monster interaction handlers
  const handleHover = useCallback(
    (category: MonsterPartType, value: string) => {
      setHovered({ category, value });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  // Action handlers
  const handleManualSave = useCallback(async () => {
    clearError();
    await saveDraft();
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  }, [saveDraft, clearError]);

  const handleSubmit = useCallback(() => {
    if (rules.length === 0) {
      setValidationDialog({
        isOpen: true,
        title: 'Aturan Belum Dibuat',
        message:
          'Silakan tambahkan setidaknya satu aturan pohon keputusan sebelum submit.'
      });
      return;
    }
    if (choices.length === 0) {
      setValidationDialog({
        isOpen: true,
        title: 'Pilihan Monster Belum Dibuat',
        message:
          'Silakan tambahkan setidaknya satu pilihan monster sebelum submit.'
      });
      return;
    }
    setShowSubmissionModal(true);
  }, [rules.length, choices.length]);

  const handleConfirmSubmit = useCallback(async () => {
    await submitCreation();
  }, [submitCreation]);

  const handleEditRule = useCallback(
    (ruleId: number) => {
      setActiveTab('rules');
      editRule(ruleId);
    },
    [editRule]
  );

  const handleEditChoice = useCallback(
    (choiceId: number) => {
      setActiveTab('choices');
      editChoice(choiceId);
    },
    [editChoice]
  );

  // Get current selections based on active tab
  const getCurrentSelections = useCallback(() => {
    return activeTab === 'rules'
      ? currentRuleSelections
      : currentChoiceSelections;
  }, [activeTab, currentRuleSelections, currentChoiceSelections]);

  // Get appropriate selection handler based on active tab
  const getSelectionHandler = useCallback(() => {
    return activeTab === 'rules' ? handleRuleSelection : handleChoiceSelection;
  }, [activeTab, handleRuleSelection, handleChoiceSelection]);

  // Convert current selections to format expected by DecisionTree
  const getTreeSelections = useCallback((): Record<string, string> => {
    const selections = getCurrentSelections();
    return {
      body: selections[MonsterPartType.BODY] || '',
      arms: selections[MonsterPartType.ARM] || '',
      legs: selections[MonsterPartType.LEG] || '',
      color: selections[MonsterPartType.COLOR] || ''
    };
  }, [getCurrentSelections]);

  const closeValidationDialog = useCallback(() => {
    setValidationDialog({ isOpen: false, title: '', message: '' });
  }, []);

  return (
    <CreatorWrapper
      loading={false}
      error={creationError}
      hasUnsavedChanges={hasUnsavedChanges}
      showNavigationDialog={showNavigationDialog}
      onSaveAndLeave={handleSaveAndLeave}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onStayOnPage={handleStayOnPage}
      onSetShowDialog={setShowDialog}
    >
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[95%] mx-auto p-4">
          {/* Header */}
          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Pembuat Soal Monster yang Aneh
            </h1>

            {/* Description Card */}
            <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Wand2 className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Deskripsi Pembuatan Soal
                  </h3>
                </div>
                <div className="flex flex-col gap-1 text-gray-700 leading-relaxed text-left">
                  <p>
                    Soal ini menggunakan konsep pohon keputusan untuk menguji
                    kemampuan siswa dalam mengklasifikasikan objek berdasarkan
                    aturan logis.
                  </p>
                  <div>
                    <p>Sebagai pembuat soal, Anda diminta untuk:</p>
                    <ol className="list-disc ml-6">
                      <li>
                        Menyusun aturan klasifikasi untuk membentuk pohon
                        keputusan.
                      </li>
                      <li>
                        Membuat kumpulan monster dengan atribut tertentu (body,
                        arm, leg, dan color).
                      </li>
                    </ol>
                  </div>
                  <p>
                    Tugas siswa adalah menentukan apakah setiap monster termasuk
                    normal atau terinfeksi, berdasarkan aturan pohon keputusan
                    yang telah Anda buat.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Monster Preview and Wardrobe */}
            <div className="lg:col-span-1">
              <div className="flex flex-col gap-6">
                {/* Monster Preview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Preview Monster
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeTab === 'rules'
                        ? 'Konfigurasi Aturan'
                        : 'Konfigurasi Pilihan Monster'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <MonsterCharacter
                      selections={getCurrentSelections()}
                      hovered={hovered}
                    />
                  </div>
                </div>

                {/* Monster Wardrobe */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Lemari Monster
                  </h3>
                  <MonsterPartWardrobe
                    selections={getCurrentSelections()}
                    onSelection={getSelectionHandler()}
                    onHover={handleHover}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
              </div>
            </div>

            {/* Right side - Management Tabs and Progress */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                {/* Progress Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Progres Pembuatan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rules Progress */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TreePine className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-800">
                          Aturan Pohon
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {rules.length}
                      </div>
                      <div className="text-sm text-gray-500">Aturan dibuat</div>
                      {rules.length === 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Perlu minimal 1 aturan
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Choices Progress */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-800">
                          Pilihan Monster
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {choices.length}
                      </div>
                      <div className="text-sm text-gray-500">
                        Monster dibuat
                      </div>
                      {choices.length === 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Perlu minimal 1 monster
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      onClick={handleManualSave}
                      disabled={!hasUnsavedChanges}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Simpan Draft
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={rules.length === 0 || choices.length === 0}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Kirim Soal
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {showSaveConfirmation && (
                    <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Draft berhasil disimpan!
                      </AlertDescription>
                    </Alert>
                  )}

                  {lastSavedDraft && !showSaveConfirmation && (
                    <Alert className="mt-4 bg-gray-50 text-gray-800 border-gray-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Terakhir disimpan pada {lastSavedDraft.toString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Management Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger
                      value="rules"
                      className="flex items-center gap-2 text-base"
                    >
                      <TreePine className="h-4 w-4" />
                      Aturan Pohon ({rules.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="choices"
                      className="flex items-center gap-2 text-base"
                    >
                      <Users className="h-4 w-4" />
                      Pilihan Monster ({choices.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Decision Tree Visualization */}
                  {rules.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">
                          Preview Pohon Keputusan
                        </h3>
                      </div>
                      <div className="flex justify-center overflow-x-auto min-h-[300px]">
                        <DecisionTreeAnomalyTree
                          rules={rules}
                          selections={getTreeSelections()}
                        />
                      </div>
                      {isCreatingRule && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700 text-center">
                            Pohon akan terupdate saat kamu membuat aturan baru
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <TabsContent value="rules" className="space-y-6 mt-6">
                    {/* Rule Management */}
                    <RuleManagement
                      currentRuleSelections={currentRuleSelections}
                      duplicateRuleError={duplicateRuleError}
                      editingRuleId={editingRuleId}
                      isCreatingRule={isCreatingRule}
                      isCurrentRuleValid={isCurrentRuleValid}
                      rulesCount={rules.length}
                      onAddRule={addRule}
                      onUpdateRule={updateRule}
                      onStartCreating={startCreatingRule}
                      onCancel={cancelRule}
                    />

                    {/* Rules List */}
                    <RulesList
                      rules={rules}
                      selectedRuleId={selectedRuleId}
                      editingRuleId={editingRuleId}
                      isCreatingRule={isCreatingRule}
                      onEditRule={handleEditRule}
                      onDeleteRule={deleteRule}
                      onSelectRule={setSelectedRuleId}
                    />
                  </TabsContent>

                  <TabsContent value="choices" className="space-y-6 mt-6">
                    {/* Choice Management */}
                    <ChoiceManagement
                      currentChoiceSelections={currentChoiceSelections}
                      duplicateChoiceError={duplicateChoiceError}
                      editingChoiceId={editingChoiceId}
                      isCreatingChoice={isCreatingChoice}
                      isCurrentChoiceValid={isCurrentChoiceValid}
                      choicesCount={choices.length}
                      onAddChoice={addChoice}
                      onUpdateChoice={updateChoice}
                      onStartCreating={startCreatingChoice}
                      onCancel={cancelChoice}
                    />

                    {/* Choices List */}
                    <ChoicesList
                      choices={choices}
                      selectedChoiceId={selectedChoiceId}
                      editingChoiceId={editingChoiceId}
                      isCreatingChoice={isCreatingChoice}
                      onEditChoice={handleEditChoice}
                      onDeleteChoice={deleteChoice}
                      onSelectChoice={setSelectedChoiceId}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Submission Modal */}
          {question && (
            <CreationSubmissionModal
              isOpen={showSubmissionModal}
              isConfirming={true}
              questionData={{
                title: question.draft.title,
                questionType: question.draft.questionType.name,
                points: question.draft.points,
                estimatedTime: question.draft.estimatedTime,
                author: question.draft.teacher.name
              }}
              onConfirm={handleConfirmSubmit}
              onCancel={() => setShowSubmissionModal(false)}
              onClose={() => {
                setShowSubmissionModal(false);
                router.push('/add-problem');
              }}
            />
          )}

          {/* Validation Dialog */}
          <AlertDialog
            open={validationDialog.isOpen}
            onOpenChange={closeValidationDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  {validationDialog.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {validationDialog.message}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={closeValidationDialog}>
                  Mengerti
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </CreatorWrapper>
  );
}
