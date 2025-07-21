import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import { ContagionProtocolSolveModel } from '@/models/contagion-protocol/contagion-protocol.solve.model';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';
import MonsterList from '@/components/features/question/contagion-protocol/monster-list';
import { useCallback, useState } from 'react';
import MonsterCharacter from '@/components/features/question/contagion-protocol/monster-character';
import GeneratedContagionProtocolSubmitButton from '@/components/features/question/contagion-protocol/generated/submit-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from 'lucide-react';
import {
  ContagionProtocolMonsterAttributeType,
  ContagionProtocolMonsterBodyEnum,
  ContagionProtocolMonsterColorEnum,
  ContagionProtocolMonsterMouthEnum,
  ContagionProtocolTreeAttributeType,
  MonsterForm
} from '@/models/contagion-protocol/contagion-protocol.model.type';

// Cytoscape imports
import { CytoscapeTree } from '@/components/features/question/contagion-protocol/contagion-protocol-tree';
import MissionBriefingDialog from '@/components/features/question/contagion-protocol/mission-briefing-dialog';
import MonsterPlaceholder from '@/components/features/question/contagion-protocol/monster-placeholder';
import GeneratedContagionProtocolResultDialog from '@/components/features/question/contagion-protocol/generated/generated-contagion-protocol-result-dialog';
import { cn } from '@/utils/helpers/style.helper';
import { useAuthStore } from '@/store/auth.store';

export default function GeneratedContagionProtocolSolver({
  type
}: GeneratedSolverProps) {
  const { user } = useAuthStore();
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<ContagionProtocolSolveModel>(
      type,
      ContagionProtocolSolveModel
    );
  const [currentIdx, setCurrentIdx] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMissionDialogOpen, setIsMissionDialogOpen] = useState(true);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [isFinalResultCorret, setIsFinalResultCorret] = useState<
    boolean | null
  >(null);
  const [monsterForms, setMonsterForms] = useState<Record<string, MonsterForm>>(
    {}
  );
  const [monsterForm, setMonsterForm] = useState<MonsterForm>({});
  const [decision, setDecision] = useState<'normal' | 'infected' | null>(null);

  const handleMonsterListOnClick = useCallback(
    (monsterId: string) => {
      setCurrentIdx(monsterId);
      setIsFormOpen(false);
      // Load the form for this monster if it exists, otherwise empty

      setMonsterForm(monsterForms[monsterId] || {});
      setDecision(null);
    },
    [monsterForms]
  );

  const handleOpenForm = () => {
    setIsFormOpen(true);
    let currentMonster;
    if (question && currentIdx) {
      const existingAnswerIndex = question.answer.monsters.findIndex(
        (m) => m.id === currentIdx
      );

      if (existingAnswerIndex >= 0) {
        currentMonster = question.answer.monsters[existingAnswerIndex];
      }
    }

    // When opening, load the form for the current monster if it exists
    if (currentMonster) {
      setMonsterForm(currentMonster.form || {});
      setDecision(
        currentMonster.isNormal === undefined
          ? null
          : currentMonster.isNormal
            ? 'normal'
            : 'infected'
      );
    } else {
      setMonsterForm({});
      setDecision(null);
    }
  };

  const handleFormChange = (attribute: keyof MonsterForm, value: string) => {
    const newForm = { ...monsterForm, [attribute]: value };
    setMonsterForm(newForm);
    // Persist the form for the current monster
    if (currentIdx) {
      setMonsterForms((prev) => ({ ...prev, [currentIdx]: newForm }));
    }
  };

  const handleUserDecision = (userDecision: 'normal' | 'infected') => {
    setDecision(userDecision);

    // Save the user's analysis to the answer
    if (question && currentIdx) {
      const existingAnswerIndex = question.answer.monsters.findIndex(
        (m) => m.id === currentIdx
      );

      const monsterAnswer = {
        id: currentIdx,
        isNormal: userDecision === 'normal',
        form: monsterForm
      };

      if (existingAnswerIndex >= 0) {
        question.answer.monsters[existingAnswerIndex] = monsterAnswer;
      } else {
        question.answer.monsters.push(monsterAnswer);
      }
    }
  };

  // Add master root node to the tree structure
  const getTreeWithMasterRoot = () => {
    if (!question?.content.tree) return { nodes: [], edges: [] };

    const masterRootNode = {
      id: 'START',
      label: 'Start Analysis',
      attribute: 'Start' as ContagionProtocolTreeAttributeType,
      value: 'Begin' as ContagionProtocolMonsterAttributeType
    };

    // Find top-level color nodes (nodes that are not targets of any edge)
    const colorNodes = question.content.tree.nodes.filter(
      (node) =>
        node.attribute === 'Color' &&
        !question.content.tree.edges.some((edge) => edge.target === node.id)
    );

    // Create edges from master root to color nodes
    const masterRootEdges = colorNodes.map((colorNode) => ({
      source: 'START',
      target: colorNode.id
    }));

    return {
      nodes: [masterRootNode, ...question.content.tree.nodes],
      edges: [...masterRootEdges, ...question.content.tree.edges]
    };
  };

  const getSelectedPath = (): string[] => {
    const path: string[] = [];

    // Always start with the root node
    path.push('START');

    if (!monsterForm.color) return path;

    // Add color node
    const colorNode = question?.content.tree.nodes.find(
      (node) => node.attribute === 'Color' && node.value === monsterForm.color
    );
    if (colorNode) path.push(colorNode.id);

    // Add body node if selected
    if (monsterForm.body) {
      const bodyNode = question?.content.tree.nodes.find(
        (node) =>
          node.attribute === 'Body' &&
          node.value === monsterForm.body &&
          node.id.startsWith(`Color_${monsterForm.color}-`)
      );
      if (bodyNode) path.push(bodyNode.id);
    }

    // Add mouth node if selected
    if (monsterForm.mouth && monsterForm.body) {
      const mouthNode = question?.content.tree.nodes.find(
        (node) =>
          node.attribute === 'Mouth' &&
          node.value === monsterForm.mouth &&
          node.id.startsWith(
            `Color_${monsterForm.color}-Body_${monsterForm.body}-`
          )
      );
      if (mouthNode) path.push(mouthNode.id);
    }

    return path;
  };

  const handleExecuteProtocol = (isCorrect: boolean) => {
    setIsFinalResultCorret(isCorrect);
    setResultDialogOpen(true);
  };

  const handleNewQuestion = async () => {
    setCurrentIdx(null);
    setIsFormOpen(false);
    await regenerate();
  };

  if (!question) {
    return (
      <GeneratedSolverWrapper loading={loading} error={error} type={type}>
        <></>
      </GeneratedSolverWrapper>
    );
  }

  const currentMonster = question.content.monsters.find(
    (monster) => monster.id === currentIdx
  );

  return (
    <div className="min-w-screen min-h-screen max-h-[90%] bg-slate-950 shadow-2xl">
      <div className="max-w-[95%] mx-auto p-4">
        <div className="text-center mt-6 mb-8">
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <div className="text-red-400 font-mono text-sm mb-2">
              🚨 PERINGATAN PENTING 🚨
            </div>
            <h1 className="text-3xl font-bold text-red-300 mb-2">
              MISI MONSTER TERINFEKSI
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Monster List */}
          <div className="h-full">
            <MonsterList
              monstersQuestion={question.content.monsters}
              monstersAnswer={question.answer.monsters}
              onClick={handleMonsterListOnClick}
            />
            <GeneratedContagionProtocolSubmitButton
              question={question}
              type={type}
              questionContent={questionContent}
              onExecute={handleExecuteProtocol}
              monstersQuestion={question.content.monsters}
              monstersAnswer={question.answer.monsters}
            />
          </div>

          <MissionBriefingDialog
            isOpen={isMissionDialogOpen}
            onOpenChange={setIsMissionDialogOpen}
          />

          <GeneratedContagionProtocolResultDialog
            isOpen={resultDialogOpen}
            isCorrect={isFinalResultCorret}
          />

          {currentMonster ? (
            <div className="flex flex-col w-full justify-center items-center content-start space-y-4">
              {/* Specimen Display Container */}
              <div className="relative">
                {/* Lab Container */}
                <div className="relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600 rounded-lg p-6 shadow-lg">
                  {/* Scan Lines */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div
                      className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-ping"
                      style={{ top: '20%' }}
                    ></div>
                    <div
                      className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-ping"
                      style={{ top: '60%', animationDelay: '1s' }}
                    ></div>
                  </div>

                  {/* Monster Display */}
                  <div className="relative z-10">
                    <MonsterCharacter
                      selections={{
                        Color: currentMonster.traits.color,
                        Body: currentMonster.traits.body,
                        Mouth: currentMonster.traits.mouth
                      }}
                    />
                  </div>

                  {/* Lab Grid */}
                  <div
                    className="absolute inset-0 bg-slate-700/20 rounded-lg"
                    style={{
                      backgroundImage: `
                        linear-gradient(0deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  ></div>
                </div>
              </div>

              {isFormOpen && (
                <div className="w-full mt-6">
                  <Card className="bg-slate-800 border-2 border-slate-600 shadow-lg">
                    <CardHeader className="bg-slate-700 border-b border-slate-600">
                      <CardTitle className="flex items-center gap-2 justify-between">
                        <p className="text-slate-200 font-mono text-lg">
                          📋 LAPORAN ANALISIS MONSTER
                        </p>
                        <div className="flex justify-end gap-2">
                          <p className="text-sm text-slate-400 font-mono">
                            Monster: {currentMonster.name} |
                          </p>
                          <p className="text-sm text-slate-400 font-mono">
                            Analis: {user?.name ?? 'Pelajar'}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 bg-slate-800 p-6">
                      {/* Color Selection */}
                      <div className="border border-slate-600 p-4 rounded bg-slate-700">
                        <h4 className="font-bold mb-3 font-mono text-slate-200 border-b border-slate-600 pb-1">
                          1. WARNA MONSTER
                        </h4>
                        <div className="flex space-x-4">
                          {Object.values(ContagionProtocolMonsterColorEnum).map(
                            (color) => {
                              const bgColor =
                                color === 'Red'
                                  ? 'bg-red-500'
                                  : color === 'Green'
                                    ? 'bg-green-500'
                                    : 'bg-blue-500';

                              let colorLabel: string;

                              switch (color) {
                                case ContagionProtocolMonsterColorEnum.RED:
                                  colorLabel = 'Merah';
                                  break;
                                case ContagionProtocolMonsterColorEnum.BLUE:
                                  colorLabel = 'Biru';
                                  break;
                                case ContagionProtocolMonsterColorEnum.GREEN:
                                  colorLabel = 'Hijau';
                                  break;
                                default:
                                  colorLabel = '...';
                              }

                              return (
                                <div
                                  key={color}
                                  className={`flex items-center space-x-2 px-3 py-2 rounded border border-slate-500 ${bgColor}`}
                                >
                                  <Checkbox
                                    id={`color-${color}`}
                                    checked={monsterForm.color === color}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleFormChange('color', color);
                                      }
                                    }}
                                    className="bg-white border-white"
                                  />
                                  <label
                                    htmlFor={`color-${color}`}
                                    className="text-sm font-mono text-white cursor-pointer"
                                  >
                                    {colorLabel}
                                  </label>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Body Selection */}
                      <div className="border border-slate-600 p-4 rounded bg-slate-700">
                        <h4 className="font-bold mb-3 font-mono text-slate-200 border-b border-slate-600 pb-1">
                          2. BENTUK TUBUH MONSTER
                        </h4>
                        <div className="flex space-x-4">
                          {Object.values(ContagionProtocolMonsterBodyEnum).map(
                            (body) => {
                              const isCube = body === 'Cube';
                              const labelText = isCube ? 'KOTAK' : 'BULAT';

                              return (
                                <div
                                  key={body}
                                  className={`
                                    flex items-center gap-3 px-4 py-2 border border-slate-500 bg-slate-600
                                    cursor-pointer ${monsterForm.body === body ? 'ring-2 ring-blue-400' : ''}
                                  `}
                                  onClick={() => handleFormChange('body', body)}
                                >
                                  <div
                                    className={`
                                     w-6 h-6 bg-slate-300 
                                     ${isCube ? 'rounded-none' : 'rounded-full'}
                                     border-2 border-slate-500
                                   `}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-mono text-slate-100">
                                      {labelText}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Mouth Selection */}
                      <div className="border border-slate-600 p-2 rounded bg-slate-700">
                        <h4 className="font-bold mb-3 font-mono text-slate-200 border-b border-slate-600 pb-1">
                          3. BENTUK MULUT MONSTER
                        </h4>
                        <div className="flex space-x-4">
                          {Object.values(ContagionProtocolMonsterMouthEnum).map(
                            (mouth) => {
                              const { icon, label } =
                                mouth === 'Closedsad'
                                  ? {
                                      icon: '🙁',
                                      label: 'SEDIH'
                                    }
                                  : mouth === 'Closedhappy'
                                    ? {
                                        icon: '🙂',
                                        label: 'TERSENYUM'
                                      }
                                    : {
                                        icon: '🧛',
                                        label: 'BERTARING'
                                      };

                              return (
                                <div
                                  key={mouth}
                                  className={`
                                    flex items-center gap-3 px-4 py-1 border border-slate-500 bg-slate-600
                                    cursor-pointer ${monsterForm.mouth === mouth ? 'ring-2 ring-blue-400' : ''}
                                  `}
                                  onClick={() =>
                                    handleFormChange('mouth', mouth)
                                  }
                                >
                                  <div className="text-2xl">{icon}</div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-mono text-slate-100">
                                      {label}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Decision Buttons */}
                      {
                        <div className="mt-6 p-4 rounded-lg border-2 border-slate-500 bg-slate-700">
                          {/*<h4 className="font-semibold mb-3 font-mono text-slate-200 border-b border-slate-600 pb-2">*/}
                          {/*  🔬 FINAL CLASSIFICATION*/}
                          {/*</h4>*/}
                          {/*<div className="text-sm font-mono text-slate-300 mb-4">*/}
                          {/*  Based on collected specimen data, classify the*/}
                          {/*  subject as:*/}
                          {/*</div>*/}
                          <div className="flex gap-3">
                            <Button
                              disabled={
                                !(
                                  monsterForm.color &&
                                  monsterForm.body &&
                                  monsterForm.mouth
                                )
                              }
                              onClick={() => handleUserDecision('normal')}
                              className={`flex-1 font-mono border-2 rounded-md transition-all duration-200
                                   ${
                                     decision === 'normal'
                                       ? 'bg-green-600 text-white border-green-500 hover:bg-green-500'
                                       : 'bg-slate-800 text-slate-200 border-slate-500 hover:bg-slate-700'
                                   }`}
                            >
                              ✅ NORMAL
                            </Button>
                            <Button
                              disabled={
                                !(
                                  monsterForm.color &&
                                  monsterForm.body &&
                                  monsterForm.mouth
                                )
                              }
                              onClick={() => handleUserDecision('infected')}
                              className={`flex-1 font-mono border-2 rounded-md transition-all duration-200
                                 ${
                                   decision === 'infected'
                                     ? 'bg-red-600 text-white border-red-500 hover:bg-red-500'
                                     : 'bg-slate-800 text-red-300 border-red-500 hover:bg-slate-700'
                                 }`}
                            >
                              ⚠️ TERINFEKSI
                            </Button>
                          </div>
                        </div>
                      }
                    </CardContent>
                  </Card>
                </div>
              )}

              {!isFormOpen && (
                <>
                  {/* Specimen Info Display */}
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 w-full max-w-xs">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-400 font-mono text-sm">
                          MONSTER TERDETEKSI
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {currentMonster.name}
                      </h3>
                    </div>
                  </div>
                  {/* Professional Analyze Button */}
                  <div className="text-center space-y-3">
                    <div className="text-blue-400 text-sm font-mono">
                      WAKTUNYA MEMERIKSA MONSTER
                    </div>
                    <Button
                      onClick={handleOpenForm}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-mono font-bold py-3 px-6 border-2 border-slate-500 hover:border-slate-400 transition-all duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <Radio className="w-4 h-4" />
                        PERIKSA MONSTER
                      </span>
                    </Button>
                    <div className="text-xs text-slate-400 font-mono">
                      Klik tombol untuk mulai mengecek monster
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex w-full justify-center items-center text-gray-400">
              <MonsterPlaceholder />
            </div>
          )}

          <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={() => setIsMissionDialogOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-mono font-bold py-3 px-6 border-2 border-slate-500 hover:border-slate-400 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  📋 Lihat Petunjuk Misi
                </span>
              </Button>
              <Button
                onClick={handleNewQuestion}
                variant="outline"
                className={cn(
                  'ml-3 bg-slate-600 py-3 text-base font-mono text-cyan-300 border-cyan-500 hover:bg-cyan-800/30 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300'
                )}
              >
                ⟳ Pertanyaan Baru
              </Button>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-center text-slate-200">
              Pohon Keputusan Monster yang Normal
            </h3>
            <CytoscapeTree
              tree={getTreeWithMasterRoot()}
              selectedPath={getSelectedPath()}
            />

            {/* Quick Info */}
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
              <h4 className="text-sm font-semibold text-slate-200 mb-2">
                🧬 CARA MELAKUKAN MISI
              </h4>
              <div className="text-xs text-slate-300 space-y-1">
                <div>1. Pilih monster yang mencurigakan</div>
                <div>2. Klik &ldquo;Periksa Monster&rdquo;</div>
                <div>
                  3. Cocokkan warna, bentuk, dan mulut monster dengan monster
                  yang normal yang ada di pohon keputusan!
                </div>
                <div>4. Pilih apakah dia Sehat atau Terinfeksi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
