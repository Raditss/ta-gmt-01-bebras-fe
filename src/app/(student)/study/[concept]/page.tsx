import StudyInterface from '@/components/features/study/study-interface';

interface StudyPageProps {
  params: {
    concept: string;
  };
}

export default function StudyPage({ params }: StudyPageProps) {
  return <StudyInterface concept={params.concept} />;
}
