import React from 'react';
import { CommercialLahorePageData } from '../types';
import { CommercialCityPage } from './CommercialCityPage';

interface CommercialLahorePageProps {
  pageData: CommercialLahorePageData;
  onSelectLahorePage: (slug: string) => void;
  onBackToHome: () => void;
  onBackToLahoreCity: () => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
}

export const CommercialLahorePage: React.FC<CommercialLahorePageProps> = ({
  pageData,
  onSelectLahorePage,
  onBackToHome,
  onBackToLahoreCity,
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <CommercialCityPage
      pageData={pageData}
      cityName="Lahore"
      onSelectPage={onSelectLahorePage}
      onBackToHome={onBackToHome}
      onBackToCity={onBackToLahoreCity}
      onOpenQuoteModal={onOpenQuoteModal}
      onOpenSampleModal={onOpenSampleModal}
    />
  );
};
