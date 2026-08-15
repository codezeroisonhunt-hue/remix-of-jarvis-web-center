
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1019] to-[#121624] text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mb-8 flex justify-center">
          <AlertTriangle className="h-24 w-24 text-[#33c3f0]" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gradient-primary">System Error 404</h1>
        
        <div className="glass-morphism p-6 rounded-lg mb-8">
          <p className="text-lg mb-4">Location not found in JARVIS database.</p>
          <div className="text-sm text-[#8a8a9b] font-mono">
            <p>Error Code: J-404-LOCATION-INVALID</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </div>
        
        <Link to="/">
          <Button className="px-6 py-2 bg-gradient-to-r from-[#1eaedb] to-[#33c3f0] hover:from-[#33c3f0] hover:to-[#1eaedb] border-none rounded text-white shadow-neon">
            <Home className="mr-2 h-4 w-4" />
            Return to Base
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
