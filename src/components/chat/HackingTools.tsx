
import React, { useState, useEffect } from 'react';
import { Shield, Wifi, Database, Terminal, Bug, Server, Key } from 'lucide-react';

interface HackingToolProps {
  name: string;
  icon: React.ReactNode;
  status?: 'idle' | 'scanning' | 'complete' | 'failed';
  progress?: number;
  result?: string;
}

const HackingTool: React.FC<HackingToolProps> = ({ 
  name, 
  icon, 
  status = 'idle',
  progress = 0,
  result
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentProgress, setCurrentProgress] = useState(progress);
  
  useEffect(() => {
    setCurrentStatus(status);
    setCurrentProgress(progress);
  }, [status, progress]);

  return (
    <div className="bg-black/60 border border-green-500/30 rounded-md p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="text-green-500 mr-2">{icon}</div>
          <span className="text-green-500 font-mono text-sm">{name}</span>
        </div>
        <span className={`font-mono text-xs ${
          currentStatus === 'scanning' ? 'text-yellow-500' :
          currentStatus === 'complete' ? 'text-green-500' :
          currentStatus === 'failed' ? 'text-red-500' :
          'text-gray-500'
        }`}>
          {currentStatus.toUpperCase()}
        </span>
      </div>
      
      {currentStatus === 'scanning' && (
        <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-300" 
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
      )}
      
      {(currentStatus === 'complete' || currentStatus === 'failed') && result && (
        <div className="font-mono text-xs text-gray-300 bg-black/50 p-2 rounded border border-green-500/20 max-h-20 overflow-y-auto">
          {result}
        </div>
      )}
    </div>
  );
};

interface NetworkScannerProps {
  isActive: boolean;
}

import { scanNetwork, portScan, serviceDetection } from '@/services/securityTools';

const NetworkScanner: React.FC<NetworkScannerProps> = ({ isActive }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | undefined>(undefined);
  const [devices, setDevices] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isActive) {
      setStatus('idle');
      setProgress(0);
      return;
    }
    
    setStatus('scanning');
    
    const performScan = async () => {
      try {
        const scannedDevices = await scanNetwork('192.168.1.0/24');
        for (const device of scannedDevices) {
          const openPorts = await portScan(device.ip, '1-1000');
          device.ports = openPorts;
          if (openPorts.length > 0) {
            const serviceInfo = await serviceDetection(device.ip, openPorts[0]);
            device.services = [serviceInfo]; // Fix: using services (array) instead of service
          }
        }
        setDevices(scannedDevices);
      } catch (error) {
        console.error('Scan failed:', error);
        setStatus('failed');
      }
    };

    performScan();
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
        // Fix: using the devices state variable instead of undefined networkDevices
        setResult(`Found ${devices.length} devices\n` + 
                  devices.map(d => `${d.ip} (${d.type}) - ${d.status}`).join('\n'));
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [isActive, devices]);
  
  return (
    <HackingTool 
      name="NETWORK SCANNER" 
      icon={<Wifi size={18} />} 
      status={status}
      progress={progress}
      result={result}
    />
  );
};

interface VulnerabilityScannerProps {
  isActive: boolean;
}

export const VulnerabilityScanner: React.FC<VulnerabilityScannerProps> = ({ isActive }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!isActive) {
      setStatus('idle');
      setProgress(0);
      return;
    }
    
    setStatus('scanning');
    
    const vulnerabilities = [
      'CVE-2023-1234: OpenSSL buffer overflow - CRITICAL',
      'CVE-2023-5678: WordPress plugin XSS - HIGH',
      'CVE-2022-9012: Outdated jQuery library - MEDIUM',
      'CVE-2023-3456: Unpatched firmware - HIGH'
    ];
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 3;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
        setResult(`Found ${vulnerabilities.length} vulnerabilities\n` + vulnerabilities.join('\n'));
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <HackingTool 
      name="VULNERABILITY SCANNER" 
      icon={<Bug size={18} />} 
      status={status}
      progress={progress}
      result={result}
    />
  );
};

interface PasswordCrackerProps {
  isActive: boolean;
}

export const PasswordCracker: React.FC<PasswordCrackerProps> = ({ isActive }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!isActive) {
      setStatus('idle');
      setProgress(0);
      return;
    }
    
    setStatus('scanning');
    
    let currentProgress = 0;
    let passwordChars = '';
    const targetPassword = 'P@ssw0rd123!';
    
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      // Simulate password cracking one character at a time
      const revealedLength = Math.floor((targetPassword.length * currentProgress) / 100);
      passwordChars = targetPassword.substring(0, revealedLength) + 
                      '*'.repeat(targetPassword.length - revealedLength);
      
      setResult(`Attempting dictionary attack...\nBrute force in progress...\nCurrent attempt: ${passwordChars}`);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
        setResult(`Password cracked: ${targetPassword}\nHash: 5f4dcc3b5aa765d61d8327deb882cf99\nComplexity: Medium`);
      }
    }, 250);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <HackingTool 
      name="PASSWORD CRACKER" 
      icon={<Key size={18} />} 
      status={status}
      progress={progress}
      result={result}
    />
  );
};

interface DatabaseBreacherProps {
  isActive: boolean;
}

export const DatabaseBreacher: React.FC<DatabaseBreacherProps> = ({ isActive }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!isActive) {
      setStatus('idle');
      setProgress(0);
      return;
    }
    
    setStatus('scanning');
    
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 4;
      setProgress(currentProgress);
      
      const sqlCommands = [
        'SELECT * FROM users WHERE 1=1',
        'UNION SELECT username, password FROM credentials',
        'INSERT INTO access_log (ip, timestamp, status) VALUES ("127.0.0.1", NOW(), "BREACH")',
        'DROP TABLE access_attempts'
      ];
      
      const currentCommandIndex = Math.min(
        Math.floor((sqlCommands.length * currentProgress) / 100),
        sqlCommands.length - 1
      );
      
      setResult(`Executing SQL injection...\n> ${sqlCommands.slice(0, currentCommandIndex + 1).join('\n> ')}`);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
        setResult(`Database breach successful\nAccess granted to tables: users, credentials, access_log\nDownloading data...`);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <HackingTool 
      name="DATABASE BREACHER" 
      icon={<Database size={18} />} 
      status={status}
      progress={progress}
      result={result}
    />
  );
};

interface FirewallBypassProps {
  isActive: boolean;
}

export const FirewallBypass: React.FC<FirewallBypassProps> = ({ isActive }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!isActive) {
      setStatus('idle');
      setProgress(0);
      return;
    }
    
    setStatus('scanning');
    
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      setResult(`Analyzing firewall rules...\nDetecting open ports...\nTesting packet fragmentation bypass...\nAttempting TCP/IP stack fingerprinting...`);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
        setResult(`Firewall bypass successful\nExploited CVE-2023-7890\nEstablished covert channel on port 4444\nBackdoor installed`);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <HackingTool 
      name="FIREWALL BYPASS" 
      icon={<Shield size={18} />} 
      status={status}
      progress={progress}
      result={result}
    />
  );
};

interface ReverseShellProps {
  isActive: boolean;
}

export const ReverseShell: React.FC<ReverseShellProps> = ({ isActive }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!isActive) {
      setStatus('idle');
      setProgress(0);
      return;
    }
    
    setStatus('scanning');
    
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      const commands = [
        '> Establishing connection...',
        '> Connection established',
        '> Spawning shell...',
        '> Shell spawned',
        '# whoami',
        'root',
        '# uname -a',
        'Linux target-server 5.15.0-76-generic #83-Ubuntu SMP',
        '# id',
        'uid=0(root) gid=0(root) groups=0(root)'
      ];
      
      const visibleCommands = Math.min(
        Math.floor((commands.length * currentProgress) / 100) + 1,
        commands.length
      );
      
      setResult(commands.slice(0, visibleCommands).join('\n'));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('complete');
      }
    }, 250);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <HackingTool 
      name="REVERSE SHELL" 
      icon={<Terminal size={18} />} 
      status={status}
      progress={progress}
      result={result}
    />
  );
};

interface HackingToolsProps {
  active: boolean;
}

const HackingTools: React.FC<HackingToolsProps> = ({ active }) => {
  return (
    <div className={`mt-4 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NetworkScanner isActive={active} />
        <VulnerabilityScanner isActive={active} />
        <PasswordCracker isActive={active} />
        <DatabaseBreacher isActive={active} />
        <FirewallBypass isActive={active} />
        <ReverseShell isActive={active} />
      </div>
    </div>
  );
};

export default HackingTools;
