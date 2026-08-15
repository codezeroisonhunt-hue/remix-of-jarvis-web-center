import { toast } from '@/components/ui/use-toast';
import { sendCommand } from './firebaseService';
import { supabase } from '@/integrations/supabase/client';

// Biometrics types
export interface BiometricData {
  heartRate: number;
  stressLevel: number;
  status: 'normal' | 'elevated' | 'high' | 'critical';
  timestamp: string;
  device: string;
  recommendations?: string[];
}

export interface BiometricHistory {
  data: BiometricData[];
  averageHeartRate: number;
  averageStressLevel: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface SleepData {
  quality: number; // 0-100
  duration: number; // hours
  deepSleepPercentage: number;
  remSleepPercentage: number;
  disturbances: number;
  timestamp: string;
}

// Supported biometric devices
export const supportedDevices = [
  { name: 'Apple Watch', id: 'apple_watch', connected: false },
  { name: 'Fitbit', id: 'fitbit', connected: false },
  { name: 'Oura Ring', id: 'oura', connected: false },
  { name: 'Whoop', id: 'whoop', connected: false },
  { name: 'Samsung Galaxy Watch', id: 'samsung_watch', connected: false },
  { name: 'Garmin', id: 'garmin', connected: false }
];

// For real-time monitoring between devices/browsers
let biometricsChannel: any = null;
let activeMonitorCallbacks: ((data: BiometricData) => void)[] = [];
let connectionsCount = 0;

// Connect to Supabase Realtime for biometrics
const initRealtimeConnection = () => {
  if (biometricsChannel) return biometricsChannel;
  
  biometricsChannel = supabase.channel('biometrics_channel', {
    config: {
      broadcast: { self: true },
      presence: { key: 'monitoring_user' },
    }
  });

  biometricsChannel
    .on('broadcast', { event: 'biometric_update' }, (payload) => {
      console.log('Received biometric update:', payload);
      if (payload.payload && payload.payload.data) {
        const biometricData = payload.payload.data as BiometricData;
        
        // Notify all active callbacks
        activeMonitorCallbacks.forEach(callback => callback(biometricData));
        
        // Show toast for critical or high stress levels
        if (biometricData.status === 'critical' || biometricData.status === 'high') {
          toast({
            title: `${biometricData.status === 'critical' ? 'Critical' : 'High'} Stress Detected`,
            description: `Current stress level: ${biometricData.stressLevel}. Heart rate: ${biometricData.heartRate} BPM.`,
            variant: biometricData.status === 'critical' ? "destructive" : "default"
          });
        }
      }
    })
    .on('presence', { event: 'sync' }, () => {
      const state = biometricsChannel.presenceState();
      console.log('Current monitoring users:', state);
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      console.log('User joined monitoring:', newPresences);
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      console.log('User left monitoring:', leftPresences);
    })
    .subscribe();
  
  return biometricsChannel;
};

// Simulate connecting to a device - now with real-time updates
export const connectDevice = async (deviceId: string): Promise<boolean> => {
  // Initialize realtime connection
  initRealtimeConnection();
  
  // Simulate connection delay
  await delay(1500);
  
  const deviceIndex = supportedDevices.findIndex(d => d.id === deviceId);
  if (deviceIndex === -1) return false;
  
  // Update connected state
  supportedDevices[deviceIndex].connected = true;
  
  // Simulate device connection
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    toast({
      title: "Device Connected",
      description: `Successfully connected to ${supportedDevices[deviceIndex].name}`,
    });
    
    // Update presence state with device info
    if (biometricsChannel) {
      await biometricsChannel.track({
        device: supportedDevices[deviceIndex].name,
        connected_at: new Date().toISOString(),
        user_id: 'user_' + Math.random().toString(36).substring(2, 9),
      });
    }
    
    // Log to Firebase
    await sendCommand({
      action: 'biometric_device_connected',
      device: supportedDevices[deviceIndex].name,
      timestamp: new Date().toISOString()
    }).catch(err => console.error('Error logging to Firebase:', err));
  } else {
    toast({
      title: "Connection Failed",
      description: `Failed to connect to ${supportedDevices[deviceIndex].name}. Please try again.`,
      variant: "destructive"
    });
    
    // Reset connected state
    supportedDevices[deviceIndex].connected = false;
  }
  
  return success;
};

// Disconnect a device
export const disconnectDevice = async (deviceId: string): Promise<boolean> => {
  await delay(500);
  
  const deviceIndex = supportedDevices.findIndex(d => d.id === deviceId);
  if (deviceIndex === -1) return false;
  
  // Update connected state
  supportedDevices[deviceIndex].connected = false;
  
  toast({
    title: "Device Disconnected",
    description: `Disconnected from ${supportedDevices[deviceIndex].name}`,
  });
  
  return true;
};

// Get a list of connected devices
export const getConnectedDevices = (): string[] => {
  return supportedDevices
    .filter(device => device.connected)
    .map(device => device.id);
};

// Get current biometric data - now with real sharing between clients
export const getCurrentBiometrics = async (): Promise<BiometricData | null> => {
  const connectedDevices = getConnectedDevices();
  if (connectedDevices.length === 0) {
    // No devices connected
    return null;
  }
  
  // Simulate delay for data retrieval
  await delay(1000);
  
  // Select a random connected device
  const deviceId = connectedDevices[Math.floor(Math.random() * connectedDevices.length)];
  const device = supportedDevices.find(d => d.id === deviceId)?.name || 'Unknown Device';
  
  // Generate realistic heart rate between 60-100 bpm
  const heartRate = Math.floor(Math.random() * 40) + 60;
  
  // Generate stress level between 1-100
  const stressLevel = Math.floor(Math.random() * 100) + 1;
  
  // Determine status based on heart rate and stress level
  let status: 'normal' | 'elevated' | 'high' | 'critical';
  let recommendations: string[] = [];
  
  if (heartRate < 70 && stressLevel < 30) {
    status = 'normal';
    recommendations = [
      "Maintaining healthy status. Continue current activities.",
      "Hydrate regularly throughout the day."
    ];
  } else if (heartRate < 85 && stressLevel < 60) {
    status = 'normal';
    recommendations = [
      "Heart rate and stress levels normal.",
      "Consider a short break if working continuously."
    ];
  } else if (heartRate < 90 && stressLevel < 75) {
    status = 'elevated';
    recommendations = [
      "Slightly elevated stress detected.",
      "Consider taking a 5-minute mindfulness break.",
      "Hydrate and practice deep breathing."
    ];
  } else if (heartRate < 100 && stressLevel < 85) {
    status = 'high';
    recommendations = [
      "High stress levels detected.",
      "Take a break from current activities.",
      "Practice deep breathing exercises.",
      "Consider a short walk if possible."
    ];
  } else {
    status = 'critical';
    recommendations = [
      "Critical stress levels detected.",
      "Immediate break recommended.",
      "Engage in calming activities.",
      "Consider progressive muscle relaxation techniques.",
      "If symptoms persist, consult a healthcare professional."
    ];
  }
  
  const biometricData: BiometricData = {
    heartRate,
    stressLevel,
    status,
    timestamp: new Date().toISOString(),
    device,
    recommendations
  };
  
  // Broadcast biometric data to all connected clients
  if (biometricsChannel) {
    try {
      await biometricsChannel.send({
        type: 'broadcast',
        event: 'biometric_update',
        payload: { data: biometricData }
      });
    } catch (error) {
      console.error('Error broadcasting biometric data:', error);
    }
  }
  
  // Log to Firebase if stress is high or critical
  if (status === 'high' || status === 'critical') {
    await sendCommand({
      action: 'biometric_alert',
      level: status,
      heartRate,
      stressLevel,
      timestamp: new Date().toISOString()
    }).catch(err => console.error('Error logging to Firebase:', err));
  }
  
  return biometricData;
};

// Get biometric history (7 days)
export const getBiometricHistory = async (days: number = 7): Promise<BiometricHistory> => {
  const connectedDevices = getConnectedDevices();
  if (connectedDevices.length === 0) {
    // Return empty history if no devices connected
    return {
      data: [],
      averageHeartRate: 0,
      averageStressLevel: 0,
      trend: 'stable'
    };
  }
  
  // Simulate delay for data retrieval
  await delay(1500);
  
  // Select a random connected device
  const deviceId = connectedDevices[Math.floor(Math.random() * connectedDevices.length)];
  const device = supportedDevices.find(d => d.id === deviceId)?.name || 'Unknown Device';
  
  // Generate historical data
  const historicalData: BiometricData[] = [];
  let totalHeartRate = 0;
  let totalStressLevel = 0;
  
  // Base values that will drift over time to create realistic patterns
  let baseHeartRate = Math.floor(Math.random() * 10) + 65; // 65-75 base heart rate
  let baseStressLevel = Math.floor(Math.random() * 20) + 20; // 20-40 base stress level
  
  // Create data points for each day (multiple points per day)
  for (let i = days - 1; i >= 0; i--) {
    // For each day, create 3 data points (morning, afternoon, evening)
    for (let j = 0; j < 3; j++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(8 + (j * 6)); // 8am, 2pm, 8pm
      
      // Add some realistic variation to the base values
      const timeVariation = j === 0 ? -5 : (j === 1 ? 10 : 0); // Lower in morning, higher in afternoon
      const dayVariation = Math.sin(i / 2) * 5; // Sinusoidal pattern over days
      const randomVariation = Math.floor(Math.random() * 10) - 5; // Random -5 to +5
      
      const heartRate = Math.max(55, Math.min(105, baseHeartRate + timeVariation + dayVariation + randomVariation));
      const stressLevel = Math.max(10, Math.min(95, baseStressLevel + timeVariation + dayVariation + randomVariation));
      
      // Determine status
      let status: 'normal' | 'elevated' | 'high' | 'critical';
      
      if (heartRate < 70 && stressLevel < 30) {
        status = 'normal';
      } else if (heartRate < 85 && stressLevel < 60) {
        status = 'normal';
      } else if (heartRate < 90 && stressLevel < 75) {
        status = 'elevated';
      } else if (heartRate < 100 && stressLevel < 85) {
        status = 'high';
      } else {
        status = 'critical';
      }
      
      // Add data point
      historicalData.push({
        heartRate: Math.round(heartRate),
        stressLevel: Math.round(stressLevel),
        status,
        timestamp: date.toISOString(),
        device
      });
      
      totalHeartRate += heartRate;
      totalStressLevel += stressLevel;
    }
  }
  
  // Calculate averages
  const dataPoints = historicalData.length;
  const averageHeartRate = totalHeartRate / dataPoints;
  const averageStressLevel = totalStressLevel / dataPoints;
  
  // Calculate trend by comparing first third to last third
  const firstThird = historicalData.slice(0, Math.floor(dataPoints / 3));
  const lastThird = historicalData.slice(Math.floor(dataPoints * 2 / 3));
  
  const firstThirdAvgStress = firstThird.reduce((acc, curr) => acc + curr.stressLevel, 0) / firstThird.length;
  const lastThirdAvgStress = lastThird.reduce((acc, curr) => acc + curr.stressLevel, 0) / lastThird.length;
  
  let trend: 'improving' | 'stable' | 'worsening';
  
  if (lastThirdAvgStress < firstThirdAvgStress - 5) {
    trend = 'improving';
  } else if (lastThirdAvgStress > firstThirdAvgStress + 5) {
    trend = 'worsening';
  } else {
    trend = 'stable';
  }
  
  return {
    data: historicalData,
    averageHeartRate: Math.round(averageHeartRate),
    averageStressLevel: Math.round(averageStressLevel),
    trend
  };
};

// Get sleep quality data
export const getSleepData = async (days: number = 7): Promise<SleepData[]> => {
  const connectedDevices = getConnectedDevices();
  if (connectedDevices.length === 0) {
    // Return empty data if no devices connected
    return [];
  }
  
  // Simulate delay for data retrieval
  await delay(1500);
  
  // Generate sleep data for the requested number of days
  const sleepData: SleepData[] = [];
  
  // Base values for realistic sleep patterns
  let baseSleepQuality = Math.floor(Math.random() * 15) + 75; // 75-90 base quality
  let baseSleepDuration = Math.floor(Math.random() * 2) + 6.5; // 6.5-8.5 base hours
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(7, 0, 0, 0); // 7am (represents wake-up time data)
    
    // Add some realistic variation
    const weekendEffect = (date.getDay() === 0 || date.getDay() === 6) ? 1 : 0; // Better sleep on weekends
    const randomVariation = Math.random() * 15 - 7.5; // Random -7.5 to +7.5
    const trendEffect = Math.sin(i / 3) * 5; // Sinusoidal pattern
    
    const quality = Math.max(50, Math.min(98, baseSleepQuality + weekendEffect * 5 + randomVariation + trendEffect));
    const duration = Math.max(4, Math.min(10, baseSleepDuration + weekendEffect * 0.5 + (Math.random() * 1 - 0.5) + (trendEffect / 10)));
    
    // Sleep stages percentages
    const deepSleepPercentage = Math.floor(Math.random() * 10) + 15; // 15-25%
    const remSleepPercentage = Math.floor(Math.random() * 10) + 20; // 20-30%
    
    // Disturbances - more when quality is lower
    const disturbances = Math.max(0, Math.min(10, Math.floor((100 - quality) / 10)));
    
    sleepData.push({
      quality: Math.round(quality),
      duration: Number(duration.toFixed(1)),
      deepSleepPercentage,
      remSleepPercentage,
      disturbances,
      timestamp: date.toISOString()
    });
  }
  
  return sleepData;
};

// Monitor stress levels in real time - enhanced with Supabase Realtime
export const monitorStressLevels = (callback: (data: BiometricData) => void): () => void => {
  // Check for connected devices
  if (getConnectedDevices().length === 0) {
    toast({
      title: "No Devices Connected",
      description: "Please connect a biometric device to monitor stress levels.",
      variant: "destructive"
    });
    // Return empty function as no monitoring is started
    return () => {};
  }
  
  // Initialize realtime connection if not already initialized
  initRealtimeConnection();
  connectionsCount++;
  
  // Add callback to active callbacks
  activeMonitorCallbacks.push(callback);
  
  // Set up interval to simulate real-time monitoring
  const intervalId = setInterval(async () => {
    const data = await getCurrentBiometrics();
    if (data) {
      // Callback is handled by the broadcast listener now
    }
  }, 30000); // Update every 30 seconds
  
  // Return function to stop monitoring
  return () => {
    clearInterval(intervalId);
    
    // Remove callback from active callbacks
    activeMonitorCallbacks = activeMonitorCallbacks.filter(cb => cb !== callback);
    
    connectionsCount--;
    if (connectionsCount === 0 && biometricsChannel) {
      // No more active monitors, remove channel
      supabase.removeChannel(biometricsChannel);
      biometricsChannel = null;
    }
  };
};

// Generate stress level recommendations
export const getStressRecommendations = async (stressLevel: number): Promise<string[]> => {
  await delay(500);
  
  if (stressLevel < 30) {
    return [
      "Stress levels are within normal range.",
      "Continue with regular mindfulness practices.",
      "Stay hydrated and maintain regular sleep schedule."
    ];
  } else if (stressLevel < 60) {
    return [
      "Mild stress detected. Consider a short break.",
      "Try a 2-minute deep breathing exercise.",
      "Stretch and move around for a few minutes.",
      "Stay hydrated - drink a glass of water."
    ];
  } else if (stressLevel < 80) {
    return [
      "Moderate stress detected. A break is recommended.",
      "Practice 5 minutes of deep breathing or meditation.",
      "Step outside for fresh air if possible.",
      "Perform progressive muscle relaxation.",
      "Consider a brief change of environment or activity."
    ];
  } else {
    return [
      "High stress levels detected. Immediate break recommended.",
      "Practice extended deep breathing or meditation (10+ minutes).",
      "Physical activity can help reduce stress hormones.",
      "Consider postponing non-essential tasks if possible.",
      "Reach out to someone for support or conversation.",
      "If stress persists, consult with a healthcare professional."
    ];
  }
};

// Helper function to simulate delay
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
