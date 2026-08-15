
// Replace navigator.bluetooth calls with feature detection
// Replace navigator.getNetworkInformation with alternative approaches
// Remove 'variant' from toast calls

import { toast } from '@/components/ui/sonner';

// Example implementation with proper type guards:
const connectToDevice = async (deviceName: string) => {
  // Check if Bluetooth API is available in the browser
  if ('bluetooth' in navigator) {
    try {
      // Cast navigator to unknown first, then to a type with bluetooth
      const nav = navigator as unknown as { bluetooth: any };
      const device = await nav.bluetooth.requestDevice({
        filters: [{ name: deviceName }]
      });
      return device;
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast("Connection Failed", {
        description: "Could not connect to Bluetooth device."
      });
      return null;
    }
  } else {
    toast("Bluetooth Not Supported", {
      description: "Your browser does not support Bluetooth API."
    });
    return null;
  }
};

// Similarly update other functions that use Bluetooth or network information
