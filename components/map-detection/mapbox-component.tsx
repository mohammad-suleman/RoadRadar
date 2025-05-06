"use client"

import { useRef, useState, useEffect } from "react"
import mapboxgl, { Marker } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, AlertTriangle, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"
import useTests from "@/hooks/useTests"

// Validate Mapbox token during build time
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

if (!mapboxToken) {
  console.error(`
    Missing Mapbox token! Please configure:
    1. Create .env.local file in project root
    2. Add: NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
    3. Restart development server
  `)
}

try {
  mapboxgl.accessToken = mapboxToken || ""
} catch (error) {
  console.error("Error initializing Mapbox:", error)
}

export type DetectedObject = {
  id: string
  type: "pothole" | "crack" | "debris" | "other"
  location: {
    lat: number
    lng: number
  }
  timestamp: number
  confidence: number
  size?: number
  metadata?: Record<string, any>
}

type MapboxComponentProps = {
  detectedObjects: DetectedObject[]
  onObjectClick?: (object: DetectedObject) => void
  center?: [number, number]
  zoom?: number
  points?: Array<any>;
  height?: string
  className?: string
  isLoading?: boolean
  onRefresh?: () => void
  onError?: () => void
}

export default function MapboxComponent({
  detectedObjects = [],
  onObjectClick,
  center = [34.0151, 71.5805],
  zoom = 5,
  height = "600px",
  className,
  points,
  isLoading = false,
  onRefresh,
  onError,
}: MapboxComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const [activeFilters, setActiveFilters] = useState({
    types: { pothole: true, crack: true, debris: true, other: true }
  })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  if (points?.length !== 0 && mapLoaded && map.current !== null) {
    points?.map((point: any) => {
      new mapboxgl.Marker({ color: "#ff0000" })
        .setLngLat([point.Longitude, point.Latitude])
        .addTo(map.current as any);
    })
  }


  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    if (!mapboxToken) {
      setMapError(`
        Mapbox token not configured! 
        Please check your .env.local file and restart the server
      `)
      onError?.()
      return
    }

    try {

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: (points && points?.length > 0) ? [points[0].Longitude, points[0].Latitude] : center,
        zoom,
      })

      map.current.on("load", () => setMapLoaded(true))

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapError(e.error?.message || "Failed to load map")
        onError?.()
      })

      return () => {
        map.current?.remove()
        map.current = null
      }
    } catch (error) {
      console.error("Map initialization failed:", error)
      setMapError("Failed to initialize map. Check your token and network connection.")
      onError?.()
    }
  }, [center, zoom, onError])

  // Update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Cleanup old markers
    Object.keys(markersRef.current).forEach(id => {
      if (!detectedObjects.some(obj => obj.id === id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

    // Add/update markers
    detectedObjects.forEach(obj => {
      if (!activeFilters.types[obj.type]) {
        if (markersRef.current[obj.id]) {
          markersRef.current[obj.id].remove()
          delete markersRef.current[obj.id]
        }
        return
      }

      if (!markersRef.current[obj.id]) {
        const el = document.createElement("div")
        el.className = "marker"
        el.innerHTML = `
          <div class="flex h-8 w-8 items-center justify-center rounded-full 
            bg-blue-500 text-white shadow-lg 
            cursor-pointer transition-transform hover:scale-110">
            ${getTypeIcon(obj.type)}
          </div>
        `

        el.addEventListener("click", () => onObjectClick?.(obj))
        markersRef.current[obj.id] = new mapboxgl.Marker(el)
          .setLngLat([obj.location.lng, obj.location.lat])
          .addTo(map.current!)
      } else {
        markersRef.current[obj.id].setLngLat([obj.location.lng, obj.location.lat])
      }
    })
  }, [detectedObjects, mapLoaded, activeFilters, onObjectClick])

  const toggleTypeFilter = (type: keyof typeof activeFilters.types) => {
    setActiveFilters(prev => ({
      ...prev,
      types: { ...prev.types, [type]: !prev.types[type] }
    }))
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      pothole: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93 19.07 19.07"/></svg>',
      crack: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 22 1-1h3l9-9 3 3-9 9v3l-1 1zM19 7 5 21"/></svg>',
      debris: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18l-3 10H6L3 6zM6 16h12M16 16v4M8 16v4"/></svg>',
      other: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    }
    return icons[type as keyof typeof icons] || icons.other
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden border", className)}>
      <div ref={mapContainer} className="w-full" style={{ height }} />

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="max-w-md p-6 bg-background rounded-lg shadow-lg border text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Map Error</h3>
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{mapError}</p>
            <Button variant="outline" onClick={() => {
              setMapError(null)
              onRefresh?.()
            }}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm font-medium">Initializing Map...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RotateCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium mb-1">Issue Type</p>
              <div className="flex flex-wrap gap-1">
                {Object.keys(activeFilters.types).map(type => (
                  <Badge
                    key={type}
                    variant={activeFilters.types[type as keyof typeof activeFilters.types] ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleTypeFilter(type as keyof typeof activeFilters.types)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{detectedObjects.length} issues detected</span>
          </div>
        </div>
      </div>


      {/* points. */}



      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-md text-sm">
        <div className="grid grid-cols-1 gap-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>New Detection</span>
          </div>
        </div>
      </div>
    </div>
  )
}