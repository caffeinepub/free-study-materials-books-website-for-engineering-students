import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Search, GraduationCap, FileText, Zap } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Organized by Structure',
      description: 'Browse materials by department, semester, and subject for easy navigation.',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find exactly what you need with advanced filtering and keyword search.',
    },
    {
      icon: FileText,
      title: 'Diverse Resources',
      description: 'Access notes, books, previous papers, slides, and lab manuals.',
    },
    {
      icon: Zap,
      title: 'Always Free',
      description: 'All study materials are completely free for engineering students.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
        <div className="container py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm w-fit">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-medium">Free for All Students</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Gateway to Free Engineering Study Materials
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Access a comprehensive library of study materials, textbooks, and resources for all engineering subjects. 
                Completely free, organized by department and semester, and always available when you need it.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/browse' })}
                  className="gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Browse Materials
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/search' })}
                  className="gap-2"
                >
                  <Search className="h-5 w-5" />
                  Search Resources
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/studyhub-hero.dim_1600x900.png"
                alt="Students studying with books and laptop"
                className="rounded-lg shadow-soft w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            PREMJI provides a comprehensive platform for accessing and organizing study materials
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Browse our extensive collection of study materials or search for specific resources
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/browse' })}
                className="gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Browse by Department
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/search' })}
                className="gap-2"
              >
                <Search className="h-5 w-5" />
                Search All Resources
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
