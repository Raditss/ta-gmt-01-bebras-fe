'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { studyComponentRegistry } from '@/components/features/study/study-component-registry';
import Link from 'next/link';

interface StudyInterfaceProps {
  concept: string;
}

export default function StudyInterface({ concept }: StudyInterfaceProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const StudyComponent = studyComponentRegistry[concept];

  if (!StudyComponent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Study concept not found
          </h1>
          <p className="text-gray-600">
            The concept &quot;{concept}&quot; is not available.
          </p>
          <Link href="/exercise">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Latihan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
    scrollToTop();
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Exercise Button */}
        <div className="flex items-center">
          <Link href="/exercise">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Latihan
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 min-h-[600px] flex flex-col">
          <div className="flex-1 mb-8">
            <StudyComponent
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <div className="flex justify-between items-center border-t pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>

            <div className="text-sm text-gray-500">
              Halaman {currentPage + 1}
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
