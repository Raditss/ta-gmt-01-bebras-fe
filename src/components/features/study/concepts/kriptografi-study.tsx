import {
  CryptographyIntroPage,
  EncryptionTypesPage,
  CryptographyApplicationsPage
} from './kriptografi-pages';

interface KriptografiStudyProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function KriptografiStudy({
  currentPage,
  setCurrentPage: _setCurrentPage
}: KriptografiStudyProps) {
  // Array of page components
  const pageComponents = [
    CryptographyIntroPage,
    EncryptionTypesPage,
    CryptographyApplicationsPage
  ];

  // Get the current page component
  const CurrentPageComponent = pageComponents[currentPage] || pageComponents[0];

  return <CurrentPageComponent />;
}
