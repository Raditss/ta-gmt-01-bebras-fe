'use client';

import { State, Rule } from '@/types/cfg.type';
import { Button } from '@/components/ui/button';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';

export interface StateDrawerSolveProps {
  targetState: State[];
  currentState: State[];
  selectedIndices: number[];
  applicableRules: Rule[];
  onObjectClick: (index: number) => void;
  onApplyRule: (rule: Rule) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}

export function StateDrawerSolve({
  targetState,
  currentState,
  selectedIndices,
  applicableRules,
  onObjectClick,
  onApplyRule,
  onUndo,
  onRedo,
  onReset
}: StateDrawerSolveProps) {
  return (
    <SheetContent className="min-w-80 max-w-96">
      <SheetHeader>
        <SheetTitle>🐟 Status Perdagangan Ikan</SheetTitle>
        <SheetDescription>
          Kelola koleksi ikan dan terapkan aturan perdagangan untuk mencapai
          target
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 mt-6">
        {/* Target State */}
        <div>
          <h3 className="text-md font-semibold mb-2">🎯 Target Koleksi</h3>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md min-h-16">
            {targetState.map((obj, idx) => (
              <ShapeContainer key={idx}>
                <Shape type={obj.type} size="sm" />
              </ShapeContainer>
            ))}
          </div>
        </div>

        {/* Current State */}
        <div>
          <h3 className="text-md font-semibold mb-2">🐟 Koleksi Sekarang</h3>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md min-h-16">
            {currentState.map((obj, idx) => (
              <ShapeContainer
                key={idx}
                interactive
                className={
                  selectedIndices.includes(idx) ? 'ring-2 ring-blue-500' : ''
                }
                onClick={() => onObjectClick(idx)}
              >
                <Shape
                  type={obj.type}
                  size="sm"
                  interactive
                  selected={selectedIndices.includes(idx)}
                />
              </ShapeContainer>
            ))}
          </div>
        </div>

        {/* Applicable Rules */}
        <div>
          <h3 className="text-md font-semibold mb-2">
            🔄 Perdagangan Tersedia
          </h3>
          <div className="space-y-2">
            {applicableRules.length > 0 ? (
              applicableRules.map((rule, idx) => (
                <Button
                  key={idx}
                  onClick={() => onApplyRule(rule)}
                  variant="outline"
                  className="w-full p-3 h-auto flex items-center gap-3"
                >
                  <div className="flex gap-1">
                    {rule.before.map((obj, idx) => (
                      <ShapeContainer key={idx}>
                        <Shape type={obj.type} size="sm" />
                      </ShapeContainer>
                    ))}
                  </div>
                  <span>→</span>
                  <div className="flex gap-1">
                    {rule.after.map((obj, idx) => (
                      <ShapeContainer key={idx}>
                        <Shape type={obj.type} size="sm" />
                      </ShapeContainer>
                    ))}
                  </div>
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {selectedIndices.length === 0
                  ? 'Pilih ikan untuk melihat perdagangan yang tersedia'
                  : 'Tidak ada perdagangan untuk ikan yang dipilih'}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t">
          <Button onClick={onUndo} variant="outline" className="w-full">
            ↶ Batalkan
          </Button>
          <Button onClick={onRedo} variant="outline" className="w-full">
            ↷ Ulangi
          </Button>
          <Button onClick={onReset} variant="destructive" className="w-full">
            🔄 Reset Semua
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
