"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRingCipherQuestion } from '@/models/ring-cipher/create-question/ring-cipher.create.model';
import { useCreation } from '@/hooks/useCreation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Save, Settings, Eye, Plus, Trash2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { CreationSubmissionModal } from './submission-modal';
import { BaseCreatorProps, CreatorWrapper } from './base-creator';
import { CreationData } from '@/services/creationService';
import { useAuth } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';

// Ring configuration options
const RING_COUNT_OPTIONS = [2, 3, 4, 5];

// Helper function to create question instance
const createQuestionInstance = (data: CreationData): CreateRingCipherQuestion => {
  try {
    const instance = new CreateRingCipherQuestion(
      data.title,
      data.description,
      data.difficulty,
      data.category,
      data.points,
      data.estimatedTime,
      data.author,
      data.questionId,
      data.creatorId
    );
    return instance;
  } catch (error) {
    console.error('Error creating ring cipher question instance:', error);
    throw error;
  }
};

interface RingVisualizationProps {
  rings: Array<{ id: number; letters: string[]; currentPosition: number }>;
  highlightedRing?: number;
  ringPositions?: number[];
}

function RingVisualization({ rings, highlightedRing, ringPositions = [] }: RingVisualizationProps) {
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 160;
  const minRadius = 60;

  const ringColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="flex flex-col items-center">
      <svg width="400" height="400" className="border-2 border-gray-300 rounded-lg bg-white">
        {/* Marker at 12 o'clock position - moved higher up with down arrow */}
        <polygon
          points={`${centerX},15 ${centerX - 8},5 ${centerX + 8},5`}
          fill="red"
          className="drop-shadow"
        />
        <text x={centerX} y={3} textAnchor="middle" className="text-xs font-bold fill-red-600">
          MARKER
        </text>

        {/* Draw rings from outer to inner */}
        {rings.slice().reverse().map((ring, reverseIndex) => {
          const ringIndex = rings.length - 1 - reverseIndex;
          const radius = minRadius + (maxRadius - minRadius) * (ringIndex + 1) / rings.length;
          const isHighlighted = ringIndex === highlightedRing;
          const currentPosition = ringPositions[ringIndex] || 0;
          
          const angleStep = (2 * Math.PI) / ring.letters.length;
          // Calculate rotation angle for the entire ring
          const rotationAngle = -(currentPosition * angleStep * 180) / Math.PI;
          
          return (
            <g key={ring.id}>
              {/* Ring circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={isHighlighted ? ringColors[ringIndex % ringColors.length] : '#D1D5DB'}
                strokeWidth={isHighlighted ? "4" : "2"}
                className="transition-all duration-500"
              />
              
              {/* Ring letters group with rotation transform */}
              <g 
                transform={`rotate(${rotationAngle} ${centerX} ${centerY})`}
                className="transition-all duration-500 ease-in-out"
              >
                {ring.letters.map((letter, letterIndex) => {
                  const angle = letterIndex * angleStep - Math.PI / 2; // Start from top
                  const x = centerX + radius * Math.cos(angle);
                  const y = centerY + radius * Math.sin(angle);
                  
                  const isAtMarker = letterIndex === currentPosition; // Letter at marker after rotation
                  
                  return (
                    <g key={letterIndex}>
                      {/* Letter background circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill={isAtMarker ? '#FEF3C7' : 'white'}
                        stroke={isAtMarker ? '#F59E0B' : ringColors[ringIndex % ringColors.length]}
                        strokeWidth={isAtMarker ? "3" : "1"}
                        className="transition-all duration-300"
                      />
                      
                      {/* Letter text */}
                      <text
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        className={`text-sm font-bold transition-all duration-300 ${
                          isAtMarker ? 'fill-orange-700' : 'fill-gray-700'
                        }`}
                      >
                        {letter}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="5" fill="black" />
      </svg>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {rings.map((ring, index) => (
          <Badge
            key={ring.id}
            variant="outline"
            className={`${
              index === highlightedRing ? 'border-2' : 'border'
            }`}
            style={{
              borderColor: ringColors[index % ringColors.length],
              backgroundColor: index === highlightedRing ? `${ringColors[index % ringColors.length]}20` : 'white'
            }}
          >
            Ring {ring.id}: {ring.letters.length} letters
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function RingCipherCreator({ questionId, initialData }: BaseCreatorProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Always call useCreation hook
  const {
    question,
    loading,
    saving,
    error: creationError,
    hasUnsavedChanges,
    saveDraft,
    submitCreation,
    markAsChanged
  } = useCreation({
    questionId,
    questionType: 'ring-cipher',
    initialData,
    createQuestionInstance
  });

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
  const [activeTab, setActiveTab] = useState<'config' | 'rings' | 'content' | 'preview'>('config');
  const [ringCount, setRingCount] = useState(3);
  const [rings, setRings] = useState<Array<{ id: number; letters: string[]; currentPosition: number }>>([]);
  const [instructions, setInstructions] = useState<string[]>([
    "Three concentric rings contain different groups of letters.",
    "A stationary marker points at the 12 o'clock position.",
    "All rings start with their first letter at the marker.",
    "Each letter is encoded as two numbers:",
    "• First number: which ring the letter is on (1, 2, or 3)",
    "• Second number: how many steps clockwise that ring must rotate to bring the letter to the marker",
    "After encryption, the ring stays in its new position for the next letter."
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
  const [highlightedRing, setHighlightedRing] = useState<number | undefined>(undefined);
  const [previewRingPositions, setPreviewRingPositions] = useState<number[]>([]);

  // Initialize state from question
  useEffect(() => {
    if (question) {
      const ringCipherQuestion = question as CreateRingCipherQuestion;
      const content = ringCipherQuestion.getContent();
      
      setRingCount(content.config.ringCount);
      setRings(content.rings);
      setInstructions(content.instructions);
      setExample(content.example);
      setQuestionData({
        plaintext: content.question.plaintext,
        prompt: content.question.prompt
      });
      setPreviewRingPositions(content.rings.map(() => 0));
    }
  }, [question]);

  // Auto-generate default ring configuration when ring count changes
  useEffect(() => {
    if (rings.length !== ringCount) {
      const defaultRings = Array.from({ length: ringCount }, (_, i) => ({
        id: i + 1,
        letters: generateDefaultLetters(i, ringCount),
        currentPosition: 0
      }));
      setRings(defaultRings);
    }
  }, [ringCount, rings.length]);

  // Generate default letter distribution
  const generateDefaultLetters = (ringIndex: number, totalRings: number) => {
    if (totalRings === 3) {
      // Use the default distribution from the example
      const distributions = [
        ['A', 'E', 'I', 'O', 'U', 'Y'],
        ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
        ['N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z']
      ];
      return distributions[ringIndex] || [];
    } else {
      // Auto-distribute alphabet
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const lettersPerRing = Math.ceil(26 / totalRings);
      const startIndex = ringIndex * lettersPerRing;
      const endIndex = Math.min(startIndex + lettersPerRing, 26);
      return alphabet.slice(startIndex, endIndex);
    }
  };

  // Validate alphabet coverage
  const validateAlphabetCoverage = useCallback(() => {
    const allLetters = rings.flatMap(ring => ring.letters);
    const uniqueLetters = [...new Set(allLetters)];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    const missingLetters = alphabet.filter(letter => !uniqueLetters.includes(letter));
    const extraLetters = uniqueLetters.filter(letter => !alphabet.includes(letter));
    
    // Find duplicate letters across rings
    const letterCounts: { [key: string]: number } = {};
    allLetters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    const duplicateLetters = Object.keys(letterCounts).filter(letter => letterCounts[letter] > 1);
    
    return {
      isComplete: missingLetters.length === 0 && duplicateLetters.length === 0 && extraLetters.length === 0,
      missingLetters,
      extraLetters,
      duplicateLetters,
      totalCovered: uniqueLetters.length,
    };
  }, [rings]);

  // Handle ring letter input with duplicate prevention
  const handleRingLetterChange = useCallback((ringIndex: number, newLettersStr: string) => {
    const newLetters = newLettersStr.toUpperCase().replace(/[^A-Z]/g, '').split('').filter(Boolean);
    
    // Check for duplicates across other rings
    const otherRingsLetters = rings
      .filter((_, index) => index !== ringIndex)
      .flatMap(ring => ring.letters);
    
    // Remove any letters that already exist in other rings
    const uniqueLetters = newLetters.filter(letter => 
      !otherRingsLetters.includes(letter)
    );
    
    const newRings = [...rings];
    newRings[ringIndex] = { 
      ...newRings[ringIndex], 
      letters: uniqueLetters
    };
    setRings(newRings);
  }, [rings]);

  // Auto-fix alphabet distribution
  const autoFixAlphabet = useCallback(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const newRings = Array.from({ length: ringCount }, (_, i) => ({
      id: i + 1,
      letters: [] as string[],
      currentPosition: 0
    }));
    
    // Distribute letters evenly
    alphabet.forEach((letter, index) => {
      const ringIndex = index % ringCount;
      newRings[ringIndex].letters.push(letter);
    });
    
    setRings(newRings);
  }, [ringCount]);

  const alphabetValidation = validateAlphabetCoverage();

  // Encryption helper functions
  const findLetterRing = useCallback((letter: string): number => {
    return rings.findIndex(ring => 
      ring.letters.includes(letter.toUpperCase())
    );
  }, [rings]);

  const getLetterPositionInRing = useCallback((ringIndex: number, letter: string): number => {
    return rings[ringIndex]?.letters.indexOf(letter.toUpperCase()) ?? -1;
  }, [rings]);

  // Encrypt a message
  const encryptMessage = useCallback((plaintext: string) => {
    const ringPositions = rings.map(() => 0); // All rings start at position 0
    const steps: Array<{
      letter: string;
      ringId: number;
      initialPosition: number;
      stepsToRotate: number;
      finalPosition: number;
      code: string;
    }> = [];
    const codes: string[] = [];
    
    for (const char of plaintext.toUpperCase()) {
      if (char.match(/[A-Z]/)) {
        const ringIndex = findLetterRing(char);
        if (ringIndex !== -1) {
          const letterPosition = getLetterPositionInRing(ringIndex, char);
          const initialPosition = ringPositions[ringIndex];
          
          // Calculate steps needed to rotate ring clockwise to bring letter to marker
          const ring = rings[ringIndex];
          const stepsToRotate = (letterPosition - initialPosition + ring.letters.length) % ring.letters.length;
          
          // Update ring position
          ringPositions[ringIndex] = letterPosition;
          
          const code = `${ringIndex + 1}${stepsToRotate}`;
          codes.push(code);
          
          steps.push({
            letter: char,
            ringId: ringIndex + 1,
            initialPosition,
            stepsToRotate,
            finalPosition: letterPosition,
            code
          });
        }
      }
    }
    
    return {
      encrypted: codes.join('-'),
      steps
    };
  }, [rings, findLetterRing, getLetterPositionInRing]);

  // Update question content
  const updateQuestionContent = useCallback(() => {
    if (!question) return;
    
    const ringCipherQuestion = question as CreateRingCipherQuestion;
    
    // Update config
    ringCipherQuestion.setRingCount(ringCount);
    
    // Update rings
    rings.forEach((ring, index) => {
      ringCipherQuestion.setRingLetters(index, ring.letters);
    });
    
    // Update other content
    ringCipherQuestion.setInstructions(instructions);
    ringCipherQuestion.setExample(example.plaintext, example.encrypted, example.explanation);
    ringCipherQuestion.setQuestion(questionData.plaintext, questionData.prompt);
    
    // Calculate answer if we have a question plaintext
    if (questionData.plaintext.trim()) {
      const answer = encryptMessage(questionData.plaintext);
      ringCipherQuestion.setAnswer(answer.encrypted, answer.steps);
    }
    
    markAsChanged();
  }, [question, ringCount, rings, instructions, example, questionData, encryptMessage, markAsChanged]);

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
        `${step.letter}→Ring ${step.ringId}, rotate ${step.stepsToRotate} steps = ${step.code}`
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
    if (!question || !rings.length) return;
    setShowSubmissionModal(true);
  }, [question, rings.length]);

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

  const getQuestionMetadata = useCallback(() => {
    if (!question) return null;
    
    return {
      title: question.getTitle(),
      description: question.getDescription(),
      difficulty: question.getDifficulty(),
      category: question.getCategory(),
      points: question.getPoints(),
      estimatedTime: question.getEstimatedTime(),
      author: question.getAuthor()
    };
  }, [question]);

  // Handle loading states
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg mb-4">Authentication required to create questions</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isFormValid = rings.length > 0 && 
                     instructions.length > 0 && 
                     questionData.plaintext.trim() && 
                     questionData.prompt.trim() &&
                     alphabetValidation.isComplete;

  return (
    <CreatorWrapper
      loading={loading}
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
            <h1 className="text-3xl font-bold">Create Ring Cipher Question</h1>
            <p className="text-gray-600">Build an interactive concentric ring cipher challenge</p>
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
            <Button onClick={handleManualSave} disabled={saving} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          {[
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'rings', label: 'Ring Setup', icon: RotateCw },
            { id: 'content', label: 'Content', icon: AlertCircle },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
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

        {/* Basic Configuration Tab */}
        {activeTab === 'config' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ring Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ring-count">Number of Rings</Label>
                  <Select
                    value={ringCount.toString()}
                    onValueChange={(value) => setRingCount(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RING_COUNT_OPTIONS.map(count => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} rings
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Ring Cipher Rules</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• All rings start with their first letter at the marker</li>
                    <li>• Each ring rotates independently</li>
                    <li>• After encryption, rings stay in their new position</li>
                    <li>• Code format: Ring number + rotation steps</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ring Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <RingVisualization
                  rings={rings}
                  highlightedRing={highlightedRing}
                  ringPositions={previewRingPositions}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Simple Ring Setup */}
        {activeTab === 'rings' && (
          <Card>
            <CardHeader>
              <CardTitle>Ring Letter Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Define which letters belong to each ring. All 26 letters (A-Z) must be covered.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rings.map((ring, index) => (
                  <div key={ring.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                      {ring.id}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`ring-${ring.id}`}>
                        Ring {ring.id} Letters ({ring.letters.length} letters)
                      </Label>
                      <Input
                        id={`ring-${ring.id}`}
                        value={ring.letters.join('')}
                        onChange={(e) => handleRingLetterChange(index, e.target.value)}
                        placeholder="e.g., AEIOU"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
                
                <Button onClick={autoFixAlphabet} className="w-full">
                  Auto-Distribute Alphabet (A-Z)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
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
                    placeholder="e.g., HELLO"
                  />
                </div>
                <Button onClick={generateExampleEncryption} variant="outline">
                  Generate Encryption
                </Button>
                <div>
                  <Label htmlFor="example-encrypted">Encrypted Result</Label>
                  <Input
                    id="example-encrypted"
                    value={example.encrypted}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>

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

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <RingVisualization
                    rings={rings}
                    highlightedRing={highlightedRing}
                    ringPositions={previewRingPositions}
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
                  
                  {example.plaintext && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold">Example:</h4>
                      <p><strong>{example.plaintext}</strong> → <strong>{example.encrypted}</strong></p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold">{questionData.prompt}</h4>
                    <p className="mt-2"><strong>Text to encrypt:</strong> {questionData.plaintext}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
            size="lg"
          >
            Submit Ring Cipher Question
          </Button>
        </div>

        {/* Submission Modal */}
        <CreationSubmissionModal
          isOpen={showSubmissionModal}
          isConfirming={!saving}
          questionData={getQuestionMetadata()}
          onConfirm={handleConfirmSubmit}
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