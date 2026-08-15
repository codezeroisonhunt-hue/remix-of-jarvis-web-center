
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-[#33c3f0]" />
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[140px] bg-black/20 border-[#33c3f0]/20 focus:ring-[#33c3f0]/30">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-[#0f1019] border-[#33c3f0]/20">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="text-[#d6d6ff] hover:bg-[#33c3f0]/10 focus:bg-[#33c3f0]/10"
            >
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
