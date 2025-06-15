
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const LanguageSettingsDialog = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Language Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Language Settings / भाषा सेटिंग्स</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="language-selection">Choose Interface Language / इंटरफेस भाषा चुनें</Label>
          <RadioGroup 
            value={language} 
            onValueChange={handleLanguageChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english" className="font-normal">
                English Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hindi" id="hindi" />
              <Label htmlFor="hindi" className="font-normal">
                हिंदी केवल / Hindi Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bilingual" id="bilingual" />
              <Label htmlFor="bilingual" className="font-normal">
                Bilingual / द्विभाषी (English + हिंदी)
              </Label>
            </div>
          </RadioGroup>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Current Selection: <strong>
                {language === 'english' ? 'English Only' : 
                 language === 'hindi' ? 'हिंदी केवल' : 
                 'Bilingual / द्विभाषी'}
              </strong>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSettingsDialog;
