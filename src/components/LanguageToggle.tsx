import React from 'react';

interface LanguageToggleProps {
  language: string;
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center w-12 h-8 text-white text-sm font-medium hover:bg-white/10 rounded transition-colors"
    >
      {language.toUpperCase()}
    </button>
  );
}