"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CipherCreateModel } from '@/models/cipher-n/cipher-n.create.model';
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Save, Settings, Eye, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { BaseCreatorProps, CreatorWrapper } from '@/components/features/bases/base.creator';
import { Badge } from '@/components/ui/badge';

// Polygon configuration options
const POLYGON_OPTIONS = [
  { vertices: 3, name: 'triangle' },
  { vertices: 4, name: 'square' },
  { vertices: 5, name: 'pentagon' },
  { vertices: 6, name: 'hexagon' },
  { vertices: 8, name: 'octagon' },
];

interface PolygonVisualizationProps {
  vertices: Array<{ pos: number; letters: string }>;
  vertexCount: number;
  currentVertex: number;
  highlightedVertex?: number;
}

function PolygonVisualization({ vertices, vertexCount, currentVertex, highlightedVertex }: PolygonVisualizationProps) {
  const centerX = 150;
  const centerY = 150;
  const radius = 80;

  // Calculate positions for vertices
  const getVertexPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / vertexCount - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Generate polygon points
  const polygonPoints = Array.from({ length: vertexCount }, (_, i) => {
    const pos = getVertexPosition(i);
    return `${pos.x},${pos.y}`;
  }).join(' ');

  const currentPos = getVertexPosition(currentVertex);

  return (
    <div className="flex flex-col items-center">
      <svg width="300" height="300" className="border-2 border-gray-300 rounded-lg bg-white">
        {/* Draw polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />
        
        {/* Draw vertices and labels */}
        {Array.from({ length: vertexCount }, (_, i) => {
          const pos = getVertexPosition(i);
          const vertex = vertices.find(v => v.pos === i);
          const isCurrent = i === currentVertex;
          const isHighlighted = i === highlightedVertex;
          
          return (
            <g key={i}>
              {/* Vertex circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill={isCurrent ? "rgb(34, 197, 94)" : isHighlighted ? "rgb(239, 68, 68)" : "white"}
                stroke={isCurrent ? "rgb(21, 128, 61)" : isHighlighted ? "rgb(185, 28, 28)" : "rgb(107, 114, 128)"}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Vertex number */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-700"
              >
                {i}
              </text>
              
              {/* Letters above vertex */}
              {vertex && (
                <text
                  x={pos.x}
                  y={pos.y - 30}
                  textAnchor="middle"
                  className="text-xs font-bold fill-gray-700"
                >
                  {vertex.letters}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Arrow from center to current vertex */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
        
        <line
          x1={centerX}
          y1={centerY}
          x2={currentPos.x - 20 * Math.cos(Math.atan2(currentPos.y - centerY, currentPos.x - centerX))}
          y2={currentPos.y - 20 * Math.sin(Math.atan2(currentPos.y - centerY, currentPos.x - centerX))}
          stroke="black"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="transition-all duration-500"
        />
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="3" fill="black" />
      </svg>
    </div>
  );
}

export default function CipherCreator({ initialDataQuestion }: BaseCreatorProps) {
  const router = useRouter();

  // Always call useCreateQuestion hook
  const {
    question,
    error: creationError,
    hasUnsavedChanges,
    saveDraft,
    submitCreation,
    markAsChanged
  } = useCreateQuestion<CipherCreateModel>(initialDataQuestion, CipherCreateModel);

  // Navigation guard
  const {
    showDialog: showNavigationDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    setShowDialog,
  } = usePageNavigationGuard({
    hasUnsavedChanges,
    onSave: saveDraft
  });

  // State management
  const [activeTab, setActiveTab] = useState<'config' | 'vertices' | 'content' | 'preview'>('config');
  const [polygonConfig, setPolygonConfig] = useState({
    vertexCount: 8,
    polygonName: 'octagon',
    startingVertex: 0,
    isClockwise: true
  });
  const [vertices, setVertices] = useState<Array<{ pos: number; letters: string }>>([]);
  const [instructions, setInstructions] = useState<string[]>([
    "A polygon has groups of letters at each vertex.",
    "An arrow points from center to a vertex and can rotate clockwise.",
    "At the start of encryption, the arrow points to the starting vertex.",
    "Each letter is encoded as two numbers:",
    "• First number: how many vertices to rotate the arrow",
    "• Second number: position of the letter in the target group"
  ]);
  const [example, setExample] = useState({
    plaintext: '',
    encrypted: '',
    explanation: ''
  });
  const [questionData, setQuestionData] = useState({
    plaintext: '',
    prompt: 'What is the encrypted message for the given text?'
  });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'example' | 'question'>('example');
  const [currentVertex, setCurrentVertex] = useState(0);

  // Initialize state from question
  useEffect(() => {
    if (question) {
      const cipherQuestion = question as CipherCreateModel;
      const content = cipherQuestion.getContent();
      
      setPolygonConfig(content.config);
      setVertices(content.vertices);
      setInstructions(content.instructions);
      setExample(content.example);
      setQuestionData({
        plaintext: content.question.plaintext,
        prompt: content.question.prompt
      });
      setCurrentVertex(content.config.startingVertex);
    }
  }, [question]);

  // Auto-generate default vertices when polygon config changes
  useEffect(() => {
    if (vertices.length === 0 || vertices.length !== polygonConfig.vertexCount) {
      const defaultVertices = Array.from({ length: polygonConfig.vertexCount }, (_, i) => ({
        pos: i,
        letters: generateDefaultLetters(i, polygonConfig.vertexCount)
      }));
      setVertices(defaultVertices);
    }
  }, [polygonConfig.vertexCount, vertices.length]);

  // Generate default letter groups - ensure all 26 letters are covered
  const generateDefaultLetters = (position: number, totalVertices: number) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersPerVertex = Math.ceil(26 / totalVertices);
    const startIndex = position * lettersPerVertex;
    const endIndex = Math.min(startIndex + lettersPerVertex, 26);
    return alphabet.slice(startIndex, endIndex);
  };

  // Check if all 26 letters are covered across all vertices
  const validateAlphabetCoverage = useCallback(() => {
    const allLetters = vertices.flatMap(v => v.letters.split('')).join('');
    const uniqueLetters = [...new Set(allLetters.toUpperCase())].sort();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    const missingLetters = alphabet.filter(letter => !uniqueLetters.includes(letter));
    const extraLetters = uniqueLetters.filter(letter => !alphabet.includes(letter));
    
    // Find duplicate letters across vertices
    const letterCounts: { [key: string]: number } = {};
    allLetters.toUpperCase().split('').forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    const duplicateLetters = Object.keys(letterCounts).filter(letter => letterCounts[letter] > 1);
    
    return {
      isComplete: missingLetters.length === 0 && duplicateLetters.length === 0 && extraLetters.length === 0,
      missingLetters,
      extraLetters,
      duplicateLetters,
      totalCovered: uniqueLetters.length,
      hasNoDuplicates: duplicateLetters.length === 0,
      hasNoInvalidChars: extraLetters.length === 0
    };
  }, [vertices]);

  // Auto-fix alphabet distribution
  const autoFixAlphabet = useCallback(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newVertices = Array.from({ length: polygonConfig.vertexCount }, (_, i) => {
      const lettersPerVertex = Math.ceil(26 / polygonConfig.vertexCount);
      const startIndex = i * lettersPerVertex;
      const endIndex = Math.min(startIndex + lettersPerVertex, 26);
      return {
        pos: i,
        letters: alphabet.slice(startIndex, endIndex)
      };
    });
    
    // Handle remaining letters if any (for cases where division isn't even)
    const assignedLetters = newVertices.flatMap(v => v.letters.split('')).length;
    if (assignedLetters < 26) {
      const remainingLetters = alphabet.slice(assignedLetters);
      // Distribute remaining letters to the last vertices
      let vertexIndex = newVertices.length - 1;
      for (const letter of remainingLetters) {
        if (vertexIndex >= 0) {
          newVertices[vertexIndex].letters += letter;
          vertexIndex--;
        }
      }
    }
    
    setVertices(newVertices);
  }, [polygonConfig.vertexCount]);

  // Randomize alphabet distribution
  const randomizeAlphabet = useCallback(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    // Fisher-Yates shuffle algorithm
    for (let i = alphabet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
    }
    
    // Distribute shuffled alphabet across vertices
    const newVertices = Array.from({ length: polygonConfig.vertexCount }, (_, i) => ({
      pos: i,
      letters: ''
    }));
    
    // Distribute letters as evenly as possible
    alphabet.forEach((letter, index) => {
      const vertexIndex = index % polygonConfig.vertexCount;
      newVertices[vertexIndex].letters += letter;
    });
    
    setVertices(newVertices);
  }, [polygonConfig.vertexCount]);

  // Handle vertex letter input with duplicate prevention
  const handleVertexLetterChange = useCallback((vertexIndex: number, newLetters: string) => {
    const sanitizedLetters = newLetters.toUpperCase().replace(/[^A-Z]/g, ''); // Only allow A-Z
    
    // Check for duplicates across other vertices
    const otherVerticesLetters = vertices
      .filter((_, index) => index !== vertexIndex)
      .flatMap(v => v.letters.split(''));
    
    // Remove any letters that already exist in other vertices
    const uniqueLetters = sanitizedLetters.split('').filter(letter => 
      !otherVerticesLetters.includes(letter)
    );
    
    const newVertices = [...vertices];
    newVertices[vertexIndex] = { 
      ...newVertices[vertexIndex], 
      letters: uniqueLetters.join('') 
    };
    setVertices(newVertices);
  }, [vertices]);

  const alphabetValidation = validateAlphabetCoverage();

  // Encryption helper functions
  const findVertexWithLetter = useCallback((letter: string): number => {
    return vertices.findIndex(vertex => 
      vertex.letters.includes(letter.toUpperCase())
    );
  }, [vertices]);

  const getLetterPosition = useCallback((vertex: number, letter: string): number => {
    return vertices[vertex]?.letters.indexOf(letter.toUpperCase()) + 1 || 0;
  }, [vertices]);

  const calculateRotation = useCallback((from: number, to: number): number => {
    if (polygonConfig.isClockwise) {
      return (to - from + polygonConfig.vertexCount) % polygonConfig.vertexCount;
    } else {
      return (from - to + polygonConfig.vertexCount) % polygonConfig.vertexCount;
    }
  }, [polygonConfig]);

  // Encrypt a message
  const encryptMessage = useCallback((plaintext: string) => {
    let currentPos = polygonConfig.startingVertex;
    const steps: Array<{
      letter: string;
      from: number;
      rotation: number;
      to: number;
      pos: number;
      code: string;
    }> = [];
    
    const codes: string[] = [];
    
    for (const char of plaintext.toUpperCase()) {
      if (char.match(/[A-Z]/)) {
        const targetVertex = findVertexWithLetter(char);
        if (targetVertex !== -1) {
          const rotation = calculateRotation(currentPos, targetVertex);
          const position = getLetterPosition(targetVertex, char);
          const code = `${rotation}${position}`;
          
          steps.push({
            letter: char,
            from: currentPos,
            rotation,
            to: targetVertex,
            pos: position,
            code
          });
          
          codes.push(code);
          currentPos = targetVertex;
        }
      }
    }
    
    return {
      encrypted: codes.join('-'),
      steps
    };
  }, [polygonConfig, findVertexWithLetter, getLetterPosition, calculateRotation]);

  // Update question content
  const updateQuestionContent = useCallback(() => {
    if (!question) return;
    
    const cipherQuestion = question as CipherCreateModel;
    
    // Update config
    const updatedConfig = {
      vertexCount: polygonConfig.vertexCount,
      polygonName: polygonConfig.polygonName,
      startingVertex: polygonConfig.startingVertex,
      isClockwise: polygonConfig.isClockwise
    };
    
    // Calculate answer if we have a question plaintext
    let answer: { encrypted: string; steps: Array<{
      letter: string;
      from: number;
      rotation: number;
      to: number;
      pos: number;
      code: string;
    }> } = { encrypted: '', steps: [] };
    if (questionData.plaintext.trim()) {
      answer = encryptMessage(questionData.plaintext);
    }
    
    // Update all content
    cipherQuestion.getContent().config = updatedConfig;
    cipherQuestion.setVertices(vertices);
    cipherQuestion.setInstructions(instructions);
    cipherQuestion.setExample(example.plaintext, example.encrypted, example.explanation);
    cipherQuestion.setQuestion(questionData.plaintext, questionData.prompt);
    cipherQuestion.setAnswer(answer.encrypted, answer.steps);
    
    markAsChanged();
  }, [question, polygonConfig, vertices, instructions, example, questionData, encryptMessage, markAsChanged]);

  // Auto-update question when data changes
  useEffect(() => {
    updateQuestionContent();
  }, [updateQuestionContent]);

  // Generate example encryption
  const generateExampleEncryption = useCallback(() => {
    if (!example.plaintext.trim()) return;
    
    const result = encryptMessage(example.plaintext);
    setExample(prev => ({
      ...prev,
      encrypted: result.encrypted,
      explanation: `Encrypting "${example.plaintext}": ${result.steps.map(step => 
        `${step.letter}→rotate ${step.rotation} to vertex ${step.to}, position ${step.pos} = ${step.code}`
      ).join('; ')}`
    }));
  }, [example.plaintext, encryptMessage]);

  // Handle manual save
  const handleManualSave = useCallback(async () => {
    try {
      await saveDraft();
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [saveDraft]);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (!question || !vertices.length) return;
    setShowSubmissionModal(true);
  }, [question, vertices.length]);

  const handleConfirmSubmit = useCallback(async () => {
    if (!question) return;
    
    try {
      await submitCreation();
      router.push('/add-problem');
    } catch (error) {
      console.error('Failed to submit creation:', error);
      setShowSubmissionModal(false);
    }
  }, [question, submitCreation, router]);

  const isFormValid = vertices.length > 0 && 
                     instructions.length > 0 && 
                     questionData.plaintext.trim() && 
                     questionData.prompt.trim() &&
                     alphabetValidation.isComplete;

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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with save button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Create Cipher Question</h1>
            <p className="text-gray-600">Build an interactive polygon cipher challenge</p>
          </div>
          <div className="flex items-center gap-4">
            {showSaveConfirmation && (
              <Alert className="bg-green-50 border-green-200 w-auto">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Draft saved successfully!
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleManualSave} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              {'Save Draft'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          {[
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'vertices', label: 'Letter Groups', icon: Plus },
            { id: 'content', label: 'Content', icon: AlertCircle },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'config' | 'vertices' | 'content' | 'preview')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'config' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Polygon Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="polygon-type">Polygon Type</Label>
                  <Select
                    value={polygonConfig.vertexCount.toString()}
                    onValueChange={(value) => {
                      const vertices = parseInt(value);
                      const option = POLYGON_OPTIONS.find(opt => opt.vertices === vertices);
                      setPolygonConfig(prev => ({
                        ...prev,
                        vertexCount: vertices,
                        polygonName: option?.name || 'polygon'
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POLYGON_OPTIONS.map(option => (
                        <SelectItem key={option.vertices} value={option.vertices.toString()}>
                          {option.name} ({option.vertices} vertices)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="starting-vertex">Starting Vertex (0-{polygonConfig.vertexCount - 1})</Label>
                  <Input
                    id="starting-vertex"
                    type="number"
                    min="0"
                    max={polygonConfig.vertexCount - 1}
                    value={polygonConfig.startingVertex}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 0 && value < polygonConfig.vertexCount) {
                        setPolygonConfig(prev => ({ ...prev, startingVertex: value }));
                        setCurrentVertex(value);
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Rotation Direction</Label>
                  <Select
                    value={polygonConfig.isClockwise ? 'clockwise' : 'counterclockwise'}
                    onValueChange={(value) => {
                      setPolygonConfig(prev => ({ 
                        ...prev, 
                        isClockwise: value === 'clockwise' 
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clockwise">Clockwise</SelectItem>
                      <SelectItem value="counterclockwise">Counter-clockwise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <PolygonVisualization
                  vertices={vertices}
                  vertexCount={polygonConfig.vertexCount}
                  currentVertex={currentVertex}
                />
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="bg-green-100">
                    Starting Position: Vertex {polygonConfig.startingVertex}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'vertices' && (
          <Card>
            <CardHeader>
              <CardTitle>Letter Groups</CardTitle>
              <p className="text-sm text-gray-600">
                Define which letters belong to each vertex of the polygon. All 26 letters (A-Z) must be covered.
              </p>
            </CardHeader>
            <CardContent>
              {/* Alphabet Validation Status */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Alphabet Coverage Status</h4>
                  <div className="flex items-center gap-2">
                    {alphabetValidation.isComplete ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Complete ({alphabetValidation.totalCovered}/26)
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        ⚠ Incomplete ({alphabetValidation.totalCovered}/26)
                      </Badge>
                    )}
                  </div>
                </div>
                
                {!alphabetValidation.isComplete && (
                  <div className="space-y-2 text-sm">
                    {alphabetValidation.missingLetters.length > 0 && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-700 font-medium">
                          🔴 Missing Letters ({alphabetValidation.missingLetters.length}):
                        </p>
                        <p className="text-red-600 font-mono">
                          {alphabetValidation.missingLetters.join(', ')}
                        </p>
                      </div>
                    )}
                    {alphabetValidation.duplicateLetters.length > 0 && (
                      <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-orange-700 font-medium">
                          🟡 Duplicate Letters ({alphabetValidation.duplicateLetters.length}):
                        </p>
                        <p className="text-orange-600 font-mono">
                          {alphabetValidation.duplicateLetters.join(', ')}
                        </p>
                        <p className="text-orange-600 text-xs mt-1">
                          Each letter should appear only once across all vertices
                        </p>
                      </div>
                    )}
                    {alphabetValidation.extraLetters.length > 0 && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-700 font-medium">
                          ⚠️ Invalid Characters ({alphabetValidation.extraLetters.length}):
                        </p>
                        <p className="text-yellow-600 font-mono">
                          {alphabetValidation.extraLetters.join(', ')}
                        </p>
                        <p className="text-yellow-600 text-xs mt-1">
                          Only letters A-Z are allowed
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-600">
                  <strong>Coverage:</strong> {alphabetValidation.totalCovered}/26 letters
                  {alphabetValidation.isComplete ? 
                    " ✅ Perfect distribution - Ready for encryption!" : 
                    ` ❌ ${alphabetValidation.missingLetters.length + alphabetValidation.duplicateLetters.length + alphabetValidation.extraLetters.length} issues to fix`
                  }
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {vertices.map((vertex, index) => {
                    const vertexLetters = vertex.letters.split('');
                    const hasInvalidChars = vertexLetters.some(letter => !/[A-Z]/.test(letter));
                    const hasDuplicatesWithOthers = vertexLetters.some(letter => 
                      vertices.some((otherVertex, otherIndex) => 
                        otherIndex !== index && otherVertex.letters.includes(letter)
                      )
                    );
                    const hasIssues = hasInvalidChars || hasDuplicatesWithOthers;
                    
                    return (
                      <div key={vertex.pos} className={`flex items-center gap-3 p-3 border rounded-lg ${hasIssues ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                          {vertex.pos}
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`vertex-${vertex.pos}`}>
                            Vertex {vertex.pos} Letters ({vertex.letters.length} letters)
                            {hasIssues && <span className="text-red-600 text-xs ml-2">⚠ Issues</span>}
                          </Label>
                          <Input
                            id={`vertex-${vertex.pos}`}
                            value={vertex.letters}
                            onChange={(e) => handleVertexLetterChange(index, e.target.value)}
                            placeholder="e.g., ABC"
                            className={`mt-1 ${hasIssues ? 'border-red-300 focus:border-red-500' : ''}`}
                          />
                          {vertex.letters && (
                            <div className="mt-1 text-xs text-gray-500">
                              Letters: {vertex.letters.split('').join(', ')}
                            </div>
                          )}
                          {hasIssues && (
                            <div className="mt-1 text-xs text-red-600">
                              {hasInvalidChars && <div>• Contains invalid characters</div>}
                              {hasDuplicatesWithOthers && <div>• Has duplicate letters with other vertices</div>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <PolygonVisualization
                    vertices={vertices}
                    vertexCount={polygonConfig.vertexCount}
                    currentVertex={currentVertex}
                  />
                  <div className="mt-4 space-y-2">
                    <Button 
                      onClick={autoFixAlphabet}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      📊 Auto-Distribute Alphabet (A-Z)
                    </Button>
                    <Button 
                      onClick={randomizeAlphabet}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      🎲 Randomize Alphabet Distribution
                    </Button>
                    <Button 
                      onClick={() => {
                        const defaultVertices = Array.from({ length: polygonConfig.vertexCount }, (_, i) => ({
                          pos: i,
                          letters: generateDefaultLetters(i, polygonConfig.vertexCount)
                        }));
                        setVertices(defaultVertices);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      🔄 Reset to Default Distribution
                    </Button>
                  </div>
                  
                  {/* Alphabet Reference */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Complete Alphabet Reference:</h5>
                    <div className="text-xs font-mono">
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Ensure all 26 letters above are distributed across your vertices.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={instruction}
                        onChange={(e) => {
                          const newInstructions = [...instructions];
                          newInstructions[index] = e.target.value;
                          setInstructions(newInstructions);
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const newInstructions = instructions.filter((_, i) => i !== index);
                          setInstructions(newInstructions);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => setInstructions([...instructions, ''])}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Instruction
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example */}
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="example-plaintext">Example Text</Label>
                  <Input
                    id="example-plaintext"
                    value={example.plaintext}
                    onChange={(e) => setExample(prev => ({ ...prev, plaintext: e.target.value }))}
                    placeholder="e.g., TREE"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={generateExampleEncryption} variant="outline">
                    Generate Encryption
                  </Button>
                </div>
                <div>
                  <Label htmlFor="example-encrypted">Encrypted Result</Label>
                  <Input
                    id="example-encrypted"
                    value={example.encrypted}
                    onChange={(e) => setExample(prev => ({ ...prev, encrypted: e.target.value }))}
                    placeholder="e.g., 62-73-42-02"
                  />
                </div>
                <div>
                  <Label htmlFor="example-explanation">Explanation</Label>
                  <Textarea
                    id="example-explanation"
                    value={example.explanation}
                    onChange={(e) => setExample(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Explain how the encryption works..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle>Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question-plaintext">Text to Encrypt</Label>
                  <Input
                    id="question-plaintext"
                    value={questionData.plaintext}
                    onChange={(e) => setQuestionData(prev => ({ ...prev, plaintext: e.target.value }))}
                    placeholder="e.g., WATER"
                  />
                </div>
                <div>
                  <Label htmlFor="question-prompt">Question Prompt</Label>
                  <Input
                    id="question-prompt"
                    value={questionData.prompt}
                    onChange={(e) => setQuestionData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="What is the encrypted message for...?"
                  />
                </div>
                {questionData.plaintext && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <Label>Expected Answer</Label>
                    <p className="font-mono text-lg mt-1">
                      {encryptMessage(questionData.plaintext).encrypted}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setPreviewMode('example')}
                variant={previewMode === 'example' ? 'default' : 'outline'}
              >
                Preview Example
              </Button>
              <Button
                onClick={() => setPreviewMode('question')}
                variant={previewMode === 'question' ? 'default' : 'outline'}
              >
                Preview Question
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {previewMode === 'example' ? 'Example Preview' : 'Question Preview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <PolygonVisualization
                      vertices={vertices}
                      vertexCount={polygonConfig.vertexCount}
                      currentVertex={currentVertex}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Instructions:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {previewMode === 'example' && example.plaintext && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold">Example:</h4>
                        <p><strong>{example.plaintext}</strong> → <strong>{example.encrypted}</strong></p>
                        <p className="text-sm text-gray-600 mt-1">{example.explanation}</p>
                      </div>
                    )}
                    
                    {previewMode === 'question' && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold">{questionData.prompt}</h4>
                        <p className="mt-2"><strong>Text to encrypt:</strong> {questionData.plaintext}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <div className="text-center space-y-4">
            {!alphabetValidation.isComplete && (
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">Cannot submit - Alphabet issues detected:</div>
                    {alphabetValidation.missingLetters.length > 0 && (
                      <div>• Missing: {alphabetValidation.missingLetters.join(', ')}</div>
                    )}
                    {alphabetValidation.duplicateLetters.length > 0 && (
                      <div>• Duplicates: {alphabetValidation.duplicateLetters.join(', ')}</div>
                    )}
                    {alphabetValidation.extraLetters.length > 0 && (
                      <div>• Invalid: {alphabetValidation.extraLetters.join(', ')}</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
              size="lg"
            >
              Submit Cipher Question
            </Button>
            
            {!isFormValid && alphabetValidation.isComplete && (
              <p className="text-sm text-gray-600">
                Please complete all required fields to submit
              </p>
            )}
          </div>
        </div>

        {/* Submission Modal */}
        <CreationSubmissionModal
          isOpen={showSubmissionModal}
          isConfirming={true}
          questionData={
            {
              title: question.draft.title,
              questionType: question.draft.questionType.name,
              points: question.draft.points,
              estimatedTime: question.draft.estimatedTime,
              author: question.draft.teacher.name,
            }
          }          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowSubmissionModal(false)}
          onClose={() => {
            setShowSubmissionModal(false);
            router.push('/add-problem');
          }}
        />
      </div>
    </CreatorWrapper>
  );
} 