
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, ShieldCheck, Info } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container px-4 py-12 mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">About PotatoGuard</h1>
        <p className="mt-2 text-muted-foreground">
          Learn more about our potato disease detection system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-potato-100">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="rounded-full bg-potato-50 p-4 mb-4">
                <Info className="h-8 w-8 text-potato-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                PotatoGuard aims to help farmers identify and treat potato plant diseases early, 
                reducing crop losses and improving food security around the world.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-potato-100">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="rounded-full bg-potato-50 p-4 mb-4">
                <ShieldCheck className="h-8 w-8 text-potato-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">How It Works</h2>
              <p className="text-muted-foreground">
                Our AI-powered system analyzes images of potato plants to detect diseases with high accuracy.
                Simply upload a photo, and receive an instant diagnosis with treatment recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-potato-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-potato-50 p-4 mb-4">
                  <Leaf className="h-6 w-6 text-potato-500" />
                </div>
                <h3 className="font-medium mb-2">Disease Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Identify common potato diseases including early blight, late blight, and dry rot.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-potato-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-potato-50 p-4 mb-4">
                  <Leaf className="h-6 w-6 text-potato-500" />
                </div>
                <h3 className="font-medium mb-2">Treatment Advice</h3>
                <p className="text-sm text-muted-foreground">
                  Get expert recommendations on how to treat identified diseases and prevent spread.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-potato-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-potato-50 p-4 mb-4">
                  <svg className="h-6 w-6 text-potato-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v6m0 4v10M6 8l12 8m0-8L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">History Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Keep a record of all your previous detections to monitor disease progression over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 bg-potato-50 rounded-lg p-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">About the Team</h2>
          <p className="text-muted-foreground mb-6">
            PotatoGuard was developed by a team of agricultural scientists, machine learning engineers, and developers 
            passionate about applying technology to solve agricultural challenges.
          </p>
          <p className="text-muted-foreground">
            Our model is trained on thousands of images of potato plants in various stages of disease,
            ensuring high accuracy and reliability in diverse growing conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
