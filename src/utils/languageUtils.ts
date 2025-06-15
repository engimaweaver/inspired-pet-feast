
import { Language } from '@/contexts/LanguageContext';

export const getDisplayText = (
  englishText: string, 
  hindiText: string, 
  language: Language
): string => {
  switch (language) {
    case 'english':
      return englishText;
    case 'hindi':
      return hindiText;
    case 'bilingual':
      return `${hindiText} / ${englishText}`;
    default:
      return englishText;
  }
};

export const getButtonText = (
  englishText: string,
  hindiText: string,
  language: Language
): string => {
  return getDisplayText(englishText, hindiText, language);
};

export const getToastText = (
  englishTitle: string,
  hindiTitle: string,
  englishDesc?: string,
  hindiDesc?: string,
  language: Language = 'english'
): { title: string; description?: string } => {
  const title = getDisplayText(englishTitle, hindiTitle, language);
  const description = englishDesc && hindiDesc ? 
    getDisplayText(englishDesc, hindiDesc, language) : undefined;
  
  return { title, description };
};
