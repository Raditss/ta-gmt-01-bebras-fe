import { Button } from '@/components/ui/button';
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';
import { Plus, Trash2 } from 'lucide-react';

// Rules Section Component
export function RulesSection({
  rules,
  onAddRule,
  onDeleteRule
}: {
  rules: {
    id: string;
    before: { id: number; type: string }[];
    after: { id: number; type: string }[];
  }[];
  onAddRule: () => void;
  onDeleteRule: (ruleId: string) => void;
}) {
  const RuleShape = ({ type }: { type: string }) => (
    <ShapeContainer>
      <Shape type={type} size="md" />
    </ShapeContainer>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center text-foreground">
          Tabel Aturan
        </h2>
        <Button
          onClick={onAddRule}
          className="bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/30 flex items-center gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Tambah Aturan
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted">
          <div className="mb-4">
            <Plus className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p className="text-lg font-medium mb-2">
            Belum ada aturan yang dibuat
          </p>
          <p className="text-sm">
            Klik &quot;Tambah Aturan&quot; untuk membuat aturan transformasi
            pertama
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-[1fr,1fr,auto] border-b-2 border-muted bg-muted/30">
            <div className="p-4 text-center font-medium border-r-2 border-muted text-foreground">
              Sebelum
            </div>
            <div className="p-4 text-center font-medium border-r-2 border-muted text-foreground">
              Sesudah
            </div>
            <div className="p-4 text-center font-medium w-24 text-foreground">
              Aksi
            </div>
          </div>

          {rules.map((rule) => (
            <div
              key={rule.id}
              className="grid grid-cols-[1fr,1fr,auto] border-b border-muted last:border-b-0"
            >
              <div className="p-6 flex justify-center items-center border-r-2 border-muted">
                <div className="flex flex-wrap justify-center gap-2 max-w-full">
                  {rule.before.map((obj, idx) => (
                    <RuleShape key={idx} type={obj.type} />
                  ))}
                </div>
              </div>
              <div className="p-6 flex justify-center items-center border-r-2 border-muted">
                <div className="flex flex-wrap justify-center gap-2 max-w-full">
                  {rule.after.map((obj, idx) => (
                    <RuleShape key={idx} type={obj.type} />
                  ))}
                </div>
              </div>
              <div className="p-6 flex justify-center items-center w-24">
                <Button
                  onClick={() => onDeleteRule(rule.id)}
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 p-2 h-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
