'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
  Plus,
  Save,
  Trash2,
  TreePine,
  Users
} from 'lucide-react';

// Hooks
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { useAnomalyMonsterTreeCreator } from '@/components/features/question/anomaly-monster/creator/useAnomalyMonsterTreeCreator';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';

// Models and Types
import { AnomalyMonsterCreateModel } from '@/models/anomaly-monster/anomaly-monster-create.model';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import MonsterCharacter from '@/components/features/question/anomaly-monster/monster-character';
import {
  BodyEnum,
  BodyType,
  ColorEnum,
  ColorType,
  getBodyLabel,
  getColorLabel,
  getMouthLabel,
  MonsterPartEnum,
  MouthEnum,
  MouthType
} from '@/components/features/question/anomaly-monster/monster.type';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ContagionProtocolMonsterBodyEnum } from '@/models/contagion-protocol/contagion-protocol.model.type';
import { Input } from '@/components/ui/input';

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
    clearError,
    isLoading
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
    currentChoiceName,
    setCurrentChoiceName,
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
  const [activeView, setActiveView] = useState<'rules' | 'choices'>('rules');
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

  const closeValidationDialog = useCallback(() => {
    setValidationDialog({ isOpen: false, title: '', message: '' });
  }, []);

  return (
    <CreatorWrapper
      loading={isLoading}
      error={creationError}
      hasUnsavedChanges={hasUnsavedChanges}
      showNavigationDialog={showNavigationDialog}
      onSaveAndLeave={handleSaveAndLeave}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onStayOnPage={handleStayOnPage}
      onSetShowDialog={setShowDialog}
    >
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[98%] mx-auto p-4">
          {/* Header */}
          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Pembuat Soal Monster yang Aneh
            </h1>

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
                Submit Soal
              </Button>
            </div>

            {/* Status Messages */}
            {showSaveConfirmation && (
              <Alert className="mt-4 max-w-md mx-auto bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Draft berhasil disimpan!</AlertDescription>
              </Alert>
            )}
            {lastSavedDraft && !showSaveConfirmation && (
              <Alert className="mt-4 max-w-md mx-auto bg-gray-50 text-gray-800 border-gray-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Terakhir disimpan pada {lastSavedDraft.toString()}
                </AlertDescription>
              </Alert>
            )}
            {/* Validation Status */}
            {(rules.length === 0 || choices.length === 0) && (
              <Alert className="mt-4 max-w-2xl mx-auto bg-orange-50 text-orange-800 border-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="text-sm">
                    <strong>Masalah yang ditemukan:</strong>
                    <ul className="mt-1 list-disc list-inside">
                      {rules.length === 0 && (
                        <li>Perlu minimal 1 aturan pohon keputusan</li>
                      )}
                      {choices.length === 0 && <li>Perlu minimal 1 monster</li>}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Layout - 3 Columns */}
          <div className="grid grid-cols-12 gap-4 h-[800px]">
            {/* Left Panel - Navigation Tabs */}
            <div className="col-span-3 bg-white rounded-xl shadow-lg flex flex-col">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveView('rules')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeView === 'rules'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TreePine className="h-4 w-4" />
                    Aturan Pohon
                  </div>
                  <div className="text-xs mt-1">({rules.length} aturan)</div>
                </button>
                <button
                  onClick={() => setActiveView('choices')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeView === 'choices'
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    Daftar Monster
                  </div>
                  <div className="text-xs mt-1">({choices.length} monster)</div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeView === 'rules' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        Daftar Aturan
                      </h3>
                      <Button
                        size="sm"
                        onClick={startCreatingRule}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Aturan
                      </Button>
                    </div>

                    {rules.map((rule, idx) => (
                      <div
                        key={rule.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRuleId === rule.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedRuleId(rule.id);
                          editRule(rule.id);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-2">
                              Cabang ke-{idx + 1}
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>
                                🎨 Warna:{' '}
                                {getColorLabel(
                                  rule.conditions.find(
                                    (condition) =>
                                      condition.attribute ===
                                      MonsterPartEnum.COLOR
                                  )?.value ?? ''
                                )}{' '}
                              </div>
                              <div>
                                🎲 Bentuk Badan:{' '}
                                {getBodyLabel(
                                  rule.conditions.find(
                                    (condition) =>
                                      condition.attribute ===
                                      MonsterPartEnum.BODY
                                  )?.value ?? ''
                                )}{' '}
                              </div>
                              <div>
                                😊 Mulut:{' '}
                                {getMouthLabel(
                                  rule.conditions.find(
                                    (condition) =>
                                      condition.attribute ===
                                      MonsterPartEnum.MOUTH
                                  )?.value ?? ''
                                )}{' '}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRule(rule.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/*<RulesList*/}
                    {/*  rules={rules}*/}
                    {/*  selectedRuleId={selectedRuleId}*/}
                    {/*  editingRuleId={editingRuleId}*/}
                    {/*  isCreatingRule={isCreatingRule}*/}
                    {/*  onEditRule={editRule}*/}
                    {/*  onDeleteRule={deleteRule}*/}
                    {/*  onSelectRule={setSelectedRuleId}*/}
                    {/*/>*/}

                    {rules.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <TreePine className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Belum ada aturan pohon keputusan
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        Daftar Monster
                      </h3>
                      <Button
                        size="sm"
                        onClick={startCreatingChoice}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Monster
                      </Button>
                    </div>
                    {choices.map((monster) => (
                      <div
                        key={monster.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedChoiceId === monster.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedChoiceId(monster.id);
                          editChoice(monster.id);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {monster.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getColorLabel(
                                monster.conditions.find(
                                  (condition) =>
                                    condition.attribute ===
                                    MonsterPartEnum.COLOR
                                )?.value ?? ''
                              )}{' '}
                              •{' '}
                              {getBodyLabel(
                                monster.conditions.find(
                                  (condition) =>
                                    condition.attribute === MonsterPartEnum.BODY
                                )?.value ?? ''
                              )}{' '}
                              •{' '}
                              {getMouthLabel(
                                monster.conditions.find(
                                  (condition) =>
                                    condition.attribute ===
                                    MonsterPartEnum.MOUTH
                                )?.value ?? ''
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChoice(monster.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/*<ChoicesList*/}
                    {/*  choices={choices}*/}
                    {/*  selectedChoiceId={selectedChoiceId}*/}
                    {/*  editingChoiceId={editingChoiceId}*/}
                    {/*  isCreatingChoice={isCreatingChoice}*/}
                    {/*  onEditChoice={editChoice}*/}
                    {/*  onDeleteChoice={deleteChoice}*/}
                    {/*  onSelectChoice={setSelectedChoiceId}*/}
                    {/*/>*/}
                    {choices.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Belum ada monster yang ditambahkan
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Middle Panel - Visualization */}
            <div className="col-span-5 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">
                  {activeView === 'rules'
                    ? 'Preview Pohon Keputusan'
                    : 'Preview Monster'}
                </h3>
              </div>
              <div className="h-[700px] flex items-center justify-center border border-gray-200 rounded-lg">
                {activeView === 'rules' ? (
                  rules.length > 0 ? (
                    <DecisionTreeAnomalyTree
                      rules={rules}
                      selections={currentRuleSelections}
                      height={'500px'}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <TreePine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Buat aturan pertama untuk melihat pohon keputusan</p>
                    </div>
                  )
                ) : currentChoiceSelections ? (
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-6">Preview Monster</h4>
                    <MonsterCharacter
                      selections={{
                        Color: currentChoiceSelections[MonsterPartEnum.COLOR],
                        Body: currentChoiceSelections[MonsterPartEnum.BODY],
                        Mouth: currentChoiceSelections[MonsterPartEnum.MOUTH]
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Pilih monster dari daftar untuk melihat preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Forms */}
            <div className="col-span-4 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {activeView === 'rules'
                  ? isCreatingRule || editingRuleId
                    ? 'Manajemen Aturan Pohon Keputusan'
                    : 'Pengaturan Aturan Pohon Keputusan'
                  : isCreatingChoice || editingChoiceId
                    ? 'Manajemen Monster'
                    : 'Pengaturan Monster'}
              </h3>
              <div className="space-y-6 h-[700px] overflow-y-auto">
                {activeView === 'rules' ? (
                  isCreatingRule || editingRuleId ? (
                    <Card>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid grid-cols-1 gap-4">
                          <p className="mt-2 text-sm text-red-600 font-medium">
                            {duplicateRuleError}
                          </p>
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <Label htmlFor="colorValue" className="font-medium">
                              🎨 Warna
                            </Label>
                            <select
                              id="colorValue"
                              value={
                                currentRuleSelections[MonsterPartEnum.COLOR]
                              }
                              onChange={(e) =>
                                handleRuleSelection(
                                  MonsterPartEnum.COLOR,
                                  e.target.value as ColorType
                                )
                              }
                              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
                              <option value="">-- Pilih warna --</option>
                              <option value={ColorEnum.RED}>Merah</option>
                              <option value={ColorEnum.GREEN}>Hijau</option>
                              <option value={ColorEnum.BLUE}>Biru</option>
                            </select>
                          </div>

                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Label htmlFor="bodyValue" className="font-medium">
                              🎲 Bentuk Badan
                            </Label>

                            <select
                              id="bodyValue"
                              value={
                                currentRuleSelections[MonsterPartEnum.BODY]
                              }
                              onChange={(e) =>
                                handleRuleSelection(
                                  MonsterPartEnum.BODY,
                                  e.target.value as BodyType
                                )
                              }
                              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
                              <option value="">-- Pilih bentuk tubuh --</option>
                              <option
                                value={ContagionProtocolMonsterBodyEnum.CUBE}
                              >
                                Kotak
                              </option>
                              <option
                                value={ContagionProtocolMonsterBodyEnum.ORB}
                              >
                                Bulat
                              </option>
                            </select>
                          </div>

                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <Label htmlFor="mouthValue" className="font-medium">
                              😊 Bentuk Mulut
                            </Label>
                            <select
                              id="mouthValue"
                              value={
                                currentRuleSelections[MonsterPartEnum.MOUTH]
                              }
                              onChange={(e) =>
                                handleRuleSelection(
                                  MonsterPartEnum.MOUTH,
                                  e.target.value as MouthType
                                )
                              }
                              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
                              <option value="">-- Pilih mulut --</option>
                              <option value={MouthEnum.NO_FANGS}>
                                Tidak Bertaring
                              </option>
                              <option value={MouthEnum.FANGS}>Bertaring</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <strong>Preview Cabang:</strong>
                          <br />
                          Berwarna:{' '}
                          {getColorLabel(
                            currentRuleSelections[MonsterPartEnum.COLOR]
                          )}{' '}
                          → Berbentuk:{' '}
                          {getBodyLabel(
                            currentRuleSelections[MonsterPartEnum.BODY]
                          )}{' '}
                          → Mulut:{' '}
                          {getMouthLabel(
                            currentRuleSelections[MonsterPartEnum.MOUTH]
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={editingRuleId ? updateRule : addRule}
                            className="flex-1"
                            disabled={!isCurrentRuleValid}
                          >
                            {editingRuleId ? 'Update Cabang' : 'Tambah Cabang'}
                          </Button>
                          <Button
                            onClick={cancelRule}
                            variant="outline"
                            className="flex-1"
                          >
                            Batal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    // <RuleManagement
                    //   currentRuleSelections={currentRuleSelections}
                    //   duplicateRuleError={duplicateRuleError}
                    //   editingRuleId={editingRuleId}
                    //   isCreatingRule={isCreatingRule}
                    //   isCurrentRuleValid={isCurrentRuleValid}
                    //   rulesCount={rules.length}
                    //   onAddRule={addRule}
                    //   onUpdateRule={updateRule}
                    //   onStartCreating={startCreatingRule}
                    //   onCancel={cancelRule}
                    // />
                    <div className="text-center text-gray-500 py-8">
                      <p className="text-sm">
                        Klik item di tab untuk mengedit atau tambahkan aturan
                        baru
                      </p>
                    </div>
                  )
                ) : isCreatingChoice || editingChoiceId ? (
                  // <ChoiceManagement
                  //   currentChoiceSelections={currentChoiceSelections}
                  //   duplicateChoiceError={duplicateChoiceError}
                  //   editingChoiceId={editingChoiceId}
                  //   isCreatingChoice={isCreatingChoice}
                  //   isCurrentChoiceValid={isCurrentChoiceValid}
                  //   choicesCount={choices.length}
                  //   onAddChoice={addChoice}
                  //   onUpdateChoice={updateChoice}
                  //   onStartCreating={startCreatingChoice}
                  //   onCancel={cancelChoice}
                  // />
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {duplicateChoiceError}
                      </p>
                      <div>
                        <Label htmlFor="monsterName">Nama Monster</Label>
                        <Input
                          id="monsterName"
                          value={currentChoiceName}
                          onChange={(e) => {
                            setCurrentChoiceName(e.target.value);
                          }}
                          placeholder="contoh: Monster Alpha-68"
                        />
                      </div>

                      <div>
                        <Label htmlFor="monsterColor">Warna</Label>
                        <select
                          id="monsterColor"
                          value={currentChoiceSelections[MonsterPartEnum.COLOR]}
                          onChange={(e) =>
                            handleChoiceSelection(
                              MonsterPartEnum.COLOR,
                              e.target.value as ColorType
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">-- Pilih warna --</option>
                          <option value={ColorEnum.RED}>Merah</option>
                          <option value={ColorEnum.GREEN}>Hijau</option>
                          <option value={ColorEnum.BLUE}>Biru</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="monsterBody">Bentuk Tubuh</Label>
                        <select
                          id="monsterBody"
                          value={currentChoiceSelections[MonsterPartEnum.BODY]}
                          onChange={(e) =>
                            handleChoiceSelection(
                              MonsterPartEnum.BODY,
                              e.target.value as BodyType
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">-- Pilih Bentuk Badan --</option>
                          <option value={BodyEnum.CUBE}>Kotak</option>
                          <option value={BodyEnum.ORB}>Bulat</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="monsterMouth">Bentuk Mulut</Label>
                        <select
                          id="monsterMouth"
                          value={currentChoiceSelections[MonsterPartEnum.MOUTH]}
                          onChange={(e) =>
                            handleChoiceSelection(
                              MonsterPartEnum.MOUTH,
                              e.target.value as MouthType
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">-- Pilih mulut --</option>
                          <option value={MouthEnum.NO_FANGS}>
                            Tidak Bertaring
                          </option>
                          <option value={MouthEnum.FANGS}>Bertaring</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={editingChoiceId ? updateChoice : addChoice}
                          disabled={!isCurrentChoiceValid}
                          className="flex-1"
                        >
                          {editingChoiceId
                            ? 'Update Monster'
                            : 'Tambah Monster'}
                        </Button>
                        <Button
                          onClick={cancelChoice}
                          variant="outline"
                          className="flex-1"
                        >
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">
                      Klik item di tab untuk mengedit atau tambahkan monster
                      baru
                    </p>
                  </div>
                )}
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
