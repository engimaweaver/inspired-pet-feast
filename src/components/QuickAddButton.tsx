
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAddButtonProps {
  onClick: () => void;
}

const QuickAddButton = ({ onClick }: QuickAddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 z-50"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default QuickAddButton;
