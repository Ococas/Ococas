import { useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

type Language = 'pt' | 'en';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('pt');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value as string;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  }, []);

  return { t, language, toggleLanguage };
}