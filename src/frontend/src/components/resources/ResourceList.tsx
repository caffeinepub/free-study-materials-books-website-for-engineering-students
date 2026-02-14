import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText } from 'lucide-react';
import { deriveResourceType } from '../../lib/resourceType';
import type { Resource } from '../../backend';

interface ExtendedResource extends Resource {
  departmentName?: string;
  semesterName?: string;
  subjectName?: string;
}

interface ResourceListProps {
  resources: ExtendedResource[];
  departmentId?: string;
  semesterId?: string;
  subjectId?: string;
  showContext?: boolean;
}

export default function ResourceList({ resources, showContext = false }: ResourceListProps) {
  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const resourceType = deriveResourceType(resource.title, resource.url);
        
        return (
          <Card key={resource.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{resourceType}</Badge>
                    {showContext && resource.departmentName && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {resource.departmentName}
                        </span>
                        {resource.semesterName && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {resource.semesterName}
                            </span>
                          </>
                        )}
                        {resource.subjectName && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {resource.subjectName}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <Button
                  asChild
                  className="flex-shrink-0"
                >
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </a>
                </Button>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
