import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Leaf, FileText } from 'lucide-react';
import TestimonialSection from '@/components/TestimonialSection';
import { ChatDialog } from '@/components/chat/ChatDialog';

const Index = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-potato-50 py-16 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-potato-200 bg-potato-100/50 px-3 py-1 text-sm font-medium text-potato-700">
                  Advanced Plant Health Technology
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-potato-900">
                  Protect Your Potato Crops with Smart Disease Detection
                </h1>
                <p className="max-w-[600px] text-balance text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Upload images of your potato plants and get instant AI-powered disease detection to keep your crops healthy and maximize yield.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/upload">
                  <Button className="potato-btn-primary group">
                    Start Detection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="outline" className="potato-btn-secondary">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] lg:mx-0 overflow-hidden rounded-2xl shadow-potato">
              <img
                alt="Potato plant with disease detection overlay"
                className="aspect-video object-cover w-full rounded-2xl"
                src="public/Image1.jpg"
                width={500}
                height={500}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-potato-200 bg-potato-100/50 px-3 py-1 text-sm font-medium text-potato-700">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How PotatoScaner Works
              </h2>
              <p className="max-w-[700px] text-balance text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our advanced AI technology helps you identify and manage potato diseases before they spread
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-potato-100">
                <Shield className="h-8 w-8 text-potato-600" />
              </div>
              <h3 className="text-xl font-bold">Early Detection</h3>
              <p className="text-center text-muted-foreground">
                Identify diseases at their earliest stages, before visible symptoms appear, giving you time to take preventive action.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-potato-100">
                <Leaf className="h-8 w-8 text-potato-600" />
              </div>
              <h3 className="text-xl font-bold">Smart Analysis</h3>
              <p className="text-center text-muted-foreground">
                Our AI analyzes potato plant images to identify common diseases like Late Blight, Early Blight, and other pathogens.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-potato-100">
                <FileText className="h-8 w-8 text-potato-600" />
              </div>
              <h3 className="text-xl font-bold">Treatment Guidance</h3>
              <p className="text-center text-muted-foreground">
                Receive personalized recommendations for treating detected diseases, helping you maintain healthy crops.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* Call to Action */}
      <section className="bg-potato-600 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                Ready to Protect Your Potato Crops?
              </h2>
              <p className="max-w-[600px] text-balance text-potato-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start using our advanced disease detection technology today. No registration required.
              </p>
            </div>
            <Link to="/upload">
              <Button className="bg-white text-potato-600 hover:bg-potato-50">
                Start Free Detection
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="container flex flex-col gap-2 py-10 md:h-24 md:flex-row md:items-center md:justify-between md:py-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="text-sm text-muted-foreground">
              © 2025 PotatoGuard. All rights reserved.
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="#" className="hover:underline hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:underline hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:underline hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
      
      <ChatDialog />
    </div>
  );
};

export default Index;
