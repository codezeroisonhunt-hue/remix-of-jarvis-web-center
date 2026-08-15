
import { toast } from '@/components/ui/sonner';

// Define the shape of a threat
export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  source?: string;
}

// Define the result of threat detection
export interface ThreatDetectionResult {
  status: 'threats_detected' | 'no_threats' | 'error';
  threatCount: number;
  message: string;
  threats?: Threat[]; // Add the threats array to fix the TypeScript error
  alertSent?: boolean;
  timestamp: string;
}

// Simulated threat detection function
export const detectThreats = async (phoneNumber: string): Promise<ThreatDetectionResult> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random determination if threats are found (70% chance)
    const threatsDetected = Math.random() > 0.3;
    
    if (threatsDetected) {
      // Generate random number of threats (1-5)
      const threatCount = Math.floor(Math.random() * 5) + 1;
      
      // Generate threat details
      const threats: Threat[] = [];
      for (let i = 0; i < threatCount; i++) {
        threats.push({
          id: `threat-${Date.now()}-${i}`,
          title: getRandomThreatTitle(),
          description: getRandomThreatDescription(),
          severity: getRandomSeverity(),
          location: getRandomLocation(),
          timestamp: new Date().toISOString(),
          source: getRandomSource()
        });
      }
      
      // Display toast notification
      toast('Security Alert', {
        description: `Detected ${threatCount} potential security ${threatCount === 1 ? 'threat' : 'threats'}. Alert sent to ${phoneNumber}.`,
      });
      
      // Return threat information
      return {
        status: 'threats_detected',
        threatCount,
        message: `${threatCount} security ${threatCount === 1 ? 'threat has' : 'threats have'} been detected and sent to ${phoneNumber}`,
        threats, // Include threats in the result
        alertSent: true,
        timestamp: new Date().toISOString()
      };
    } else {
      // No threats detected
      toast('Security Scan Complete', {
        description: 'No security threats were detected at this time.',
      });
      
      return {
        status: 'no_threats',
        threatCount: 0,
        message: 'No security threats detected',
        threats: [], // Include empty threats array
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error in threat detection:', error);
    
    toast('Threat Detection Error', {
      description: 'Failed to complete security scan. Please try again later.',
    });
    
    return {
      status: 'error',
      threatCount: 0,
      message: 'Error occurred during threat detection',
      threats: [], // Include empty threats array
      timestamp: new Date().toISOString()
    };
  }
};

// Helper functions for generating random threat data
function getRandomThreatTitle(): string {
  const titles = [
    'Unauthorized Access Attempt',
    'Malware Detection',
    'Data Exfiltration',
    'Suspicious Login Activity',
    'Potential Phishing Attack',
    'Ransomware Signature Detected',
    'SQL Injection Attempt',
    'Cross-site Scripting Attack',
    'DDOS Attack Indicators',
    'Privilege Escalation Attempt'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomThreatDescription(): string {
  const descriptions = [
    'Multiple failed login attempts detected from unknown IP address.',
    'Malicious code signature detected in downloaded file.',
    'Unusual data transfer activity to external server.',
    'Login from new location and device not previously associated with this account.',
    'Email containing suspicious links and requesting credentials.',
    'File encryption activities detected across multiple directories.',
    'Malformed SQL queries detected in web application logs.',
    'JavaScript injection detected in user input fields.',
    'Abnormal traffic spike suggesting coordinated attack.',
    'User attempting to access restricted system areas.'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomSeverity(): 'low' | 'medium' | 'high' | 'critical' {
  const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
  return severities[Math.floor(Math.random() * severities.length)];
}

function getRandomLocation(): string {
  const locations = [
    'Network Perimeter',
    'User Endpoint',
    'Email Server',
    'Web Application',
    'Database Server',
    'Authentication System',
    'Cloud Storage',
    'API Gateway',
    'File Server',
    'Internal Network'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomSource(): string {
  const sources = [
    'Firewall Logs',
    'Intrusion Detection System',
    'Antivirus Alert',
    'User Report',
    'SIEM Analysis',
    'Threat Intelligence Feed',
    'Honeypot Trigger',
    'Network Traffic Analysis',
    'Automated Scan',
    'Security Audit'
  ];
  return sources[Math.floor(Math.random() * sources.length)];
}

// Create a generic OSINT tool for various lookups
export const osintLookup = async (
  query: string, 
  type: 'email' | 'domain' | 'ip' | 'username' | 'phone'
): Promise<any> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Log the request (would be sent to Firebase in production)
  console.log(`OSINT lookup - Type: ${type}, Query: ${query}`);
  
  // Show loading notification
  toast(`Running OSINT lookup`, {
    description: `Searching for information on ${query}...`,
  });
  
  try {
    // Generate mock results based on lookup type
    let result = {};
    
    switch(type) {
      case 'email':
        result = mockEmailLookup(query);
        break;
      case 'domain':
        result = mockDomainLookup(query);
        break;
      case 'ip':
        result = mockIpLookup(query);
        break;
      case 'username':
        result = mockUsernameLookup(query);
        break;
      case 'phone':
        result = mockPhoneLookup(query);
        break;
    }
    
    // Success notification
    toast(`OSINT Lookup Complete`, {
      description: `Found information related to ${query}`,
    });
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      query,
      type,
      result
    };
  } catch (error) {
    console.error('OSINT lookup error:', error);
    
    toast(`OSINT Lookup Failed`, {
      description: `Error processing ${type} lookup for ${query}`,
    });
    
    return {
      success: false,
      timestamp: new Date().toISOString(),
      query,
      type,
      error: 'Failed to complete OSINT lookup'
    };
  }
};

// Mock OSINT data generators
function mockEmailLookup(email: string) {
  const domain = email.split('@')[1];
  
  // Generate breached status randomly
  const breached = Math.random() > 0.5;
  const breachData = breached ? [
    {
      site: 'Example Company',
      date: '2022-06-15',
      dataTypes: ['email', 'username', 'password hash']
    },
    {
      site: 'Shopping Platform',
      date: '2021-03-22',
      dataTypes: ['email', 'name', 'phone']
    }
  ] : [];
  
  return {
    emailInfo: {
      address: email,
      domain,
      valid: true,
      mxRecords: [`mx1.${domain}`, `mx2.${domain}`],
      spfRecord: `v=spf1 include:_spf.${domain} ~all`,
      disposable: Math.random() > 0.8
    },
    breachData: {
      breached,
      breachCount: breachData.length,
      lastBreached: breached ? breachData[0].date : null,
      breaches: breachData
    }
  };
}

function mockDomainLookup(domain: string) {
  return {
    registrar: 'Example Registrar, LLC',
    registeredDate: '2015-07-29',
    expiryDate: '2025-07-29',
    nameservers: [
      `ns1.${domain}`,
      `ns2.${domain}`
    ],
    ips: [`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`],
    subdomains: [
      `www.${domain}`,
      `mail.${domain}`,
      `blog.${domain}`,
      `shop.${domain}`,
      `api.${domain}`
    ],
    securityHeaders: {
      'Content-Security-Policy': 'present',
      'X-XSS-Protection': 'present',
      'X-Content-Type-Options': 'present',
      'Strict-Transport-Security': Math.random() > 0.5 ? 'present' : 'missing'
    }
  };
}

function mockIpLookup(ip: string) {
  return {
    ip: ip,
    type: Math.random() > 0.5 ? 'IPv4' : 'IPv6',
    country: 'United States',
    region: 'California',
    city: 'San Francisco',
    isp: 'Example Internet Provider',
    org: 'Example Organization',
    asn: 'AS12345',
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 5,
      lon: -122.4194 + (Math.random() - 0.5) * 5
    },
    timezone: 'America/Los_Angeles',
    openPorts: [
      80,
      443,
      22,
      21
    ].filter(() => Math.random() > 0.3)
  };
}

function mockUsernameLookup(username: string) {
  const platforms = [
    'Twitter', 'Instagram', 'Facebook', 'TikTok', 
    'LinkedIn', 'GitHub', 'YouTube', 'Reddit'
  ];
  
  // Randomly determine which platforms have this username
  const results = platforms.map(platform => ({
    platform,
    exists: Math.random() > 0.4,
    url: `https://${platform.toLowerCase()}.com/${username}`,
    lastActivity: Math.random() > 0.5 ? 
      new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : 
      null
  }));
  
  return {
    username,
    platformsChecked: platforms.length,
    found: results.filter(r => r.exists).length,
    results
  };
}

function mockPhoneLookup(phone: string) {
  return {
    phone,
    valid: true,
    countryCode: '+1',
    localFormat: '(555) 123-4567',
    carrier: 'Example Mobile',
    lineType: Math.random() > 0.5 ? 'mobile' : 'landline',
    location: {
      country: 'United States',
      region: 'New York',
      city: 'New York City'
    },
    timeZone: 'America/New_York'
  };
}
