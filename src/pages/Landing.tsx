import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { BarChart3, DollarSign, TrendingDown, Fuel } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Fuel className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-foreground">
              Track Your Fuel, Save Money
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Monitor fuel consumption, analyze costs, and optimize your driving efficiency with FuelApp.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button size="lg" variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Fuel className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Log Fill-ups</h3>
                  <p className="text-muted-foreground text-sm">
                    Easily record every fuel fill-up with date, volume, cost, and odometer readings
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Track Consumption</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor your fuel efficiency and see consumption trends over time
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Analyze Costs</h3>
                  <p className="text-muted-foreground text-sm">
                    Understand your fuel expenses and identify opportunities to save
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-primary/5 rounded-lg p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to start tracking?</h2>
            <p className="text-muted-foreground mb-6">
              Join FuelApp today and take control of your fuel expenses
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
