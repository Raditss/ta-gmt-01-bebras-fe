'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import {
  INITIAL_MONSTER_FORM,
  useContagionProtocolCreator
} from './useContagionProtocolCreator';

// Models and Types
import { ContagionProtocolCreateModel } from '@/models/contagion-protocol/contagion-protocol.create.model';
import {
  ContagionProtocolMonsterBodyEnum,
  ContagionProtocolMonsterBodyType,
  ContagionProtocolMonsterColorEnum,
  ContagionProtocolMonsterColorType,
  ContagionProtocolMonsterMouthEnum,
  ContagionProtocolMonsterMouthType,
  getBodyLabel,
  getColorLabel,
  getMouthLabel
} from '@/models/contagion-protocol/contagion-protocol.model.type';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { CytoscapeTree } from '@/components/features/question/contagion-protocol/contagion-protocol-tree';
import MonsterCharacter from '@/components/features/question/contagion-protocol/monster-character';

export default function ContagionProtocolCreator({
  initialDataQuestion
}: BaseCreatorProps) {
  const router = useRouter();

  // Core question management
  const {
    question,
    error: creationError,
    hasUnsavedChanges,
    saveDraft,
    submitCreation,
    markAsChanged,
    clearError,
    lastSavedDraft
  } = useCreateQuestion<ContagionProtocolCreateModel>(
    initialDataQuestion,
    ContagionProtocolCreateModel
  );

  // Custom hook for contagion protocol specific logic
  const {
    // Tree State
    edges,
    branches,
    selectedBranchId,
    showBranchForm,
    editingBranchId,
    branchForm,

    // Monster State
    monsters,
    selectedMonsterId,
    showMonsterForm,
    editingMonster,
    monsterForm,

    // Validation
    contentValidation,
    isContentValid,

    // Actions
    treeActions,
    monsterActions,
    formActions,
    utils
  } = useContagionProtocolCreator({
    question,
    markAsChanged
  });

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

  // Local UI state
  const [activeView, setActiveView] = useState<'tree' | 'monsters'>('tree');
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
    if (!contentValidation.tree.hasBranches) {
      setValidationDialog({
        isOpen: true,
        title: 'Pohon Keputusan Belum Dibuat',
        message:
          'Silakan tambahkan setidaknya satu cabang untuk pohon keputusan.'
      });
      return;
    }
    if (!contentValidation.monsters.hasMonsters) {
      setValidationDialog({
        isOpen: true,
        title: 'Monster Belum Dibuat',
        message: 'Silakan tambahkan setidaknya satu monster.'
      });
      return;
    }
    setShowSubmissionModal(true);
  }, [contentValidation]);

  const handleConfirmSubmit = useCallback(async () => {
    await submitCreation();
  }, [submitCreation]);

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
        <div className="max-w-[98%] mx-auto p-4">
          {/* Header */}
          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Pembuat Soal Monster Terinfeksi
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
                disabled={!isContentValid}
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
                  Last saved at {lastSavedDraft.toString()}
                </AlertDescription>
              </Alert>
            )}

            {/* Validation Status */}
            {!isContentValid && (
              <Alert className="mt-4 max-w-2xl mx-auto bg-orange-50 text-orange-800 border-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="text-sm">
                    <strong>Masalah yang ditemukan:</strong>
                    <ul className="mt-1 list-disc list-inside">
                      {contentValidation.tree.issues.map((issue, idx) => (
                        <li key={`tree-${idx}`}>{issue}</li>
                      ))}
                      {contentValidation.monsters.issues.map((issue, idx) => (
                        <li key={`monster-${idx}`}>{issue}</li>
                      ))}
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
                  onClick={() => setActiveView('tree')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeView === 'tree'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TreePine className="h-4 w-4" />
                    Pohon Keputusan
                  </div>
                  <div className="text-xs mt-1">
                    ({contentValidation.tree.branchCount} cabang)
                  </div>
                </button>
                <button
                  onClick={() => setActiveView('monsters')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeView === 'monsters'
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    Daftar Monster
                  </div>
                  <div className="text-xs mt-1">
                    ({contentValidation.monsters.monsterCount} monster)
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeView === 'tree' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        Cabang Pohon Keputusan
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => treeActions.setShowBranchForm(true)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah Cabang
                      </Button>
                    </div>
                    {branches.map((branch, idx) => (
                      <div
                        key={branch.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBranchId === branch.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          treeActions.setSelectedBranchId(branch.id);
                          treeActions.editBranch(branch.id);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-2">
                              Cabang ke-{idx + 1}
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>🎨 Color: {branch.colorNode.value}</div>
                              <div>🎲 Body: {branch.bodyNode.value}</div>
                              <div>😊 Mouth: {branch.mouthNode.value}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              treeActions.deleteBranch(branch.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {branches.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <TreePine className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Belum ada cabang pohon keputusan
                        </p>
                        <p className="text-xs mt-1">
                          Setiap cabang berisi Color → Body → Mouth
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
                        onClick={() => {
                          monsterActions.setShowMonsterForm(true);
                          monsterActions.setMonsterForm(INITIAL_MONSTER_FORM);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tambah
                      </Button>
                    </div>
                    {monsters.map((monster) => (
                      <div
                        key={monster.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMonsterId === monster.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          monsterActions.setSelectedMonsterId(monster.id);
                          monsterActions.editMonster(monster);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {monster.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getColorLabel(monster.traits.color)} •{' '}
                              {getBodyLabel(monster.traits.body)} •{' '}
                              {getMouthLabel(monster.traits.mouth)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              monsterActions.deleteMonster(monster.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {monsters.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Belum ada monster</p>
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
                  {activeView === 'tree'
                    ? 'Preview Pohon Keputusan'
                    : 'Preview Monster'}
                </h3>
              </div>

              <div className="h-[700px] flex items-center justify-center border border-gray-200 rounded-lg">
                {activeView === 'tree' ? (
                  branches.length > 0 ? (
                    <CytoscapeTree
                      tree={utils.getPreviewTree()}
                      selectedPath={[]}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <TreePine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Buat cabang pertama untuk melihat pohon keputusan</p>
                      <p className="text-sm mt-2">
                        Setiap cabang: Color → Body → Mouth
                      </p>
                    </div>
                  )
                ) : monsterForm ? (
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-6">
                      {monsterForm.name
                        ? 'Nama Monster: ' + monsterForm.name
                        : 'Beri nama monster ini!'}
                    </h4>
                    <MonsterCharacter
                      selections={{
                        Color: monsterForm.color,
                        Body: monsterForm.body,
                        Mouth: monsterForm.mouth
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
                {activeView === 'tree'
                  ? showBranchForm
                    ? editingBranchId
                      ? 'Edit Cabang'
                      : 'Tambah Cabang Baru'
                    : 'Manajemen Edge'
                  : showMonsterForm
                    ? editingMonster
                      ? 'Edit Monster'
                      : 'Tambah Monster Baru'
                    : 'Pengaturan Monster'}
              </h3>

              <div className="space-y-6 h-[700px] overflow-y-auto">
                {activeView === 'tree' ? (
                  showBranchForm ? (
                    <Card>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <Label htmlFor="colorValue" className="font-medium">
                              🎨 Warna
                            </Label>
                            <select
                              id="colorValue"
                              value={branchForm.colorValue}
                              onChange={(e) =>
                                treeActions.updateBranchForm({
                                  colorValue: e.target
                                    .value as ContagionProtocolMonsterColorType
                                })
                              }
                              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
                              <option
                                value={ContagionProtocolMonsterColorEnum.RED}
                              >
                                Merah
                              </option>
                              <option
                                value={ContagionProtocolMonsterColorEnum.GREEN}
                              >
                                Hijau
                              </option>
                              <option
                                value={ContagionProtocolMonsterColorEnum.BLUE}
                              >
                                Biru
                              </option>
                            </select>
                          </div>

                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Label htmlFor="bodyValue" className="font-medium">
                              🎲 Bentuk Badan
                            </Label>
                            <select
                              id="bodyValue"
                              value={branchForm.bodyValue}
                              onChange={(e) =>
                                treeActions.updateBranchForm({
                                  bodyValue: e.target
                                    .value as ContagionProtocolMonsterBodyType
                                })
                              }
                              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
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
                              value={branchForm.mouthValue}
                              onChange={(e) =>
                                treeActions.updateBranchForm({
                                  mouthValue: e.target
                                    .value as ContagionProtocolMonsterMouthType
                                })
                              }
                              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            >
                              <option
                                value={ContagionProtocolMonsterMouthEnum.SAD}
                              >
                                Sedih
                              </option>
                              <option
                                value={ContagionProtocolMonsterMouthEnum.HAPPY}
                              >
                                Tersenyum
                              </option>
                              <option
                                value={ContagionProtocolMonsterMouthEnum.FANGS}
                              >
                                Bertaring
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <strong>Preview Cabang:</strong>
                          <br />
                          Berwarna: {getColorLabel(branchForm.colorValue)} →
                          Berbentuk: {getBodyLabel(branchForm.bodyValue)} →
                          Mulut: {getMouthLabel(branchForm.mouthValue)}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={
                              editingBranchId
                                ? treeActions.updateBranch
                                : treeActions.createBranch
                            }
                            className="flex-1"
                          >
                            {editingBranchId
                              ? 'Update Cabang'
                              : 'Tambah Cabang'}
                          </Button>
                          <Button
                            onClick={formActions.cancelForms}
                            variant="outline"
                            className="flex-1"
                          >
                            Batal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Manajemen Edge
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 mb-3">
                            Edge yang ada:
                          </p>
                          {edges.map((edge, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm">
                                {edge.source} → {edge.target}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  treeActions.deleteEdge(
                                    edge.source,
                                    edge.target
                                  )
                                }
                                className="h-6 w-6 p-0 text-red-500"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {edges.length === 0 && (
                            <p className="text-sm text-gray-400">
                              Belum ada edge
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                ) : showMonsterForm ? (
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <Label htmlFor="monsterName">Nama Monster</Label>
                        <Input
                          id="monsterName"
                          value={monsterForm?.name}
                          onChange={(e) =>
                            monsterActions.updateMonsterForm({
                              name: e.target.value
                            })
                          }
                          placeholder="contoh: Monster Alpha"
                        />
                      </div>

                      <div>
                        <Label htmlFor="monsterColor">Warna</Label>
                        <select
                          id="monsterColor"
                          value={monsterForm?.color}
                          onChange={(e) =>
                            monsterActions.updateMonsterForm({
                              color: e.target
                                .value as ContagionProtocolMonsterColorEnum
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value={ContagionProtocolMonsterColorEnum.RED}>
                            Merah
                          </option>
                          <option
                            value={ContagionProtocolMonsterColorEnum.GREEN}
                          >
                            Hijau
                          </option>
                          <option
                            value={ContagionProtocolMonsterColorEnum.BLUE}
                          >
                            Biru
                          </option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="monsterBody">Bentuk Tubuh</Label>
                        <select
                          id="monsterBody"
                          value={monsterForm?.body}
                          onChange={(e) =>
                            monsterActions.updateMonsterForm({
                              body: e.target
                                .value as ContagionProtocolMonsterBodyEnum
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value={ContagionProtocolMonsterBodyEnum.CUBE}>
                            Kotak
                          </option>
                          <option value={ContagionProtocolMonsterBodyEnum.ORB}>
                            Bulat
                          </option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="monsterMouth">Bentuk Mulut</Label>
                        <select
                          id="monsterMouth"
                          value={monsterForm?.mouth}
                          onChange={(e) =>
                            monsterActions.updateMonsterForm({
                              mouth: e.target
                                .value as ContagionProtocolMonsterMouthEnum
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value={ContagionProtocolMonsterMouthEnum.SAD}>
                            Sedih
                          </option>
                          <option
                            value={ContagionProtocolMonsterMouthEnum.HAPPY}
                          >
                            Tersenyum
                          </option>
                          <option
                            value={ContagionProtocolMonsterMouthEnum.FANGS}
                          >
                            Bertaring
                          </option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={
                            editingMonster
                              ? monsterActions.updateMonster
                              : monsterActions.createMonster
                          }
                          disabled={!monsterForm?.name.trim()}
                          className="flex-1"
                        >
                          {editingMonster ? 'Update Monster' : 'Tambah Monster'}
                        </Button>
                        <Button
                          onClick={formActions.cancelForms}
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
                    <div className="mb-4">
                      <p className="text-sm">
                        Klik item di tab untuk mengedit atau tambahkan item baru
                      </p>
                    </div>
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
