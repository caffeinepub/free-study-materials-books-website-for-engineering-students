import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Upload, Link as LinkIcon } from 'lucide-react';

export default function AdminHelpSection() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          How to Add Study Materials
        </CardTitle>
        <CardDescription>
          Two ways to add resources to PREMJI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            <strong className="font-semibold">Option 1: Upload Files Directly</strong>
            <ol className="mt-2 space-y-2 text-sm list-decimal list-inside">
              <li>Click "Add Resource" in the Resources tab above</li>
              <li>Select the department, semester, and subject</li>
              <li>Enter a descriptive title for the resource</li>
              <li>Choose "Upload File" as the resource source</li>
              <li>Click "Choose File" and select your PDF, document, or other file</li>
              <li>Click "Save" to upload and add the resource</li>
            </ol>
            <p className="mt-2 text-sm text-muted-foreground">
              Files are stored securely in PREMJI and can be accessed by students directly.
            </p>
          </AlertDescription>
        </Alert>

        <Alert>
          <LinkIcon className="h-4 w-4" />
          <AlertDescription>
            <strong className="font-semibold">Option 2: Link to External Files</strong>
            <ol className="mt-2 space-y-2 text-sm list-decimal list-inside">
              <li>Upload your file to a hosting service (Google Drive, Dropbox, OneDrive, etc.)</li>
              <li>Get a shareable link with public or "anyone with link" access</li>
              <li>Click "Add Resource" in the Resources tab above</li>
              <li>Select the department, semester, and subject</li>
              <li>Enter a descriptive title for the resource</li>
              <li>Choose "External URL" as the resource source</li>
              <li>Paste the shareable link in the URL field</li>
              <li>Click "Save" to add the resource</li>
            </ol>
            <p className="mt-2 text-sm text-muted-foreground">
              Make sure the link is publicly accessible so students can view the materials.
            </p>
          </AlertDescription>
        </Alert>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Tips for Better Organization</h4>
          <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Use clear, descriptive titles (e.g., "Chapter 3 Notes - Data Structures")</li>
            <li>Include keywords like "Notes", "Book", "Previous Papers", "Slides", or "Lab Manual" in titles for automatic categorization</li>
            <li>Verify links are accessible before adding them</li>
            <li>For uploaded files, ensure file sizes are reasonable for student downloads</li>
            <li>Regularly check and update outdated materials</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
