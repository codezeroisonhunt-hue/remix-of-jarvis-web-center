
import React, { useState } from 'react';
import { Check, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supportedLanguages } from '@/services/languageService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CommandInput, CommandList, CommandItem, Command } from '@/components/ui/command';

interface LanguageSwitcherProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isHackerMode?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  selectedLanguage,
  onLanguageChange,
  isHackerMode = false
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLang = supportedLanguages.find(lang => lang.code === selectedLanguage);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-start ${
            isHackerMode 
              ? 'bg-black/70 border-red-500/30 hover:bg-red-900/20' 
              : 'bg-black/40 border-jarvis/30 hover:bg-jarvis/20'
          }`}
        >
          <Languages className="mr-2 h-4 w-4" />
          {selectedLang ? selectedLang.name : 'Select language'}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-[200px] p-0 ${
          isHackerMode 
            ? 'bg-black border-red-500/30' 
            : 'bg-black/90 border-jarvis/30'
        }`}
      >
        <Command>
          <CommandInput 
            placeholder="Search language..." 
            value={search}
            onValueChange={setSearch}
            className={isHackerMode ? 'border-b border-red-500/30' : 'border-b border-jarvis/30'}
          />
          <CommandList>
            {supportedLanguages
              .filter(lang => 
                lang.name.toLowerCase().includes(search.toLowerCase()) || 
                lang.code.toLowerCase().includes(search.toLowerCase())
              )
              .map(lang => (
                <CommandItem
                  key={lang.code}
                  onSelect={() => {
                    onLanguageChange(lang.code);
                    setOpen(false);
                  }}
                  className={`flex items-center cursor-pointer p-2 ${
                    selectedLanguage === lang.code
                      ? isHackerMode ? 'bg-red-900/20' : 'bg-jarvis/20'
                      : ''
                  } hover:${isHackerMode ? 'bg-red-900/10' : 'bg-jarvis/10'}`}
                >
                  {selectedLanguage === lang.code && (
                    <Check className={`mr-2 h-4 w-4 ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
                  )}
                  <span className="flex-1">
                    {lang.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {lang.code}
                  </span>
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
