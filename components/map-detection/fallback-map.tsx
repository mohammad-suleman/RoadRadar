"use client"

import { useState } from "react"
import type { DetectedObject } from "@/components/map-detection/mapbox-component"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

type FallbackMapProps = {
  detectedObjects: DetectedObject[]
  onObjectClick?: (object: DetectedObject) => void
  className?: string
}

export default function FallbackMap({ detectedObjects = [], onObjectClick, className }: FallbackMapProps) {
  const [activeFilters, setActiveFilters] = useState<{
    types: Record<string, boolean>
  }>({
    types: { pothole: true, crack: true, debris: true, other: true },
  })

  // Toggle filter for object type
  const toggleTypeFilter = (type: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type],
      },
    }))
  }

  // Filter objects based on active filters
  const filteredObjects = detectedObjects.filter(
    (obj) => activeFilters.types[obj.type]
  )

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className={cn("relative border rounded-lg overflow-hidden", className)}>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div>
            <h3 className="font-medium text-amber-800">Map Unavailable</h3>
            <p className="text-sm text-amber-700">
              Using list view mode. You can still view and interact with all detected objects.
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Detected Road Issues</h3>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant={activeFilters.types.pothole ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTypeFilter("pothole")}
          >
            Pothole
          </Badge>
          <Badge
            variant={activeFilters.types.crack ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTypeFilter("crack")}
          >
            Crack
          </Badge>
          <Badge
            variant={activeFilters.types.debris ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTypeFilter("debris")}
          >
            Debris
          </Badge>
          <Badge
            variant={activeFilters.types.other ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTypeFilter("other")}
          >
            Other
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredObjects.length > 0 ? (
            filteredObjects.map((obj) => (
              <Card
                key={obj.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onObjectClick?.(obj)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize">{obj.type}</p>
                        <Badge variant="outline" className="text-xs">
                          {(obj.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">
                          {obj.location.lat.toFixed(4)}, {obj.location.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1 shrink-0" />
                        <span>Detected at {formatTime(obj.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No issues match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}