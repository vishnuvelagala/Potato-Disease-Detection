
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, User, MessageSquare } from 'lucide-react';
import { API_URL } from '@/config/api';

interface Testimonial {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/feedback/random?limit=3`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError('Could not load testimonials');
        
        // For demo purposes, use some sample testimonials if API is down
        const sampleTestimonials = [
          {
            id: "sample-1",
            username: "FarmerJoe",
            rating: 5,
            comment: "PotatoGuard has transformed how I monitor my crops. Highly recommended!",
            timestamp: new Date().toISOString()
          },
          {
            id: "sample-2",
            username: "AgriTech",
            rating: 5,
            comment: "An essential tool for modern farming. The AI detection is impressively accurate.",
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "sample-3",
            username: "CropSpecialist",
            rating: 4,
            comment: "Great interface and easy to use. Helps me catch potato diseases early.",
            timestamp: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setTestimonials(sampleTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
        />
      ));
  };

  // Don't render anything if loading
  if (loading) {
    return null;
  }

  // If there's an error but we have fallback testimonials, show them
  // If no testimonials at all, don't render the section
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-potato-200 bg-potato-100/50 px-3 py-1 text-sm font-medium text-potato-700">
              User Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What Our Users Say
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-potato-100">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-potato-100 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-potato-700" />
                      </div>
                      <div className="font-medium">{testimonial.username}</div>
                    </div>
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
