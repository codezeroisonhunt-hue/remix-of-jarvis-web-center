import React, { useState, useEffect, useRef } from 'react';
import { generateAssistantResponse } from '@/services/aiAssistantService';
import { Terminal, Code, Database, Shield, Wifi, Server, Lock, RefreshCw, Camera, Printer, Search, Activity, AlertTriangle, RotateCw, Fingerprint, Eye, Download, Clock, Radar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  scanNetwork, 
  attemptDecrypt, 
  traceIP, 
  getSystemStatus, 
  simulateMatrix, 
  handleKeylogger, 
  performNetworkScan,
  scanPorts,
  simulatePasswordCrack,
  simulateSQLInjection,
  simulateXSS,
  simulateWebcamCheck,
  getHackerModeHelp,
  simulatePhishing,
  simulateRansomware,
  simulateSocialEngineering,
  simulateWirelessAttack,
  simulateDarkwebScan,
  performBinaryAnalysis,
  simulateDoS,
  simulateForensicAnalysis,
  simulateAIPersonaGeneration
} from '@/services/hackerModeService';

// New imports for our enhanced security features
import {
  runNetworkThreatScan,
  scanDarkWebForLeaks,
  getSystemBackups,
  createSystemBackup,
  restoreFromBackup,
  initializeObjectDetection,
  detectObjectsInImage,
  initializeFaceRecognition,
  recognizeFaces,
  encryptAndLogVoiceCommand,
  getEncryptedVoiceLogs,
  SystemBackup,
  DetectedObject,
  RecognizedFace
} from '@/services/securityFeatures';

export interface HackerModeProps {
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
  onDeactivate?: () => void;
}

// Create a type for functions that process canvas data with proper return types
interface CanvasProcessor<T> {
  (imageData: ImageData | HTMLImageElement | HTMLVideoElement): Promise<T>;
}

const HackerMode: React.FC<HackerModeProps> = ({ hackerOutput, setHackerOutput, onDeactivate }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [systemBackups, setSystemBackups] = useState<SystemBackup[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [securityScanActive, setSecurityScanActive] = useState(false);
  const [objectDetectionActive, setObjectDetectionActive] = useState(false);
  const [faceRecognitionActive, setFaceRecognitionActive] = useState(false);
  const [darkWebMonitorActive, setDarkWebMonitorActive] = useState(false);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const appendOutput = (text: string) => {
    setHackerOutput(prev => `${prev}\n${text}`);
  };
  
  // Scroll to the end of output when content changes
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hackerOutput]);

  // Initialize security features on mount
  useEffect(() => {
    // Get existing system backups
    setSystemBackups(getSystemBackups());
    
    // Clear webcam when component unmounts
    return () => {
      if (cameraActive && videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  // Helper function for processing canvas data with proper typing
  const processCanvasWithFunction = async <T,>(processor: CanvasProcessor<T>): Promise<T | null> => {
    if (!canvasRef.current) return null;
    
    try {
      // Get the canvas context and extract image data
      const context = canvasRef.current.getContext('2d');
      if (!context) return null;
      
      // Convert canvas to ImageData which is accepted by our processor functions
      const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Process the image data with the provided function
      return await processor(imageData);
    } catch (error) {
      console.error("Error processing canvas:", error);
      return null;
    }
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    setActiveCommand(command.split(' ')[0].toLowerCase());
    appendOutput(`\n> ${command}`);
    
    try {
      const [cmd, ...args] = command.split(' ');
      const lowerCmd = cmd.toLowerCase();
      
      // Handle deactivation
      if (lowerCmd === 'deactivate') {
        appendOutput('\nDeactivating hacker mode...');
        setTimeout(() => {
          if (onDeactivate) {
            onDeactivate();
          }
        }, 1000);
        setIsProcessing(false);
        return;
      }
      
      // Handle commands with real functionality
      switch(lowerCmd) {
        // Original commands
        case 'scan':
          const scanResult = await scanNetwork();
          appendOutput(`\n${scanResult}`);
          break;
          
        case 'decrypt':
          const target = args[0];
          const decryptResult = await attemptDecrypt(target);
          appendOutput(`\n${decryptResult}`);
          break;
          
        case 'trace':
          const ip = args[0];
          const traceResult = await traceIP(ip);
          appendOutput(`\n${traceResult}`);
          break;
          
        case 'system':
          const sysStatus = await getSystemStatus();
          appendOutput(`\n${sysStatus}`);
          break;
          
        case 'matrix':
          const matrixOutput = await simulateMatrix();
          appendOutput(`\n${matrixOutput}`);
          break;
          
        case 'keylogger':
          const keyloggerOperation = args[0]?.toLowerCase();
          if (keyloggerOperation !== 'start' && keyloggerOperation !== 'stop') {
            appendOutput('\nUsage: keylogger <start|stop>');
          } else {
            const keyloggerResult = await handleKeylogger(keyloggerOperation);
            appendOutput(`\n${keyloggerResult}`);
          }
          break;
          
        case 'netscan':
          const range = args[0];
          if (!range) {
            appendOutput('\nUsage: netscan <ip-range>\nExample: netscan 192.168.1.0/24');
          } else {
            const scanResult = await performNetworkScan(range);
            appendOutput(`\n${scanResult}`);
          }
          break;
        
        case 'ports':
          const portTarget = args[0];
          const portsResult = await scanPorts(portTarget);
          appendOutput(`\n${portsResult}`);
          break;
          
        case 'crack':
          const hash = args[0];
          const crackResult = await simulatePasswordCrack(hash);
          appendOutput(`\n${crackResult}`);
          break;
          
        case 'sqli':
          const sqliTarget = args[0];
          const sqliResult = await simulateSQLInjection(sqliTarget);
          appendOutput(`\n${sqliResult}`);
          break;
          
        case 'xss':
          const xssTarget = args[0];
          const xssResult = await simulateXSS(xssTarget);
          appendOutput(`\n${xssResult}`);
          break;
          
        case 'webcam':
          const webcamResult = await simulateWebcamCheck();
          appendOutput(`\n${webcamResult}`);
          break;
        
        // Previous enhancement commands
        case 'phish':
          const phishTarget = args[0];
          const phishResult = await simulatePhishing(phishTarget);
          appendOutput(`\n${phishResult}`);
          break;
          
        case 'ransomware':
          const ranTarget = args[0];
          const ranResult = await simulateRansomware(ranTarget);
          appendOutput(`\n${ranResult}`);
          break;
          
        case 'social':
          const socialTarget = args[0];
          const socialResult = await simulateSocialEngineering(socialTarget);
          appendOutput(`\n${socialResult}`);
          break;
          
        case 'wifi':
          const ssid = args[0];
          const wifiResult = await simulateWirelessAttack(ssid);
          appendOutput(`\n${wifiResult}`);
          break;
          
        case 'darkweb':
          const query = args.join(' ');
          const darkwebResult = await simulateDarkwebScan(query);
          appendOutput(`\n${darkwebResult}`);
          break;
          
        case 'binary':
          const file = args[0];
          const binaryResult = await performBinaryAnalysis(file);
          appendOutput(`\n${binaryResult}`);
          break;
          
        case 'dos':
          const dosTarget = args[0];
          const dosResult = await simulateDoS(dosTarget);
          appendOutput(`\n${dosResult}`);
          break;
          
        case 'forensic':
          const evidence = args[0];
          const forensicResult = await simulateForensicAnalysis(evidence);
          appendOutput(`\n${forensicResult}`);
          break;
          
        case 'persona':
          const personaTarget = args.join(' ');
          const personaResult = await simulateAIPersonaGeneration(personaTarget);
          appendOutput(`\n${personaResult}`);
          break;
          
        // NEW SECURITY COMMANDS:
        
        // AI Threat Detection
        case 'threatscan':
        case 'malwarescan':
          appendOutput('\nInitiating AI-powered threat detection scan...');
          setSecurityScanActive(true);
          
          try {
            const scanResults = await runNetworkThreatScan();
            appendOutput(`\nScan completed in ${scanResults.scanDuration / 1000} seconds.`);
            
            if (scanResults.threats.length === 0) {
              appendOutput('\n✓ No threats detected. System secure.');
            } else {
              appendOutput(`\n⚠ ${scanResults.threats.length} potential threats detected:`);
              scanResults.threats.forEach((threat, index) => {
                appendOutput(`\n  ${index + 1}. [${threat.severity.toUpperCase()}] ${threat.type}`);
                appendOutput(`     ${threat.details}`);
                appendOutput(`     Detected: ${threat.timestamp.toLocaleTimeString()}`);
              });
              
              appendOutput('\nRecommendations:');
              appendOutput('\n  - Run forensic analysis for more details');
              appendOutput('\n  - Update security modules');
              appendOutput('\n  - Enable emergency mode if threats are critical');
            }
            
          } catch (error) {
            appendOutput('\nError running threat scan: ' + (error as Error).message);
          } finally {
            setSecurityScanActive(false);
          }
          break;
          
        // Face Recognition Access
        case 'faceauth':
        case 'facerecognition':
          const faceAuthOperation = args[0]?.toLowerCase();
          
          if (faceAuthOperation === 'stop') {
            if (faceRecognitionActive) {
              setFaceRecognitionActive(false);
              if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
              }
              appendOutput('\nFace recognition system deactivated.');
            } else {
              appendOutput('\nFace recognition is not currently active.');
            }
            break;
          }
          
          try {
            appendOutput('\nInitializing face recognition system...');
            await initializeFaceRecognition();
            
            appendOutput('\nActivating webcam for facial authentication...');
            
            // Access webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadedmetadata = () => {
                if (videoRef.current) videoRef.current.play();
                setFaceRecognitionActive(true);
                
                appendOutput('\nFace recognition active. Scanning for authorized faces...');
                appendOutput('\nType "faceauth stop" to deactivate.');
                
                // Run face recognition periodically
                const recognitionInterval = setInterval(async () => {
                  if (!faceRecognitionActive || !videoRef.current || !canvasRef.current) {
                    clearInterval(recognitionInterval);
                    return;
                  }
                  
                  try {
                    const context = canvasRef.current.getContext('2d');
                    if (context && videoRef.current) {
                      // Draw video to canvas for analysis
                      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                      
                      // Analyze the image with proper typing
                      const recognizedFaces = await processCanvasWithFunction<RecognizedFace[]>(recognizeFaces);
                      
                      if (recognizedFaces && recognizedFaces.length > 0) {
                        recognizedFaces.forEach(face => {
                          if (face.name) {
                            appendOutput(`\n✓ Face recognized: ${face.name} (${(face.confidence * 100).toFixed(1)}% confidence)`);
                            if (face.authorized) {
                              appendOutput(`   Access authorized for ${face.name}`);
                            } else {
                              appendOutput(`   ⚠ WARNING: User ${face.name} not in authorized list`);
                              
                              // Alert about unauthorized access
                              toast({
                                title: "Security Alert",
                                description: `Unauthorized user detected: ${face.name}`,
                                variant: "destructive"
                              });
                            }
                          } else {
                            appendOutput('\n⚠ Unknown face detected - access denied');
                            
                            // Alert about unknown face
                            toast({
                                title: "Security Alert",
                                description: "Unknown face detected. Access denied.",
                                variant: "destructive"
                            });
                          }
                        });
                      }
                    }
                  } catch (err) {
                    console.error("Face recognition error:", err);
                  }
                }, 5000); // Check every 5 seconds
                
                // Clean up interval on deactivation
                return () => clearInterval(recognitionInterval);
              };
            }
          } catch (error) {
            appendOutput('\nError initializing face recognition: ' + (error as Error).message);
            appendOutput('\nMake sure your browser supports webcam access and you have granted permission.');
            setFaceRecognitionActive(false);
          }
          break;
          
        // Object Detection
        case 'objectscan':
        case 'detectobjects':
          const objectOperation = args[0]?.toLowerCase();
          
          if (objectOperation === 'stop') {
            if (objectDetectionActive) {
              setObjectDetectionActive(false);
              if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
              }
              appendOutput('\nObject detection system deactivated.');
            } else {
              appendOutput('\nObject detection is not currently active.');
            }
            break;
          }
          
          try {
            appendOutput('\nInitializing real-time object detection system...');
            await initializeObjectDetection();
            
            appendOutput('\nActivating webcam for object detection...');
            
            // Access webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadedmetadata = () => {
                if (videoRef.current) videoRef.current.play();
                setObjectDetectionActive(true);
                
                appendOutput('\nObject detection active. Scanning environment...');
                appendOutput('\nType "objectscan stop" to deactivate.');
                
                // Run object detection periodically
                const detectionInterval = setInterval(async () => {
                  if (!objectDetectionActive || !videoRef.current || !canvasRef.current) {
                    clearInterval(detectionInterval);
                    return;
                  }
                  
                  try {
                    const context = canvasRef.current.getContext('2d');
                    if (context && videoRef.current) {
                      // Draw video to canvas for analysis
                      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                      
                      // Detect objects in the image with proper typing
                      const detectedObjects = await processCanvasWithFunction<DetectedObject[]>(detectObjectsInImage);
                      
                      if (detectedObjects && detectedObjects.length > 0) {
                        appendOutput(`\nObjects detected (${new Date().toLocaleTimeString()}):`);
                        detectedObjects.forEach(obj => {
                          appendOutput(`  - ${obj.label} (${(obj.confidence * 100).toFixed(1)}% confidence)`);
                        });
                        
                        // Alert about person detection
                        const personDetection = detectedObjects.find(obj => obj.label === 'person');
                        if (personDetection && personDetection.confidence > 0.85) {
                          appendOutput('\n⚠ Human presence detected with high confidence');
                        }
                      }
                    }
                  } catch (err) {
                    console.error("Object detection error:", err);
                  }
                }, 5000); // Check every 5 seconds
                
                // Clean up interval on deactivation
                return () => clearInterval(detectionInterval);
              };
            }
          } catch (error) {
            appendOutput('\nError initializing object detection: ' + (error as Error).message);
            appendOutput('\nMake sure your browser supports webcam access and you have granted permission.');
            setObjectDetectionActive(false);
          }
          break;
          
        // Dark Web Monitor
        case 'darkmonitor':
        case 'leakcheck':
          const darkwebOperation = args[0]?.toLowerCase();
          
          if (darkwebOperation === 'stop') {
            if (darkWebMonitorActive) {
              setDarkWebMonitorActive(false);
              appendOutput('\nDark web monitoring stopped.');
            } else {
              appendOutput('\nDark web monitoring is not currently active.');
            }
            break;
          }
          
          const email = args.find(arg => arg.includes('@')) || 'tony@starkindustries.com';
          const domain = args.find(arg => arg.includes('.') && !arg.includes('@')) || 'starkindustries.com';
          
          appendOutput(`\nInitiating dark web scan for: ${email} and ${domain}`);
          setDarkWebMonitorActive(true);
          
          try {
            const scanResults = await scanDarkWebForLeaks({
              emails: [email],
              domains: [domain]
            });
            
            appendOutput(`\nDark web scan completed on ${scanResults.scanDate.toLocaleString()}`);
            
            if (scanResults.leaks.length === 0) {
              appendOutput('\n✓ No data leaks detected for the provided identifiers.');
            } else {
              appendOutput(`\n⚠ ${scanResults.leaks.length} potential data leaks detected:`);
              
              scanResults.leaks.forEach((leak, index) => {
                appendOutput(`\n  ${index + 1}. [${leak.type.toUpperCase()}] ${leak.identifier}`);
                appendOutput(`     Source: ${leak.source}`);
                appendOutput(`     Date: ${leak.date.toLocaleDateString()}`);
                appendOutput(`     Details: ${leak.details}`);
              });
              
              appendOutput('\nRecommendations:');
              appendOutput('\n  - Change compromised passwords immediately');
              appendOutput('\n  - Enable two-factor authentication where possible');
              appendOutput('\n  - Monitor accounts for suspicious activity');
              
              // Toast notification for critical leaks
              const criticalLeaks = scanResults.leaks.filter(leak => 
                leak.type === 'password' || 
                leak.type === 'credit_card'
              );
              
              if (criticalLeaks.length > 0) {
                toast({
                  title: "Critical Data Leak Detected",
                  description: `${criticalLeaks.length} critical data leaks found. Immediate action required.`,
                  variant: "destructive"
                });
              }
            }
            
          } catch (error) {
            appendOutput('\nError scanning dark web: ' + (error as Error).message);
          } finally {
            setDarkWebMonitorActive(false);
          }
          break;
          
        // System Backup & Rollback
        case 'backup':
          const backupOperation = args[0]?.toLowerCase();
          
          if (backupOperation === 'list') {
            // List existing backups
            appendOutput('\nSystem Backups:');
            
            if (systemBackups.length === 0) {
              appendOutput('\nNo backups found.');
            } else {
              systemBackups.forEach((backup, index) => {
                appendOutput(`\n  ${index + 1}. ${backup.id}`);
                appendOutput(`     Created: ${backup.timestamp.toLocaleString()}`);
                appendOutput(`     Size: ${backup.size}`);
                appendOutput(`     Type: ${backup.type}`);
                appendOutput(`     Status: ${backup.status}`);
                appendOutput(`     Description: ${backup.description}`);
              });
            }
            break;
          } else if (backupOperation === 'create' || !backupOperation) {
            // Create new backup
            const backupType = args[1]?.toLowerCase() === 'full' ? 'full' : 'incremental';
            const description = args.slice(backupType === 'full' ? 2 : 1).join(' ') || 
                               `Manual ${backupType} backup created on ${new Date().toLocaleString()}`;
            
            appendOutput(`\nCreating ${backupType} system backup...`);
            
            try {
              const newBackup = await createSystemBackup(description, backupType as 'full' | 'incremental');
              setSystemBackups([newBackup, ...systemBackups]);
              
              appendOutput(`\n✓ Backup created successfully: ${newBackup.id}`);
              appendOutput(`  Size: ${newBackup.size}`);
              appendOutput(`  Timestamp: ${newBackup.timestamp.toLocaleString()}`);
            } catch (error) {
              appendOutput('\nError creating backup: ' + (error as Error).message);
            }
            break;
          } else {
            appendOutput('\nUsage: backup [list|create] [full|incremental] [description]');
          }
          break;
          
        case 'rollback':
        case 'restore':
          const backupId = args[0];
          
          if (!backupId) {
            appendOutput('\nUsage: rollback <backup-id>');
            appendOutput('\nUse "backup list" to see available backup IDs.');
            break;
          }
          
          const targetBackup = systemBackups.find(backup => backup.id === backupId);
          
          if (!targetBackup) {
            appendOutput(`\nBackup with ID "${backupId}" not found.`);
            appendOutput('\nUse "backup list" to see available backup IDs.');
            break;
          }
          
          appendOutput(`\nInitiating system rollback to backup: ${backupId}`);
          appendOutput(`  Created: ${targetBackup.timestamp.toLocaleString()}`);
          appendOutput(`  Type: ${targetBackup.type}`);
          appendOutput('\nWARNING: This operation will restore the system to a previous state.');
          appendOutput('\nConfirm rollback? (y/n)');
          
          // Simulate confirmation
          setTimeout(() => {
            appendOutput('\n> y');
            appendOutput('\nRollback confirmed. Restoring system...');
            
            // Execute the rollback
            restoreFromBackup(backupId)
              .then(success => {
                if (success) {
                  appendOutput('\n✓ System successfully restored from backup.');
                  appendOutput('\nAll services restarted.');
                } else {
                  appendOutput('\n✗ Rollback failed. System remains in current state.');
                  appendOutput('\nTry using a different backup point.');
                }
              });
          }, 2000);
          break;
          
        // Emergency Mode
        case 'emergency':
          appendOutput('\n⚠ EMERGENCY MODE ACTIVATION REQUESTED ⚠');
          appendOutput('\nThis will lock down the system and disable all network connections.');
          appendOutput('\nConfirm activation? (y/n)');
          
          // Simulate confirmation
          setTimeout(() => {
            appendOutput('\n> y');
            appendOutput('\nConfirmation received. Activating emergency mode...');
            
            // Execute emergency mode
            if (window.JARVIS && window.JARVIS.security) {
              window.JARVIS.security.setEmergencyMode();
              
              appendOutput('\n\n◉ EMERGENCY MODE ACTIVE ◉');
              appendOutput('\n  - All network connections disabled');
              appendOutput('\n  - All external ports locked down');
              appendOutput('\n  - Security alerts enabled');
              appendOutput('\n  - Biometric authentication required for system access');
              appendOutput('\n  - Emergency contacts notified');
              
              toast({
                title: "EMERGENCY MODE ACTIVE",
                description: "System has been locked down. Network connections disabled.",
                variant: "destructive"
              });
            } else {
              appendOutput('\nError: JARVIS security core not available.');
            }
          }, 2000);
          break;
          
        // Voice Logs
        case 'voicelogs':
          const voiceOperation = args[0]?.toLowerCase();
          
          if (voiceOperation === 'list') {
            const encryptedLogs = getEncryptedVoiceLogs();
            
            appendOutput('\nEncrypted Voice Command Logs:');
            
            if (encryptedLogs.length === 0) {
              appendOutput('\nNo voice logs found.');
            } else {
              encryptedLogs.forEach((log, index) => {
                appendOutput(`\n  ${index + 1}. ID: ${log.id}`);
                appendOutput(`     Time: ${log.timestamp.toLocaleString()}`);
                appendOutput(`     Duration: ${log.duration}s`);
                appendOutput(`     Encrypted Command: ${log.encryptedCommand}`);
                appendOutput(`     Encrypted Response: ${log.encryptedResponse}`);
              });
            }
          } else if (voiceOperation === 'decrypt') {
            const logId = args[1];
            
            if (!logId) {
              appendOutput('\nUsage: voicelogs decrypt <log-id>');
              break;
            }
            
            appendOutput(`\nAttempting to decrypt voice log ID: ${logId}`);
            appendOutput('\nAccess denied: Security clearance required for decryption.');
            appendOutput('\nPlease use biometric verification for enhanced security access.');
          } else {
            appendOutput('\nUsage: voicelogs [list|decrypt <log-id>]');
          }
          break;
          
        // Module Updates
        case 'updates':
        case 'updatesystem':
          const updateOperation = args[0]?.toLowerCase();
          
          if (updateOperation === 'check') {
            appendOutput('\nChecking for system module updates...');
            
            // Simulate update check
            setTimeout(() => {
              const updates = Math.random() > 0.5;
              
              if (updates) {
                appendOutput('\nUpdates available for the following modules:');
                appendOutput('\n  - Security Core (1.5.3 → 1.6.0)');
                appendOutput('\n  - Encryption Module (2.1.7 → 2.2.1)');
                appendOutput('\n  - Threat Database (DB4522 → DB4579)');
                appendOutput('\nUse "updates install" to apply updates.');
              } else {
                appendOutput('\n✓ All system modules are up to date.');
              }
            }, 2000);
          } else if (updateOperation === 'install') {
            appendOutput('\nInstalling system updates...');
            appendOutput('\nThis may take a few minutes. System will remain operational during update.');
            
            // Simulate installation process
            let progress = 0;
            const updateInterval = setInterval(() => {
              progress += 20;
              appendOutput(`\nUpdate progress: ${progress}%`);
              
              if (progress >= 100) {
                clearInterval(updateInterval);
                appendOutput('\n✓ Updates installed successfully.');
                appendOutput('\nNew features available:');
                appendOutput('\n  - Enhanced pattern recognition in threat detection');
                appendOutput('\n  - Improved encryption for voice logs');
                appendOutput('\n  - Additional malware signatures (5,243 new definitions)');
                
                toast({
                  title: "Updates Installed",
                  description: "System modules updated successfully.",
                });
              }
            }, 2000);
          } else {
            appendOutput('\nUsage: updates [check|install]');
          }
          break;
          
        // Help command (modified to include new commands)
        case 'help':
          // Get the original help text
          const helpText = await getHackerModeHelp();
          // Add our new commands to the help output
          const enhancedHelpText = helpText + `

NEW SECURITY COMMANDS:

  threatscan              - Scan system for malware and security threats
  faceauth [stop]         - Enable face recognition security (stop to disable)
  objectscan [stop]       - Real-time object detection using webcam (stop to disable)
  darkmonitor <email>     - Monitor dark web for leaked credentials
  backup [list|create]    - Manage system backups
  rollback <backup-id>    - Restore system to previous backup point
  emergency               - Activate emergency mode (system lockdown)
  voicelogs [list|decrypt]- Access encrypted voice command logs
  updates [check|install] - Check for and install system updates

Use these commands to enhance system security and monitor for threats.
`;
          appendOutput(`\n${enhancedHelpText}`);
          break;
          
        case 'clear':
          setHackerOutput('J.A.R.V.I.S. Hacker Interface v2.0\n> System initialized\n> Type "help" for commands...');
          break;
          
        default:
          // For unrecognized commands, use AI assistant
          const messages = [{ role: 'user' as const, content: command }];
          const response = await generateAssistantResponse(
            command,
            messages,
            'jarvis',
            'en'
          );
          appendOutput(`\n${response}`);
      }
      
      appendOutput('\n> Ready for next command...');
    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "Command Error",
        description: "Failed to process command. Please try again.",
        variant: "destructive"
      });
      appendOutput('\n[ERROR] Command processing failed');
    } finally {
      setIsProcessing(false);
      setActiveCommand(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    await handleCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (!hackerOutput) {
      setHackerOutput('J.A.R.V.I.S. Hacker Interface v2.0\n> System initialized\n> Type "help" for commands...');
    }
  }, [hackerOutput, setHackerOutput]);

  const handleQuickCommand = (command: string) => {
    if (isProcessing) return;
    setInput(command);
    setTimeout(() => {
      handleCommand(command);
    }, 100);
  };

  // New security-focused quick commands
  const securityQuickCommands = [
    'threatscan', 
    'backup list', 
    'darkmonitor', 
    'faceauth', 
    'objectscan', 
    'updates check', 
    'voicelogs list', 
    'help'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-black/95 text-jarvis overflow-hidden">
      <div className="p-4 border-b border-jarvis/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-jarvis" />
          <span className="font-mono text-lg">J.A.R.V.I.S. HACKER INTERFACE</span>
        </div>
        <div className="flex space-x-2 items-center">
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-jarvis' : 'text-jarvis/40'}`} />
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-transparent border-jarvis/30 text-jarvis hover:bg-jarvis/10"
            onClick={() => onDeactivate && onDeactivate()}
          >
            Deactivate
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 bg-black border-r border-jarvis/20 flex flex-col items-center py-4 space-y-6">
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'threatscan' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('threatscan')}
            title="Threat Scan"
          >
            <Shield className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'scan' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('scan')}
            title="Network Scan"
          >
            <Wifi className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'faceauth' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('faceauth')}
            title="Face Auth"
          >
            <Fingerprint className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'objectscan' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('objectscan')}
            title="Object Scan"
          >
            <Camera className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'darkmonitor' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('darkmonitor')}
            title="Dark Web Monitor"
          >
            <Search className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'backup' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('backup list')}
            title="System Backups"
          >
            <RotateCw className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'emergency' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('emergency')}
            title="Emergency Mode"
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            ref={terminalRef}
            className="flex-1 p-4 font-mono text-jarvis overflow-auto terminal-window"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(30, 174, 219, 0.03), rgba(30, 174, 219, 0.03) 1px, transparent 1px, transparent 2px)'
            }}
          >
            <pre className="whitespace-pre-wrap">{hackerOutput}</pre>
            <div ref={outputEndRef} />
            
            {/* Hidden video element for webcam features */}
            {(objectDetectionActive || faceRecognitionActive) && (
              <div className="mt-4 border border-jarvis/30 rounded">
                <video 
                  ref={videoRef} 
                  width="320" 
                  height="240" 
                  className="rounded"
                  style={{ display: 'block' }}
                />
                <canvas 
                  ref={canvasRef} 
                  width="320" 
                  height="240" 
                  style={{ display: 'none' }}
                />
                <div className="text-xs text-jarvis/70 p-2 bg-black/50">
                  {faceRecognitionActive ? 'Face Recognition Active' : 'Object Detection Active'}
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-jarvis/30">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-jarvis" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black/70 border-jarvis/30 text-jarvis font-mono focus-visible:ring-jarvis/30"
                placeholder={isProcessing ? "Processing..." : "Type command..."}
                disabled={isProcessing}
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={isProcessing || !input.trim()} 
                variant="outline" 
                className="bg-black/70 border-jarvis/30 text-jarvis hover:bg-jarvis/10"
              >
                Execute
              </Button>
            </div>
          </form>
        </div>
        
        <div className="w-48 border-l border-jarvis/20 bg-black/70 p-3 hidden md:block">
          <div className="text-xs uppercase text-jarvis/50 mb-2 font-mono">Security Tools</div>
          <div className="space-y-1.5">
            {securityQuickCommands.map((cmd) => (
              <Button
                key={cmd}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
                onClick={() => handleQuickCommand(cmd)}
                disabled={isProcessing}
              >
                {cmd}
              </Button>
            ))}
          </div>
          
          <div className="text-xs uppercase text-jarvis/50 mt-4 mb-2 font-mono">System Status</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-jarvis/60">Security:</span>
              <span className={`${securityScanActive ? 'text-red-500 animate-pulse' : 'text-jarvis'}`}>
                {securityScanActive ? 'Scanning' : 'Active'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-jarvis/60">Face Auth:</span>
              <span className={`${faceRecognitionActive ? 'text-green-400' : 'text-jarvis/50'}`}>
                {faceRecognitionActive ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-jarvis/60">Dark Web:</span>
              <span className={`${darkWebMonitorActive ? 'text-yellow-400 animate-pulse' : 'text-jarvis/50'}`}>
                {darkWebMonitorActive ? 'Scanning' : 'Idle'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-jarvis/60">Last Backup:</span>
              <span className="text-jarvis">
                {systemBackups[0]?.timestamp.toLocaleDateString() || 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerMode;
