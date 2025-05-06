export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About RoadRadar</h1>
        <div className="space-y-4">
          <p>
            RoadRadar is an innovative online pothole and crack monitoring system designed to improve road safety and
            maintenance efficiency. Our platform uses advanced technology to detect, track, and report road surface
            issues in real-time.
          </p>
          <p>
            Founded in 2023, our mission is to create safer roads for everyone by providing accurate and timely
            information about road conditions to both drivers and maintenance authorities.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Technology</h2>
          <p>
            RoadRadar combines hardware sensors with sophisticated software algorithms to detect road surface anomalies.
            When a pothole or crack is detected, our system captures the GPS coordinates and sends this data to our web
            application.
          </p>
          <p>
            The data is then processed, analyzed, and displayed on an interactive map, allowing users to see road issues
            in their area and plan their routes accordingly. Maintenance authorities can access detailed reports to
            prioritize repairs based on severity and location.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
          <p>
            We envision a future where road maintenance is proactive rather than reactive, where potholes are repaired
            before they cause accidents or vehicle damage, and where drivers can travel with confidence knowing they
            have access to the most up-to-date information about road conditions.
          </p>
          <p>
            By leveraging technology and community engagement, RoadRadar aims to transform the way we think about and
            manage our road infrastructure.
          </p>
        </div>
      </div>
    </div>
  )
}

