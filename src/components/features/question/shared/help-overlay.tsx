'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HelpOverlayProps {
  questionType: string;
  children: React.ReactNode;
}

export function HelpOverlay({ questionType, children }: HelpOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Help Button */}
      <div className="">
        <Button
          onClick={toggleHelp}
          size="icon"
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          aria-label="Help"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Help Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={toggleHelp}
        >
          <Card
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                Help - {questionType}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleHelp}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
