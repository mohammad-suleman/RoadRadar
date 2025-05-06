"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle, BarChart3, Download, RefreshCw, MapPin, Camera, Play, Pause } from "lucide-react"
import MapboxComponent, { type DetectedObject } from "@/components/map-detection/mapbox-component"
import ObjectDetailsPanel from "@/components/map-detection/object-details-panel"
import { generateInitialDetections, createDetectionStream } from "@/services/detection-service"
import FallbackMap from "@/components/map-detection/fallback-map"
import { MapErrorBoundary } from "@/components/map-detection/map-error-boundary"
import useTests from "@/hooks/useTests"

export default function DetectionDashboardPage() {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [detectionRate, setDetectionRate] = useState(2000)
  const [mapCenter, setMapCenter] = useState<[number, number]>([71.5249, 34.0151])
  const [stats, setStats] = useState({
    totalDetections: 0,
    potholesCount: 0,
    cracksCount: 0,
    debrisCount: 0,
    otherCount: 0,
  })
  const [mapAvailable, setMapAvailable] = useState(true)
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking")
  const { tests } = useTests();
  const [selectedTest, setSelectedTest] = useState<any>(undefined);


  useEffect(() => {
    setIsLoading(true)
    const initialObjects = generateInitialDetections(15)
    setDetectedObjects(initialObjects)
    updateStats(initialObjects)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN.startsWith("pk.")) {
        setTokenStatus("valid")
      } else {
        setTokenStatus("invalid")
      }
    } else {
      setTokenStatus("invalid")
    }
  }, [])

  const updateStats = useCallback((objects: DetectedObject[]) => {
    const newStats = {
      totalDetections: objects.length,
      potholesCount: objects.filter((obj) => obj.type === "pothole").length,
      cracksCount: objects.filter((obj) => obj.type === "crack").length,
      debrisCount: objects.filter((obj) => obj.type === "debris").length,
      otherCount: objects.filter((obj) => obj.type === "other").length,
    }
    setStats(newStats)
  }, [])

  useEffect(() => {
    if (!isStreaming) return

    const cleanup = createDetectionStream((newDetection) => {
      setDetectedObjects((prev) => {
        const updated = [...prev, newDetection]
        updateStats(updated)
        return updated
      })
    }, detectionRate)

    return cleanup
  }, [isStreaming, detectionRate, updateStats])

  const handleObjectClick = (object: DetectedObject) => {
    setSelectedObject(object)
  }

  const handleMarkResolved = (id: string) => {
    setDetectedObjects((prev) => {
      const updated = prev.filter((obj) => obj.id !== id)
      updateStats(updated)
      return updated
    })
    setSelectedObject(null)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      const initialObjects = generateInitialDetections(15)
      setDetectedObjects(initialObjects)
      updateStats(initialObjects)
      setIsLoading(false)
    }, 1000)
  }

  const toggleStreaming = () => {
    setIsStreaming((prev) => !prev)
  }

  const handleMapError = () => {
    setMapAvailable(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Detection Dashboard</h1>
          <p className="text-muted-foreground">Monitor road issues as they're detected in real-time</p>
          {tokenStatus === "valid" && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check-circle"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Mapbox token configured successfully
            </p>
          )}
          {tokenStatus === "invalid" && (
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-alert-triangle"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              Mapbox token not configured properly
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={isStreaming ? "default" : "outline"} size="sm" onClick={toggleStreaming} className="gap-2">
            {isStreaming ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Stream
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-2 border-muted transition-all hover:border-primary/20">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="flex items-center">
                    Live Road Issue Detection
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                      Live
                    </Badge>
                  </CardTitle>
                  <CardDescription>View real-time detection of road issues on the map.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`}
                    ></span>
                    {isStreaming ? "Streaming" : "Paused"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MapErrorBoundary
                fallback={<FallbackMap detectedObjects={detectedObjects} onObjectClick={handleObjectClick} />}
                onReset={handleRefresh}
              >
                <MapboxComponent
                  detectedObjects={detectedObjects}
                  onObjectClick={handleObjectClick}
                  center={mapCenter}
                  isLoading={isLoading}
                  zoom={9}
                  points={selectedTest}
                  onRefresh={handleRefresh}
                  onError={() => setMapAvailable(false)}
                />
              </MapErrorBoundary>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedObject ? (
            <ObjectDetailsPanel
              object={selectedObject}
              onClose={() => setSelectedObject(null)}
              onMarkResolved={handleMarkResolved}
            />
          ) :(
            <Card>
  <CardHeader>
    <CardTitle>Detection Settings</CardTitle>
    <CardDescription>Select a test to visualize its data on the map.</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {tests.length === 0 ? (
      <p className="text-sm text-muted-foreground">No test data available.</p>
    ) : (
      <div className="space-y-2">
        {tests.map((test, index) => (
          <Button
            key={index}
            variant={selectedTest === test ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setSelectedTest(test)}
          >
            {test.name || `Test #${index + 1}`} {/* Display the test name */}
          </Button>
        ))}
      </div>
    )}
  </CardContent>
</Card>



          )}
        </div>
      </div>
    </div>
  )
}