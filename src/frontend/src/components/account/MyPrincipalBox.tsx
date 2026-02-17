import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/utils/copyToClipboard';

export default function MyPrincipalBox() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) {
    return null;
  }

  const principal = identity.getPrincipal().toText();

  const handleCopy = async () => {
    const success = await copyToClipboard(principal);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">My Principal ID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md bg-background border p-3 overflow-x-auto">
          <code className="text-sm font-mono break-all select-all">
            {principal}
          </code>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="w-full gap-2"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Principal ID
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          This is your unique identifier on the Internet Computer. Share this with the administrator to get access to the admin panel.
        </p>
      </CardContent>
    </Card>
  );
}
