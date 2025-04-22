import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Prediction } from '@shared/schema';

interface PredictionsDashboardProps {
  isVisible: boolean;
}

const PredictionsDashboard = ({ isVisible }: PredictionsDashboardProps) => {
  const [sportFilter, setSportFilter] = useState('All Sports');
  const { toast } = useToast();

  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions'],
    enabled: isVisible,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load predictions",
        variant: "destructive",
      });
    }
  });

  if (!isVisible) {
    return null;
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'status-live';
      case 'upcoming':
        return 'status-upcoming';
      case 'tomorrow':
        return 'status-tomorrow';
      default:
        return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  };

  // Use mock data while waiting for actual API implementation
  const mockPredictions: Prediction[] = [
    {
      id: 1,
      match: "Manchester City vs Liverpool",
      league: "Premier League",
      prediction: "Over 2.5",
      multiplier: "1.8x",
      time: "20:45",
      status: "Live",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      match: "Real Madrid vs Barcelona",
      league: "La Liga",
      prediction: "BTTS",
      multiplier: "1.95x",
      time: "21:00",
      status: "Upcoming",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      match: "Lakers vs Warriors",
      league: "NBA",
      prediction: "Warriors +3.5",
      multiplier: "1.75x",
      time: "03:30",
      status: "Live",
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      match: "Djokovic vs Nadal",
      league: "ATP Finals",
      prediction: "Nadal Win",
      multiplier: "2.1x",
      time: "16:00",
      status: "Tomorrow",
      createdAt: new Date().toISOString(),
    }
  ];

  // Use actual predictions if available, otherwise use mock data
  const displayPredictions = predictions || mockPredictions;

  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-montserrat font-semibold text-lg mb-2">Total Predictions</h3>
          <p className="text-3xl font-bold text-primary">{displayPredictions.length}</p>
          <p className="text-gray-500 text-sm">Updated today</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-montserrat font-semibold text-lg mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-success">89%</p>
          <p className="text-gray-500 text-sm">Last 30 days</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-montserrat font-semibold text-lg mb-2">Average Multiplier</h3>
          <p className="text-3xl font-bold text-accent">1.87x</p>
          <p className="text-gray-500 text-sm">Across all predictions</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-montserrat font-bold text-2xl">Today's Predictions</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Filter:</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
            >
              <option>All Sports</option>
              <option>Football</option>
              <option>Basketball</option>
              <option>Tennis</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Multiplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayPredictions.map((prediction) => (
                  <tr key={prediction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{prediction.match}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{prediction.league}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{prediction.prediction}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-primary font-bold">{prediction.multiplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{prediction.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusClass(prediction.status)}>
                        {prediction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <Button className="bg-primary/10 hover:bg-primary/20 text-primary font-montserrat font-medium">
            Load More Predictions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictionsDashboard;
