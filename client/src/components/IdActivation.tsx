import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const IdActivation = () => {
  const [activationId, setActivationId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleActivate = async () => {
    if (!activationId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid activation ID",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await apiRequest('POST', '/api/user/activate', { code: activationId });
      
      toast({
        title: "Success!",
        description: "Your account has been activated successfully!",
      });
      
      // Invalidate the activation status query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['/api/user/activation-status'] });
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "The ID you entered is invalid or has already been used",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 m-4 rounded-lg">
      <h2 className="font-montserrat font-bold text-xl mb-4">Activate Premium Predictions</h2>
      <p className="text-gray-600 mb-4">Enter your ID to access premium predictions and multipliers.</p>
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          value={activationId}
          onChange={(e) => setActivationId(e.target.value)}
          placeholder="Enter your activation ID"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          onClick={handleActivate}
          disabled={isVerifying}
          className="bg-primary hover:bg-red-700 text-white font-montserrat font-semibold py-2 px-6 rounded transition"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </div>
      <p className="mt-4 text-gray-600">
        Don't have an ID? <a href="https://wa.me/08100096815" target="_blank" className="text-primary hover:underline">Chat Now</a> to get yours!
      </p>
    </div>
  );
};

export default IdActivation;
