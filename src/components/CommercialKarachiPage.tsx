import React from 'react';
import { CommercialKarachiPageData } from '../types';
import { CommercialCityPage } from './CommercialCityPage';

interface CommercialKarachiPageProps {
  pageData: CommercialKarachiPageData;
  onSelectKarachiPage: (slug: string) => void;
  onBackToHome: () => void;
  onBackToKarachiCity: () => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
}

export const CommercialKarachiPage: React.FC<CommercialKarachiPageProps> = ({
  pageData,
  onSelectKarachiPage,
  onBackToHome,
  onBackToKarachiCity,
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <CommercialCityPage
      pageData={pageData}
      cityName="Karachi"
      onSelectPage={onSelectKarachiPage}
      onBackToHome={onBackToHome}
      onBackToCity={onBackToKarachiCity}
      onOpenQuoteModal={onOpenQuoteModal}
      onOpenSampleModal={onOpenSampleModal}
    />
  );
};
