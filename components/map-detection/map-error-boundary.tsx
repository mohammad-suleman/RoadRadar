"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onReset?: () => void
}

interface MapErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Map error caught by error boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Check if it's a token-related error
      const isTokenError = this.state.error?.message?.includes("access token")

      return (
        <div className="p-6 bg-muted/30 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{isTokenError ? "Mapbox Token Error" : "Map Loading Error"}</h3>
          <p className="text-muted-foreground mb-4">
            {isTokenError
              ? "There was an issue with the Mapbox access token. Please check your environment variables."
              : this.state.error?.message || "An error occurred while loading the map."}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">
              Using fallback display mode. You can still see detected objects in the list view.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                this.props.onReset?.()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

