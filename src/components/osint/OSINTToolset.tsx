
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { 
  Search, 
  Globe, 
  Mail, 
  AtSign, 
  User, 
  Phone, 
  Server, 
  Database, 
  Network, 
  Shield, 
  FileText, 
  Terminal, 
  LoaderCircle 
} from 'lucide-react';
import { osintLookup } from '@/services/threatDetectionService';

interface OSINTToolsetProps {
  className?: string;
}

const OSINTToolset: React.FC<OSINTToolsetProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('domain');
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setInputValue('');
    setResults(null);
  };
  
  // Get placeholder text based on active tab
  const getPlaceholder = (): string => {
    switch (activeTab) {
      case 'domain':
        return 'Enter domain name (e.g., example.com)';
      case 'email':
        return 'Enter email address';
      case 'ip':
        return 'Enter IP address';
      case 'username':
        return 'Enter username to search';
      case 'phone':
        return 'Enter phone number (e.g., +1234567890)';
      case 'whois':
        return 'Enter domain for WHOIS lookup';
      case 'dns':
        return 'Enter domain for DNS records';
      case 'header':
        return 'Enter URL for header analysis';
      case 'breach':
        return 'Enter email to check for breaches';
      case 'subdomain':
        return 'Enter domain to find subdomains';
      default:
        return 'Enter search term';
    }
  };
  
  // Get input label based on active tab
  const getInputLabel = (): string => {
    switch (activeTab) {
      case 'domain':
        return 'Domain Name';
      case 'email':
        return 'Email Address';
      case 'ip':
        return 'IP Address';
      case 'username':
        return 'Username';
      case 'phone':
        return 'Phone Number';
      case 'whois':
        return 'Domain for WHOIS';
      case 'dns':
        return 'Domain for DNS';
      case 'header':
        return 'URL for Headers';
      case 'breach':
        return 'Email for Breach Check';
      case 'subdomain':
        return 'Domain for Subdomain Finder';
      default:
        return 'Search Input';
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!inputValue.trim()) {
      toast('Input Required', { 
        description: 'Please enter a search term to continue.'
      });
      return;
    }
    
    // Validate input based on type
    if (!validateInput(inputValue, activeTab)) {
      return;
    }
    
    // Process the request
    setIsProcessing(true);
    
    try {
      // Map the tab type to the OSINT lookup type
      const lookupType = mapTabToLookupType(activeTab);
      const result = await osintLookup(inputValue, lookupType);
      
      setResults(result);
      
      // Log action
      console.log(`OSINT Tool: ${activeTab} lookup for ${inputValue}`, {
        timestamp: new Date().toISOString(),
        tool: activeTab,
        query: inputValue,
        success: result.success
      });
      
      // Show completion toast
      toast('Lookup Complete', { 
        description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} lookup for ${inputValue} completed.`
      });
    } catch (error) {
      console.error(`Error in ${activeTab} lookup:`, error);
      
      toast('Lookup Failed', { 
        description: `There was an error processing your request. Please try again.`
      });
      
      setResults({ 
        success: false, 
        error: 'Failed to process request. Please try again later.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Input validation based on active tab
  const validateInput = (input: string, tab: string): boolean => {
    switch (tab) {
      case 'email':
        if (!input.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          toast('Invalid Email', { 
            description: 'Please enter a valid email address.'
          });
          return false;
        }
        break;
        
      case 'domain':
      case 'whois':
      case 'dns':
      case 'subdomain':
        if (!input.match(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i)) {
          toast('Invalid Domain', { 
            description: 'Please enter a valid domain name (e.g., example.com).'
          });
          return false;
        }
        break;
        
      case 'ip':
        if (!input.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) && 
            !input.match(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/)) {
          toast('Invalid IP Address', { 
            description: 'Please enter a valid IPv4 or IPv6 address.'
          });
          return false;
        }
        break;
        
      case 'phone':
        if (!input.match(/^\+?[0-9]{10,15}$/)) {
          toast('Invalid Phone Number', { 
            description: 'Please enter a valid phone number (10-15 digits, optionally with + prefix).'
          });
          return false;
        }
        break;
        
      case 'header':
        if (!input.match(/^https?:\/\/.+/i)) {
          toast('Invalid URL', { 
            description: 'Please enter a valid URL starting with http:// or https://.'
          });
          return false;
        }
        break;
    }
    
    return true;
  };
  
  // Map tab to lookup type
  const mapTabToLookupType = (tab: string): 'email' | 'domain' | 'ip' | 'username' | 'phone' => {
    switch (tab) {
      case 'email':
      case 'breach':
        return 'email';
      case 'domain':
      case 'whois':
      case 'dns':
      case 'header':
      case 'subdomain':
        return 'domain';
      case 'ip':
        return 'ip';
      case 'username':
        return 'username';
      case 'phone':
        return 'phone';
      default:
        return 'domain'; // Default case
    }
  };
  
  // Render JSON result in a formatted way
  const renderResult = (result: any) => {
    if (!result) return null;
    
    if (!result.success) {
      return (
        <div className="bg-red-900/30 border border-red-500/30 rounded-md p-4 mt-4">
          <p className="text-red-400">{result.error || 'An unknown error occurred'}</p>
        </div>
      );
    }
    
    return (
      <div className="bg-black/30 border border-gray-700 rounded-md p-4 mt-4 max-h-96 overflow-y-auto font-mono text-sm">
        <pre className="whitespace-pre-wrap text-green-400">
          {JSON.stringify(result.result, null, 2)}
        </pre>
      </div>
    );
  };
  
  return (
    <Card className={`${className} bg-black/40 border border-jarvis/30`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-jarvis">
          <Search className="w-5 h-5" />
          OSINT & Reconnaissance Toolkit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full bg-black/30 border-jarvis/20 overflow-x-auto flex-wrap mb-4">
            <TabsTrigger value="domain" className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>Domain</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="ip" className="flex items-center gap-1">
              <Network className="w-4 h-4" />
              <span>IP Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="username" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Username</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </TabsTrigger>
            <TabsTrigger value="whois" className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              <span>WHOIS</span>
            </TabsTrigger>
            <TabsTrigger value="dns" className="flex items-center gap-1">
              <Server className="w-4 h-4" />
              <span>DNS</span>
            </TabsTrigger>
            <TabsTrigger value="header" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Headers</span>
            </TabsTrigger>
            <TabsTrigger value="breach" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Breach</span>
            </TabsTrigger>
            <TabsTrigger value="subdomain" className="flex items-center gap-1">
              <Terminal className="w-4 h-4" />
              <span>Subdomains</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Content for all tabs - unified form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="osint-input">{getInputLabel()}</Label>
              <div className="flex gap-2">
                <Input
                  id="osint-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={getPlaceholder()}
                  className="bg-black/30 border-gray-700 text-white"
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || !inputValue.trim()}
                  className="bg-jarvis hover:bg-jarvis/80"
                >
                  {isProcessing ? (
                    <>
                      <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Lookup
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Results display */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-8 bg-black/20 border border-gray-800 rounded-md">
                <LoaderCircle className="w-8 h-8 animate-spin text-jarvis mb-2" />
                <p className="text-jarvis">Processing {activeTab} lookup...</p>
              </div>
            )}
            
            {!isProcessing && results && renderResult(results)}
          </form>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 border-t border-gray-800 pt-4">
        <div className="flex justify-between w-full">
          <span>J.A.R.V.I.S. OSINT v2.5</span>
          <span>Results are for informational purposes only</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OSINTToolset;
