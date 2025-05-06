import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Mock nutrition data for demonstration
interface NutritionData {
  name: string;
  calories: number;
  sugars: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: string[];
  additives: string[];
  alternatives: {
    name: string;
    calories: number;
    sugars: number;
    reason: string;
  }[];
  sugarRating: 'high' | 'medium' | 'low';
}

// Mock scan history
interface ScanHistoryItem {
  id: number;
  name: string;
  date: string;
  sugarRating: 'high' | 'medium' | 'low';
}

export default function FoodScanner() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<NutritionData | null>(null);
  const [activeTab, setActiveTab] = useState('camera');
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([
    {
      id: 1,
      name: 'Chocolate Bar',
      date: '2025-05-05',
      sugarRating: 'high'
    },
    {
      id: 2,
      name: 'Greek Yogurt',
      date: '2025-05-04',
      sugarRating: 'medium'
    },
    {
      id: 3,
      name: 'Apple',
      date: '2025-05-03',
      sugarRating: 'low'
    }
  ]);

  const handleStartCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('mediaDevices API not supported in this browser');
      }
      
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // When we have the stream, set it as the video's source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setIsCameraActive(true);
                toast({
                  title: "Camera Access Granted",
                  description: "Position a food item in the frame and tap to scan",
                });
              })
              .catch(e => {
                console.error('Error playing video:', e);
                toast({
                  title: "Camera Failed to Start",
                  description: "There was an error starting the camera stream",
                  variant: "destructive",
                });
              });
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please check your camera permissions and try again.",
        variant: "destructive",
      });
      
      // If it's a permissions issue, guide the user
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast({
          title: "Camera Permission Denied",
          description: "Please enable camera access in your browser settings to use this feature.",
          variant: "destructive",
        });
      } else {
        // Mock the scanning process to show functionality without camera
        setTimeout(() => {
          toast({
            title: "Using Demo Mode",
            description: "Camera access not available - using demo data instead",
          });
          // Trigger mock scan after a delay
          setTimeout(() => mockProcessFoodImage("mock-image-data"), 1000);
        }, 1500);
      }
    }
  };

  const handleStopCamera = () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    // Draw the current video frame on the canvas
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Get the image data as base64 (this would normally be sent to a server for processing)
    const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
    
    // Mock processing the image (in a real app, this would be an API call)
    mockProcessFoodImage(imageDataUrl);
  };

  const mockProcessFoodImage = (imageData: string) => {
    // Simulate API processing delay
    toast({
      title: "Processing...",
      description: "Analyzing food item...",
    });
    
    setTimeout(() => {
      // Mock data - in a real app, this would come from an AI/ML service
      const mockResult: NutritionData = {
        name: "Chocolate Chip Cookie",
        calories: 160,
        sugars: 14,
        carbs: 24,
        protein: 2,
        fat: 7,
        ingredients: [
          "Enriched Flour",
          "Sugar",
          "Chocolate Chips (Sugar, Chocolate, Cocoa Butter)",
          "Vegetable Oil",
          "Eggs",
          "Baking Soda",
          "Salt"
        ],
        additives: [
          "Natural Flavors",
          "Soy Lecithin"
        ],
        alternatives: [
          {
            name: "Almond Flour Cookie",
            calories: 130,
            sugars: 8,
            reason: "Uses natural sweetener with 40% less sugar"
          },
          {
            name: "Oatmeal Energy Bar",
            calories: 120,
            sugars: 6,
            reason: "Sweetened with dates instead of refined sugar"
          }
        ],
        sugarRating: 'high'
      };
      
      setScanResult(mockResult);
      
      // In a real app with proper authentication, we would save to user's history
      const newHistoryItem: ScanHistoryItem = {
        id: Date.now(),
        name: mockResult.name,
        date: new Date().toISOString().split('T')[0],
        sugarRating: mockResult.sugarRating
      };
      
      setScanHistory(prev => [newHistoryItem, ...prev]);
      
      toast({
        title: "Scan Complete",
        description: `Identified: ${mockResult.name}`,
      });
    }, 1500);
  };

  // Clean up function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      handleStopCamera();
    };
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">{t.navigation.foodScanner}</h1>
        <p className="text-gray-400 mt-1">Scan food items to check nutrition and sugar content</p>
      </div>
      
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="camera">{t.foodScanner.camera}</TabsTrigger>
          <TabsTrigger value="history">{t.foodScanner.history}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="space-y-4">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            {!isCameraActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <i className="ri-camera-3-line text-4xl mb-4 text-gray-500"></i>
                <Button onClick={handleStartCamera}>
                  <i className="ri-camera-line mr-2"></i>
                  {t.foodScanner.enableCamera}
                </Button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="rounded-full w-16 h-16 p-0"
                    onClick={handleCapture}
                  >
                    <i className="ri-scan-line text-2xl"></i>
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="bg-card border border-accent rounded-lg p-4">
            <h2 className="font-medium text-lg mb-2">{t.foodScanner.scanningTips}</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5"></i>
                Position the food item or barcode in the center of the frame
              </li>
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5"></i>
                Ensure good lighting for better scan accuracy
              </li>
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5"></i>
                For packaged foods, try scanning the barcode or the nutrition label
              </li>
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-0.5"></i>
                Hold the camera steady while scanning
              </li>
            </ul>
          </div>
          
          {scanResult && (
            <Card className="border border-accent">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{scanResult.name}</h2>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${scanResult.sugarRating === 'high' ? 'bg-red-900/40 text-red-400' :
                      scanResult.sugarRating === 'medium' ? 'bg-yellow-900/40 text-yellow-400' :
                      'bg-green-900/40 text-green-400'}`}
                  >
                    <i className={`ri-drop-line mr-1 
                      ${scanResult.sugarRating === 'high' ? 'text-red-400' :
                        scanResult.sugarRating === 'medium' ? 'text-yellow-400' :
                        'text-green-400'}`}
                    ></i>
                    {scanResult.sugarRating === 'high' ? 'High Sugar' :
                      scanResult.sugarRating === 'medium' ? 'Moderate Sugar' :
                      'Low Sugar'}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-card border border-accent p-2 rounded-lg">
                    <div className="text-lg font-bold">{scanResult.calories}</div>
                    <div className="text-xs text-gray-400">{t.foodScanner.calories}</div>
                  </div>
                  <div className="bg-card border border-accent p-2 rounded-lg">
                    <div className="text-lg font-bold">{scanResult.sugars}g</div>
                    <div className="text-xs text-gray-400">{t.foodScanner.sugars}</div>
                  </div>
                  <div className="bg-card border border-accent p-2 rounded-lg">
                    <div className="text-lg font-bold">{scanResult.carbs}g</div>
                    <div className="text-xs text-gray-400">{t.foodScanner.carbs}</div>
                  </div>
                  <div className="bg-card border border-accent p-2 rounded-lg">
                    <div className="text-lg font-bold">{scanResult.protein}g</div>
                    <div className="text-xs text-gray-400">{t.foodScanner.protein}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">{t.foodScanner.alternatives}</h3>
                  <div className="space-y-2">
                    {scanResult.alternatives.map((alt, i) => (
                      <div key={i} className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{alt.name}</span>
                          <span className="text-green-400 text-sm">{alt.sugars}g sugar</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{alt.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <i className="ri-information-line mr-2"></i>
                      {t.foodScanner.nutritionInfo}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{scanResult.name}: {t.foodScanner.nutritionInfo}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Ingredients</Label>
                        <ul className="mt-2 space-y-1 text-sm">
                          {scanResult.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {scanResult.additives.length > 0 && (
                        <div>
                          <Label>Additives</Label>
                          <ul className="mt-2 space-y-1 text-sm">
                            {scanResult.additives.map((additive, i) => (
                              <li key={i}>{additive}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <Label>Sugar Content Analysis</Label>
                        <div className="mt-2 p-3 rounded-lg bg-muted text-sm space-y-2">
                          <p>
                            This item contains <span className="font-bold">{scanResult.sugars}g</span> of sugar per serving, 
                            which is considered <span className={`font-bold 
                              ${scanResult.sugarRating === 'high' ? 'text-red-400' :
                                scanResult.sugarRating === 'medium' ? 'text-yellow-400' :
                                'text-green-400'}`}
                            >
                              {scanResult.sugarRating}
                            </span> relative to daily recommended intake.
                          </p>
                          {scanResult.sugarRating === 'high' && (
                            <p>Consider this as an occasional treat rather than a regular part of your diet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {scanHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <i className="ri-history-line text-4xl mb-2"></i>
              <p>{t.foodScanner.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scanHistory.map((item) => (
                <Card key={item.id} className="border border-accent">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.date}</p>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${item.sugarRating === 'high' ? 'bg-red-900/40 text-red-400' :
                          item.sugarRating === 'medium' ? 'bg-yellow-900/40 text-yellow-400' :
                          'bg-green-900/40 text-green-400'}`}
                      >
                        <i className={`ri-drop-line mr-1 
                          ${item.sugarRating === 'high' ? 'text-red-400' :
                            item.sugarRating === 'medium' ? 'text-yellow-400' :
                            'text-green-400'}`}
                        ></i>
                        {item.sugarRating === 'high' ? 'High' :
                          item.sugarRating === 'medium' ? 'Medium' :
                          'Low'} Sugar
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="bg-card border border-accent rounded-lg p-4 mt-6">
            <h2 className="font-medium text-lg mb-2">
              <i className="ri-information-line mr-2 text-secondary"></i>
              Understanding Sugar Ratings
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-medium text-green-400 mr-2">Low:</span>
                <span className="text-gray-400">Less than 5g of sugar per 100g</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="font-medium text-yellow-400 mr-2">Medium:</span>
                <span className="text-gray-400">Between 5g-22.5g of sugar per 100g</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="font-medium text-red-400 mr-2">High:</span>
                <span className="text-gray-400">More than 22.5g of sugar per 100g</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}