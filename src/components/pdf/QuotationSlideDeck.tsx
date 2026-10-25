import React from 'react';
import { AppSettings, Quotation, PlacePackage } from '../../types/placePackage';
import { ContinuousBrochurePreviewDeck } from './ContinuousBrochurePreviewDeck';

interface QuotationSlideDeckProps {
  quotation: Quotation;
  settings?: AppSettings;
  placePackages?: PlacePackage[];
  onSaved?: () => void;
}

/**
 * Backward compatibility wrapper routing legacy slide deck requests
 * to the new single continuous long-page brochure preview.
 */
export const QuotationSlideDeck: React.FC<QuotationSlideDeckProps> = ({
  quotation,
  onSaved,
}) => {
  return <ContinuousBrochurePreviewDeck quotation={quotation} onSaved={onSaved} />;
};
