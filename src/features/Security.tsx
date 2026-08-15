
import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
}

interface SecurityProps {
  securitySettings?: SecuritySetting[];
  securityScore?: number;
  passwordStrength?: 'weak' | 'medium' | 'strong';
  lastLoginDate?: Date;
  onToggleSetting?: (id: string) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onExportData?: () => void;
}

export const Security: React.FC<SecurityProps> = ({ 
  securitySettings = [],
  securityScore = 0,
  passwordStrength = 'medium',
  lastLoginDate,
  onToggleSetting,
  onChangePassword,
  onExportData
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = () => {
    if (onChangePassword && currentPassword && newPassword) {
      onChangePassword(currentPassword, newPassword);
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Shield className="mr-2 h-4 w-4" /> Security
        </CardTitle>
        <CardDescription>Manage user privacy and data protection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/40 rounded-lg p-3 border border-jarvis/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-white">Security Score</h3>
            <div className={`
              ${securityScore >= 80 ? 'text-green-400' : 
                securityScore >= 50 ? 'text-yellow-400' : 
                'text-red-400'} font-medium
            `}>
              {securityScore}%
            </div>
          </div>
          <div className="w-full bg-black/50 rounded-full h-2">
            <div 
              className={`h-full rounded-full ${
                securityScore >= 80 ? 'bg-green-500' : 
                securityScore >= 50 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${securityScore}%` }}
            ></div>
          </div>
          {lastLoginDate && (
            <p className="text-xs text-gray-400 mt-2">
              Last login: {lastLoginDate.toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">Security Settings</h3>
          </div>
          
          {securitySettings.map(setting => (
            <div 
              key={setting.id}
              className={`bg-black/40 border ${
                setting.critical ? 'border-red-500/30' : 'border-jarvis/20'
              } rounded-md p-2 flex justify-between items-center`}
            >
              <div>
                <div className="flex items-center">
                  <h4 className="text-white text-sm flex items-center">
                    {setting.name}
                    {setting.critical && (
                      <Badge className="ml-2 bg-red-500/20 text-red-400 text-xs border border-red-500/30">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </h4>
                </div>
                <p className="text-gray-400 text-xs">{setting.description}</p>
              </div>
              {onToggleSetting && (
                <Switch 
                  checked={setting.enabled}
                  onCheckedChange={() => onToggleSetting(setting.id)}
                  className="data-[state=checked]:bg-jarvis"
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Password Management */}
        <div className="bg-black/40 border border-jarvis/20 rounded-md p-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-medium text-white flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                Password Security
              </h3>
              <div className="flex items-center mt-1">
                <div className={`h-2 w-2 rounded-full ${getPasswordStrengthColor()} mr-1`}></div>
                <p className="text-xs text-gray-400">
                  Strength: <span className="capitalize">{passwordStrength}</span>
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-jarvis border-jarvis/30"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          
          {showPasswordForm && (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="bg-black/30 border-jarvis/20 text-white pr-10"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="bg-black/30 border-jarvis/20 text-white pr-10"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button 
                onClick={handleChangePassword} 
                disabled={!currentPassword || !newPassword}
                className="w-full bg-jarvis hover:bg-jarvis/90"
              >
                Update Password
              </Button>
            </div>
          )}
        </div>
        
        {/* Data Privacy */}
        <div className="bg-black/40 border border-jarvis/20 rounded-md p-3">
          <h3 className="text-sm font-medium text-white mb-2">Data Privacy</h3>
          <p className="text-xs text-gray-400 mb-3">
            Your data is stored securely and not shared with third parties without your consent.
          </p>
          {onExportData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExportData}
              className="w-full text-jarvis border-jarvis/30"
            >
              Export Your Data
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
