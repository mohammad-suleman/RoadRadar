import type { DetectedObject } from "@/components/map-detection/mapbox-component"

// Simulated detection areas (centers for random generation)
const DETECTION_AREAS = [
  { lat: 40.7128, lng: -74.006 }, // New York
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 41.8781, lng: -87.6298 }, // Chicago
  { lat: 29.7604, lng: -95.3698 }, // Houston
  { lat: 39.9526, lng: -75.1652 }, // Philadelphia
]

// Generate a random location near a center point
function generateRandomLocation(center: { lat: number; lng: number }, radius = 0.05) {
  const r = radius * Math.sqrt(Math.random())
  const theta = Math.random() * 2 * Math.PI

  return {
    lat: center.lat + r * Math.cos(theta),
    lng: center.lng + r * Math.sin(theta),
  }
}

// Generate a random detected object
function generateRandomObject(id: string): DetectedObject {
  const types: DetectedObject["type"][] = ["pothole", "crack", "debris", "other"]
  // const severities: DetectedObject["severity"][] = ["low", "medium", "high"]

  const randomArea = DETECTION_AREAS[Math.floor(Math.random() * DETECTION_AREAS.length)]
  const location = generateRandomLocation(randomArea)

  return {
    id,
    type: types[Math.floor(Math.random() * types.length)],
    // severity: severities[Math.floor(Math.random() * severities.length)],
    location,
    timestamp: Date.now(),
    confidence: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
    size: Math.random() * 2, // 0 to 2 meters
    metadata: {
      detectedBy: `Camera-${Math.floor(Math.random() * 10) + 1}`,
      roadType: Math.random() > 0.5 ? "highway" : "local",
      weather: ["clear", "rainy", "cloudy"][Math.floor(Math.random() * 3)],
    },
  }
}

// Simulate initial batch of detections
export function generateInitialDetections(count = 20): DetectedObject[] {
  return Array.from({ length: count }, (_, i) => generateRandomObject(`initial-${i}`))
}

// Simulate real-time detection stream
export function createDetectionStream(
  onNewDetection: (detection: DetectedObject) => void,
  interval = 2000, // 2 seconds between detections
  maxDetections = 100,
) {
  let count = 0

  const intervalId = setInterval(() => {
    if (count >= maxDetections) {
      clearInterval(intervalId)
      return
    }

    const newDetection = generateRandomObject(`realtime-${Date.now()}`)
    onNewDetection(newDetection)
    count++
  }, interval)

  return () => clearInterval(intervalId) // Return cleanup function
}

// Simulate detection of a specific area
export function detectArea(center: { lat: number; lng: number }, radius = 0.01, count = 5): DetectedObject[] {
  return Array.from({ length: count }, (_, i) => {
    const location = generateRandomLocation(center, radius)
    return {
      id: `area-${center.lat}-${center.lng}-${i}`,
      type: Math.random() > 0.5 ? "pothole" : "crack",
      severity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
      location,
      timestamp: Date.now(),
      confidence: 0.5 + Math.random() * 0.5,
      size: Math.random() * 2,
      metadata: {
        detectedBy: "area-scan",
        roadType: Math.random() > 0.5 ? "highway" : "local",
        weather: "clear",
      },
    }
  })
}

// Process a batch of detections (simulate ML processing)
export async function processDetectionBatch(
  images: string[], // This would be image data in a real system
  options?: {
    modelType?: "fast" | "accurate"
    threshold?: number
  },
): Promise<DetectedObject[]> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate random detections based on the number of images
  return Array.from({ length: images.length }, (_, i) => generateRandomObject(`batch-${Date.now()}-${i}`))
}

