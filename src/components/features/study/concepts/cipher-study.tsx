import {
  CryptographyIntroPage,
  EncryptionTypesPage,
  CryptographyApplicationsPage,
  CipherNInteractivePage,
  RingCipherInteractivePage
} from './cipher-pages';

interface CipherStudyProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function CipherStudy({
  currentPage,
  setCurrentPage: _setCurrentPage
}: CipherStudyProps) {
  // Array of page components
  const pageComponents = [
    CryptographyIntroPage,
    EncryptionTypesPage,
    CryptographyApplicationsPage,
    CipherNInteractivePage,
    RingCipherInteractivePage
  ];

  // Get the current page component
  const CurrentPageComponent = pageComponents[currentPage] || pageComponents[0];

  return <CurrentPageComponent />;
}
