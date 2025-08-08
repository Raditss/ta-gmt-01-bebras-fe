import KriptografiStudy from '@/components/features/study/concepts/kriptografi-study';
import PohonKeputusanStudy from '@/components/features/study/concepts/pohon-keputusan-study';
import CFGStudy from '@/components/features/study/concepts/cfg-study';

// Component registry - maps concept IDs to their respective study components
export const studyComponentRegistry: Record<
  string,
  React.ComponentType<{
    currentPage: number;
    setCurrentPage: (page: number) => void;
  }>
> = {
  kriptografi: KriptografiStudy,
  'pohon-keputusan': PohonKeputusanStudy,
  cfg: CFGStudy
};

// Helper function to get available concepts
export const getAvailableConcepts = () => Object.keys(studyComponentRegistry);

// Helper function to check if a concept exists
export const isValidConcept = (concept: string) =>
  concept in studyComponentRegistry;
