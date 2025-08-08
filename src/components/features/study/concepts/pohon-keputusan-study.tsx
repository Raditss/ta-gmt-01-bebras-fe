import {
  DecisionTreeApplicationsPage,
  DecisionTreeIntroPage,
  DecisionTreeWorkingPage,
  AnomalyMonsterInteractivePage
} from './pohon-keputusan-pages';

interface PohonKeputusanStudyProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function PohonKeputusanStudy({
  currentPage,
  setCurrentPage: _setCurrentPage
}: PohonKeputusanStudyProps) {
  // Array of page components
  const pageComponents = [
    DecisionTreeIntroPage,
    DecisionTreeWorkingPage,
    DecisionTreeApplicationsPage,
    AnomalyMonsterInteractivePage
  ];

  // Get the current page component
  const CurrentPageComponent = pageComponents[currentPage] || pageComponents[0];

  return <CurrentPageComponent />;
}
