import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, MapPin, AlertTriangle, Activity } from "lucide-react"


export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-2">
                New Technology
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-slide-up">
                Monitoring Roads for a <span className="text-primary">Safer Journey</span>
              </h1>
              <p
                className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                RoadRadar is an innovative pothole and crack monitoring system that helps identify and report road
                issues in real-time.
              </p>
              <div
                className="flex flex-col gap-2 min-[400px]:flex-row animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <Link href="/login">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-4 pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=32&width=32&text=${i}`}
                        alt={`User ${i}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Trusted by <span className="font-medium text-foreground">2,000+</span> users
                </div>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl -rotate-1 transform-gpu"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7rfVksZrMF6vE78epFIiEt6iuFbOTF.png"
                alt="Modern highway interchange aerial view"
                fill
                className="object-cover rounded-lg rotate-1 transform-gpu shadow-xl"
                priority
              />
              <div className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-lg animate-pulse-slow">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning-yellow" />
                  <span className="text-sm font-medium">Pothole detected!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Animation Section */}
      {/* <ThreeDAnimationSection /> */}

      {/* Features Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted/50 rounded-3xl my-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-slide-up">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Smart Road Monitoring</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our system uses advanced technology to detect and report road issues.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 stagger-children">
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg animate-scale-in">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full"></div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Detection</h3>
              <p className="text-muted-foreground mt-2">
                Our sensors detect potholes and cracks on the road surface with high accuracy.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg animate-scale-in">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full"></div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Mapping</h3>
              <p className="text-muted-foreground mt-2">
                GPS coordinates are sent to our web application for precise mapping and tracking.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg animate-scale-in">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full"></div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Reporting</h3>
              <p className="text-muted-foreground mt-2">
                Data is analyzed and reports are generated for efficient road maintenance.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-24 lg:py-32 border-y border-border/40 my-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col items-center justify-center space-y-2 text-center animate-slide-up">
              <div className="text-4xl font-bold tracking-tighter sm:text-5xl">2,500+</div>
              <div className="text-sm text-muted-foreground">Potholes Detected</div>
            </div>
            <div
              className="flex flex-col items-center justify-center space-y-2 text-center animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-4xl font-bold tracking-tighter sm:text-5xl">15+</div>
              <div className="text-sm text-muted-foreground">Cities Covered</div>
            </div>
            <div
              className="flex flex-col items-center justify-center space-y-2 text-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-4xl font-bold tracking-tighter sm:text-5xl">85%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
            <div
              className="flex flex-col items-center justify-center space-y-2 text-center animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-4xl font-bold tracking-tighter sm:text-5xl">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 lg:py-32 my-12">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1200')] bg-cover bg-center opacity-10"></div>
            <div className="relative grid gap-4 p-6 md:gap-8 md:p-10 lg:grid-cols-2 lg:p-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to make roads safer?
                </h2>
                <p className="text-primary-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our network of road monitoring systems and help improve infrastructure in your community.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-end">
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

