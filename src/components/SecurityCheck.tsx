
import React, { useState } from 'react';
import { analyzePasswordStrength, checkSSLSecurity } from '@/services/securityTools';

export const SecurityCheck = () => {
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any>(null);

  const checkPassword = () => {
    const strength = analyzePasswordStrength(password);
    setResults(strength);
  };

  const checkDomain = async () => {
    const security = await checkSSLSecurity(domain);
    setResults(security);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Check password strength"
          className="p-2 border rounded"
        />
        <button onClick={checkPassword}>Check Password</button>
      </div>
      
      <div>
        <input 
          type="text" 
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Check domain security"
          className="p-2 border rounded"
        />
        <button onClick={checkDomain}>Check Domain</button>
      </div>

      {results && (
        <pre className="bg-black/20 p-4 rounded">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
};
