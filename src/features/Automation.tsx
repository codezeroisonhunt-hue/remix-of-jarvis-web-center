
import React, { useState } from 'react';
import { Settings, Power, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  triggerType: 'time' | 'event' | 'condition';
  action: string;
}

interface AutomationProps {
  automationRules?: AutomationRule[];
  onToggleRule?: (id: string) => void;
  onAddRule?: () => void;
  onDeleteRule?: (id: string) => void;
}

export const Automation: React.FC<AutomationProps> = ({ 
  automationRules = [],
  onToggleRule,
  onAddRule,
  onDeleteRule
}) => {
  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 h-4 w-4" /> Automation
        </CardTitle>
        <CardDescription>Control smart home devices and web services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-white">Automation Rules</h3>
          {onAddRule && (
            <Button 
              size="sm" 
              onClick={onAddRule}
              className="bg-jarvis hover:bg-jarvis/90"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> New Rule
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {automationRules.length === 0 ? (
            <p className="text-gray-400 text-sm">No automation rules configured yet.</p>
          ) : (
            automationRules.map(rule => (
              <div 
                key={rule.id} 
                className="bg-black/40 border border-jarvis/20 rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className="font-medium text-white">{rule.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 text-xs ${
                        rule.triggerType === 'time' ? 'border-blue-500/30 text-blue-400' : 
                        rule.triggerType === 'event' ? 'border-purple-500/30 text-purple-400' : 
                        'border-green-500/30 text-green-400'
                      }`}
                    >
                      {rule.triggerType}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm">{rule.description}</p>
                  <p className="text-gray-400 text-xs mt-1">Action: {rule.action}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {onToggleRule && (
                    <Switch 
                      checked={rule.active} 
                      onCheckedChange={() => onToggleRule(rule.id)}
                      className="data-[state=checked]:bg-jarvis"
                    />
                  )}
                  {onDeleteRule && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteRule(rule.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
