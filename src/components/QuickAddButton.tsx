
import { Button } from '@/components/ui/button';

interface QuickAddButtonProps {
  onClick: () => void;
}

const QuickAddButton = ({ onClick }: QuickAddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 z-50 px-6 py-3 h-auto rounded-full"
    >
      New bill
    </Button>
  );
};

export default QuickAddButton;
