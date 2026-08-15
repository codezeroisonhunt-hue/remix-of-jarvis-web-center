
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, Satellite } from 'lucide-react';
import SatelliteSurveillance from '@/components/SatelliteSurveillance';
import JarvisSidebar from '@/components/JarvisSidebar';
import { Button } from '@/components/ui/button';

const SatelliteSurveillancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-jarvis-bg flex">
      <JarvisSidebar />
      <div className="flex-1 p-4 md:p-6">
        <Helmet>
          <title>Satellite Surveillance | JARVIS</title>
        </Helmet>
        
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/interface">
              <Button variant="ghost" size="sm" className="mr-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Satellite className="h-5 w-5 mr-2 text-jarvis" />
              Satellite Surveillance
            </h1>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <SatelliteSurveillance />
        </div>
      </div>
    </div>
  );
};

export default SatelliteSurveillancePage;
