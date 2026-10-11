import React from 'react';
import { CommercialFaisalabadPageData } from '../types';
import { CommercialCityPage } from './CommercialCityPage';

interface CommercialFaisalabadPageProps {
  pageData: CommercialFaisalabadPageData;
  onSelectFaisalabadPage: (slug: string) => void;
  onBackToHome: () => void;
  onBackToFaisalabadCity: () => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
}

export const CommercialFaisalabadPage: React.FC<CommercialFaisalabadPageProps> = ({
  pageData,
  onSelectFaisalabadPage,
  onBackToHome,
  onBackToFaisalabadCity,
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <CommercialCityPage
      pageData={pageData}
      cityName="Faisalabad"
      onSelectPage={onSelectFaisalabadPage}
      onBackToHome={onBackToHome}
      onBackToCity={onBackToFaisalabadCity}
      onOpenQuoteModal={onOpenQuoteModal}
      onOpenSampleModal={onOpenSampleModal}
    />
  );
};
