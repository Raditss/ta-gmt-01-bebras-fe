'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, TreePine, Lock, Play } from 'lucide-react';
import { useState } from 'react';
import { QuestionTypeModal } from '@/components/features/questions/question-type-modal';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { questionsApi } from '@/lib/api/questions.api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const learningCards = [
  {
    id: 'cipher',
    title: 'Cipher',
    description: 'Pelajari teknik enkripsi dan dekripsi dalam keamanan data',
    icon: Lock,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pohon-keputusan',
    title: 'Pohon Keputusan',
    description: 'Konsep decision tree dan machine learning',
    icon: TreePine,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'cfg',
    title: 'Context-Free Grammar',
    description: 'Pelajari grammar bebas konteks dan transformasi string',
    icon: BookOpen,
    color: 'from-purple-500 to-purple-600'
  }
];

export default function ExercisePage() {
  const router = useRouter();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const handleGenerateQuestion = async (type: QuestionTypeEnum) => {
    console.log('handleGenerateQuestion called with type:', type);

    try {
      setIsTypeModalOpen(false);

      // Show loading state while generating
      console.log('Generating question for type:', type);

      // Call backend to generate the question
      console.log('Calling questionsApi.generateQuestion...');
      const generatedQuestion = await questionsApi.generateQuestion(type);
      console.log('Generated question received:', generatedQuestion);

      // Store the generated question in sessionStorage for the solve page
      sessionStorage.setItem(
        'generatedQuestion',
        JSON.stringify(generatedQuestion)
      );
      console.log('Question stored in sessionStorage');

      // Navigate to the generated question solver
      const targetUrl = `/problems/generated/${type}/solve`;
      console.log('Navigating to:', targetUrl);
      router.push(targetUrl);
    } catch (error) {
      console.error('Failed to generate question:', error);
      console.error('Error details:', error);
      // Reopen modal on error
      setIsTypeModalOpen(true);
      // You could show an error toast here
      alert(
        `Gagal membuat soal: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`
      );
    }
  };

  const handleOpenGenerateModal = () => {
    setIsTypeModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Latihan Konsep
          </h1>
          <p className="text-lg text-gray-600">
            Pilih konsep yang ingin Anda pelajari dan latih
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link key={card.id} href={`/study/${card.id}`}>
                  <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-48 border-0 overflow-hidden group">
                    <div
                      className={`h-full bg-gradient-to-br ${card.color} p-6 text-white relative`}
                    >
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <IconComponent size={48} />
                      </div>
                      <CardContent className="p-0 h-full flex flex-col justify-between">
                        <div>
                          <div className="mb-4">
                            <IconComponent size={32} className="mb-2" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {card.title}
                          </h3>
                          <p className="text-sm text-white/90 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                            Mulai Belajar →
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Latihan dengan Soal Acak Section */}
        <div className="text-center mt-100">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Siap untuk Tantangan?
            </h2>
            <p className="text-gray-700 mb-6">
              Coba kemampuan Anda dengan soal acak dari berbagai jenis konsep
            </p>
            <Button
              onClick={handleOpenGenerateModal}
              className="bg-blue-500 text-white hover:bg-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Latihan dengan Soal Acak
            </Button>
          </div>
        </div>
      </div>

      {/* Question Type Modal */}
      <QuestionTypeModal
        open={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelectType={handleGenerateQuestion}
      />
    </div>
  );
}
