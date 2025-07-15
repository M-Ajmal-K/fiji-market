import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MapPin, Users, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to FijiMarket</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Fiji's premier local marketplace. Buy and sell with your neighbors safely and easily.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="#browse">Browse Items</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Local Focus</h3>
              <p className="opacity-80">Connect with buyers and sellers in your area across Fiji</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="opacity-80">Built by Fijians, for Fijians. Support your local community</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="opacity-80">Verified users and secure transactions for peace of mind</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
