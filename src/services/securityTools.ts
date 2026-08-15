import { toast } from '@/components/ui/sonner';

interface NetworkDevice {
  ip: string;
  mac?: string;
  name?: string;
  type: 'router' | 'computer' | 'smartphone' | 'iot' | 'unknown';
  status: 'online' | 'offline' | 'vulnerable';
  ports?: number[];
  services?: any[];
  os?: string;
}

interface ServiceInfo {
  port: number;
  name: string;
  version?: string;
  status: 'open' | 'filtered' | 'closed';
  vulnerable?: boolean;
}

// Export all functions individually and also as a securityTools object
// Simulate network scanning function
export const scanNetwork = async (range: string): Promise<NetworkDevice[]> => {
  // Simulate network scan delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Generate random number of devices between 3-8
  const deviceCount = Math.floor(Math.random() * 6) + 3;
  
  // Parse the IP range (e.g., "192.168.1.0/24")
  const baseIp = range.split('/')[0].split('.').slice(0, 3).join('.');
  
  // Generate random devices
  const devices: NetworkDevice[] = [];
  
  for (let i = 1; i <= deviceCount; i++) {
    const deviceTypes: NetworkDevice['type'][] = ['router', 'computer', 'smartphone', 'iot', 'unknown'];
    const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    devices.push({
      ip: `${baseIp}.${Math.floor(Math.random() * 254) + 1}`,
      mac: generateRandomMAC(),
      type,
      status: Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'offline' : 'vulnerable',
      os: generateOperatingSystem(type)
    });
  }
  
  return devices;
};

// Port scanning function
export const portScan = async (ip: string, portRange: string): Promise<number[]> => {
  // Simulate port scan delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
  
  // Parse port range (e.g., "1-1000")
  const [startPort, endPort] = portRange.split('-').map(Number);
  
  // Generate random number of open ports
  const openPortCount = Math.floor(Math.random() * 5) + 1;
  const openPorts: number[] = [];
  
  // Common ports to include
  const commonPorts = [21, 22, 23, 25, 53, 80, 443, 445, 3306, 3389, 8080];
  
  // Add some common ports
  for (let i = 0; i < Math.min(2, openPortCount); i++) {
    const randomCommonPort = commonPorts[Math.floor(Math.random() * commonPorts.length)];
    if (!openPorts.includes(randomCommonPort)) {
      openPorts.push(randomCommonPort);
    }
  }
  
  // Fill remaining with random ports
  while (openPorts.length < openPortCount) {
    const randomPort = Math.floor(Math.random() * (endPort - startPort + 1)) + startPort;
    if (!openPorts.includes(randomPort)) {
      openPorts.push(randomPort);
    }
  }
  
  return openPorts.sort((a, b) => a - b);
};

// Service detection function
export const serviceDetection = async (ip: string, port: number): Promise<ServiceInfo> => {
  // Simulate service detection delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // Service name based on common port numbers
  let serviceName = 'unknown';
  let version = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
  
  switch (port) {
    case 21: serviceName = 'FTP'; break;
    case 22: serviceName = 'SSH'; break;
    case 23: serviceName = 'Telnet'; break;
    case 25: serviceName = 'SMTP'; break;
    case 53: serviceName = 'DNS'; break;
    case 80: serviceName = 'HTTP'; break;
    case 443: serviceName = 'HTTPS'; break;
    case 445: serviceName = 'SMB'; break;
    case 1433: serviceName = 'MSSQL'; break;
    case 3306: serviceName = 'MySQL'; break;
    case 3389: serviceName = 'RDP'; break;
    case 8080: serviceName = 'HTTP-ALT'; break;
    default: serviceName = `service-${port}`;
  }
  
  return {
    port,
    name: serviceName,
    version,
    status: 'open',
    vulnerable: Math.random() > 0.7 // 30% chance of being vulnerable
  };
};

// Vulnerability scan function
export const vulnerabilityScan = async (ip: string, ports: number[]): Promise<any[]> => {
  // Simulate vulnerability scan delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
  
  const vulnerabilityCount = Math.floor(Math.random() * 3) + 1;
  const vulnerabilities = [];
  
  const cveList = [
    'CVE-2023-1234',
    'CVE-2023-5678',
    'CVE-2022-9012',
    'CVE-2023-3456',
    'CVE-2021-9876',
    'CVE-2022-4321',
    'CVE-2023-8765'
  ];
  
  const vulnerabilityTypes = [
    'Buffer Overflow',
    'SQL Injection',
    'Cross-site Scripting',
    'Command Injection',
    'Path Traversal',
    'Authentication Bypass',
    'Remote Code Execution'
  ];
  
  const severityLevels = ['Critical', 'High', 'Medium', 'Low'];
  
  for (let i = 0; i < vulnerabilityCount; i++) {
    const port = ports[Math.floor(Math.random() * ports.length)];
    vulnerabilities.push({
      cve: cveList[Math.floor(Math.random() * cveList.length)],
      type: vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)],
      port,
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      description: `Vulnerability found in service on port ${port}`
    });
  }
  
  return vulnerabilities;
};

// Add the missing functions that are used in SecurityCheck.tsx
export const analyzePasswordStrength = (password: string) => {
  // Basic password strength check
  let strength = 0;
  const feedback = [];
  
  if (password.length < 8) {
    feedback.push('Password is too short');
  } else {
    strength += 1;
  }
  
  if (password.match(/[A-Z]/)) {
    strength += 1;
  } else {
    feedback.push('Add uppercase letters');
  }
  
  if (password.match(/[a-z]/)) {
    strength += 1;
  } else {
    feedback.push('Add lowercase letters');
  }
  
  if (password.match(/[0-9]/)) {
    strength += 1;
  } else {
    feedback.push('Add numbers');
  }
  
  if (password.match(/[^A-Za-z0-9]/)) {
    strength += 1;
  } else {
    feedback.push('Add special characters');
  }
  
  let rating = 'weak';
  if (strength >= 4) {
    rating = 'strong';
  } else if (strength >= 3) {
    rating = 'medium';
  }
  
  return {
    score: strength,
    rating,
    feedback
  };
};

export const checkSSLSecurity = async (domain: string) => {
  // Simulate SSL security check
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const isSecure = Math.random() > 0.3;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 365));
  
  const protocols = ['TLS 1.2', 'TLS 1.3'];
  const ciphers = ['ECDHE-RSA-AES256-GCM-SHA384', 'ECDHE-RSA-AES128-GCM-SHA256'];
  
  // Sometimes add weak protocols
  if (Math.random() > 0.7) {
    protocols.push('TLS 1.0');
    ciphers.push('RC4-SHA');
  }
  
  return {
    domain,
    isSecure,
    certificateValid: isSecure,
    certificateExpiry: expiryDate.toISOString(),
    protocols,
    ciphers,
    vulnerabilities: isSecure ? [] : [
      { name: 'POODLE', severity: 'high' },
      { name: 'ROBOT', severity: 'medium' }
    ]
  };
};

export const analyzeDNSSecurity = async (domain: string) => {
  // Simulate DNS security analysis
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    domain,
    hasDNSSEC: Math.random() > 0.5,
    hasCAA: Math.random() > 0.6,
    records: {
      A: [`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`],
      MX: [`mail.${domain}`, `alt-mail.${domain}`],
      TXT: Math.random() > 0.5 ? [`v=spf1 include:_spf.${domain} ~all`] : []
    },
    security_score: Math.floor(Math.random() * 100)
  };
};

// Helper function to generate a random MAC address
function generateRandomMAC(): string {
  const hexDigits = '0123456789ABCDEF';
  let mac = '';
  
  for (let i = 0; i < 6; i++) {
    let segment = '';
    for (let j = 0; j < 2; j++) {
      segment += hexDigits.charAt(Math.floor(Math.random() * 16));
    }
    mac += segment;
    if (i < 5) mac += ':';
  }
  
  return mac;
}

// Helper function to generate a plausible OS based on device type
function generateOperatingSystem(deviceType: string): string {
  switch (deviceType) {
    case 'router':
      const routerOS = ['Cisco IOS', 'DD-WRT', 'OpenWrt', 'ASUSWRT', 'Tomato'];
      return routerOS[Math.floor(Math.random() * routerOS.length)];
    case 'computer':
      const computerOS = ['Windows 10', 'Windows 11', 'macOS', 'Ubuntu Linux', 'Debian Linux', 'Fedora Linux'];
      return computerOS[Math.floor(Math.random() * computerOS.length)];
    case 'smartphone':
      const mobileOS = ['Android 13', 'Android 14', 'iOS 16', 'iOS 17'];
      return mobileOS[Math.floor(Math.random() * mobileOS.length)];
    case 'iot':
      const iotOS = ['Embedded Linux', 'RTOS', 'Custom Firmware', 'Proprietary OS'];
      return iotOS[Math.floor(Math.random() * iotOS.length)];
    default:
      return 'Unknown OS';
  }
}

// Export all functions as a single object for compatibility with existing code
export const securityTools = {
  scanNetwork,
  portScan,
  serviceDetection,
  vulnerabilityScan,
  analyzePasswordStrength,
  checkSSLSecurity,
  analyzeDNSSecurity
};
