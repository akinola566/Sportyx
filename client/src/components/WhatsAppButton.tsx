import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  // Include Nigerian country code (+234) but remove the leading 0
  const whatsappNumber = "2348100096815";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  
  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        className="bg-green-500 hover:bg-green-600 text-white p-3 h-14 w-14 rounded-full shadow-lg transition-all flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
};

export default WhatsAppButton;
