import { MonsterPartOptionType } from '@/components/features/question/anomaly-monster/monster-part.type';
import MonsterPartOption from '@/components/features/question/anomaly-monster/monster-part-option';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

export interface MonsterPartOptionsProps {
  options: MonsterPartOptionType[];
  selectedOption: string | undefined;
  onSelection: (option: MonsterPartOptionType) => void;
  onHover: (value: string) => void;
  onMouseLeave: () => void;
}

export default function MonsterPartOptions({
  options,
  selectedOption,
  onSelection,
  onHover,
  onMouseLeave
}: MonsterPartOptionsProps) {
  return (
    <div className="mt-4">
      {options.length <= 5 ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map((option, index) => (
            <MonsterPartOption
              key={index}
              option={option}
              selected={selectedOption === option.value}
              onMouseEnter={() => onHover(option.value)}
              onMouseLeave={onMouseLeave}
              onClick={() => onSelection(option)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto">
          <Carousel className="" opts={{}}>
            <CarouselContent className="w-full">
              {Array.from({
                length: Math.ceil(options.length / 4)
              }).map((_, pageIndex) => (
                <CarouselItem key={pageIndex}>
                  <div className="grid grid-cols-2 gap-2">
                    {options
                      .slice(pageIndex * 4, (pageIndex + 1) * 4)
                      .map((option, index) => (
                        <MonsterPartOption
                          key={index}
                          option={option}
                          selected={selectedOption === option.value}
                          onMouseEnter={() => onHover(option.value)}
                          onMouseLeave={onMouseLeave}
                          onClick={() => onSelection(option)}
                        />
                      ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
