import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, TreePine, Lock } from 'lucide-react';

const learningCards = [
  {
    id: 'kriptografi',
    title: 'Kriptografi',
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
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Latihan Konsep
          </h1>
          <p className="text-lg text-gray-600">
            Pilih konsep yang ingin Anda pelajari dan latih
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
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
      </div>
    </div>
  );
}
