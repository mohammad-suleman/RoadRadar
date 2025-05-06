"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function FirebaseDebug() {
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkFirebaseConfig = () => {
    try {
      setError(null)

      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      // Check if any config values are missing
      const missingKeys = Object.entries(config)
        .filter(([_, value]) => !value)
        .map(([key]) => key)

      if (missingKeys.length > 0) {
        setError(`Missing Firebase configuration: ${missingKeys.join(", ")}`)
        return
      }

      // Mask sensitive values for display
      const maskedConfig = {
        apiKey: config.apiKey ? `${config.apiKey.substring(0, 5)}...` : "missing",
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket ? "configured" : "missing",
        messagingSenderId: config.messagingSenderId ? "configured" : "missing",
        appId: config.appId ? `${config.appId.substring(0, 5)}...` : "missing",
      }

      setDebugInfo(JSON.stringify(maskedConfig, null, 2))
    } catch (err: any) {
      setError(err.message || "An error occurred while checking Firebase configuration")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Firebase Configuration Debug</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={checkFirebaseConfig} className="w-full mb-4">
          Check Firebase Configuration
        </Button>

        {debugInfo && (
          <div className="p-4 bg-muted rounded-md">
            <pre className="text-xs overflow-auto whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Common issues:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unauthorized domain - Add your domain to Firebase Console</li>
            <li>Missing configuration - Check all environment variables</li>
            <li>Popup blocked - Allow popups in your browser</li>
            <li>CORS issues - Check Firebase security rules</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

