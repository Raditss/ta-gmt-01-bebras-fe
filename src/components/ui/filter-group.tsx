import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export interface FilterOption {
  id: number
  label: string
}

interface FilterGroupProps {
  options: FilterOption[]
  selectedOptions: Record<string, boolean>
  onChange: (optionId: number) => void
  title?: string
}

export function FilterGroup({ options, selectedOptions, onChange, title }: FilterGroupProps) {
  return (
    <div className="space-y-2">
      {title && <h3 className="font-medium mb-2">{title}</h3>}
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id.toString()}
            checked={selectedOptions[option.id]}
            onCheckedChange={() => onChange(option.id)}
          />
          <Label htmlFor={option.id.toString()} className="text-sm">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  )
} 