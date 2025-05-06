"use client"

import { useState } from "react"
import type { DetectedObject } from "@/components/map-detection/mapbox-component"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MapPin, Clock, BarChart3, X, CheckCircle, Camera, ThermometerSun } from "lucide-react"

type ObjectDetailsPanelProps = {
  object: DetectedObject | null
  onClose: () => void
  onMarkResolved?: (id: string) => void
}

export default function ObjectDetailsPanel({ object, onClose, onMarkResolved }: ObjectDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("details")

  if (!object) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-amber-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pothole":
        return <AlertTriangle className="h-4 w-4" />
      case "crack":
        return <AlertTriangle className="h-4 w-4" />
      case "debris":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-md animate-in slide-in-from-right">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(object.type)}
              <span className="capitalize">{object.type}</span>
              {/* <Badge className={getSeverityColor(object.severity)}>{object.severity} severity</Badge> */}
            </CardTitle>
            <CardDescription>Detected at {formatDate(object.timestamp)}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="space-y-4">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <p className="font-medium">{(object.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Size</p>
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <p className="font-medium">{object.size?.toFixed(1)} m</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Detected By</p>
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" />
                  <p className="font-medium">{object.metadata?.detectedBy || "Unknown"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Road Type</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium capitalize">{object.metadata?.roadType || "Unknown"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Weather Conditions</p>
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-primary" />
                  <p className="font-medium capitalize">{object.metadata?.weather || "Unknown"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="location">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    {object.location.lat.toFixed(6)}, {object.location.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="h-48 w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Location preview</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nearest Address</p>
                <p>Pakistan</p>
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="history">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">First detected</p>
                    <p className="text-xs text-muted-foreground">{formatDate(object.timestamp)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Severity assessed</p>
                    <p className="text-xs text-muted-foreground">{formatDate(object.timestamp + 60000)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Added to map</p>
                    <p className="text-xs text-muted-foreground">{formatDate(object.timestamp + 120000)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button variant="outline">Report Inaccuracy</Button>
        <Button variant="default" className="gap-2" onClick={() => onMarkResolved?.(object.id)}>
          <CheckCircle className="h-4 w-4" />
          Mark as Resolved
        </Button>
      </CardFooter>
    </Card>
  )
}