import React from 'react';
import { CommercialHyderabadPageData } from '../types';
import { CommercialCityPage } from './CommercialCityPage';

interface CommercialHyderabadPageProps {
  pageData: CommercialHyderabadPageData;
  onSelectHyderabadPage: (slug: string) => void;
  onBackToHome: () => void;
  onBackToHyderabadCity: () => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
}

export const CommercialHyderabadPage: React.FC<CommercialHyderabadPageProps> = ({
  pageData,
  onSelectHyderabadPage,
  onBackToHome,
  onBackToHyderabadCity,
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <CommercialCityPage
      pageData={pageData}
      cityName="Hyderabad"
      onSelectPage={onSelectHyderabadPage}
      onBackToHome={onBackToHome}
      onBackToCity={onBackToHyderabadCity}
      onOpenQuoteModal={onOpenQuoteModal}
      onOpenSampleModal={onOpenSampleModal}
    />
  );
};
