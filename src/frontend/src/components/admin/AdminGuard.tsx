import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAdminStatus } from '../../features/admin/useAdminStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, isFetched } = useGetAdminStatus();

  const isAuthenticated = !!identity;

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              size="lg"
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login with Internet Identity'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while checking permissions
  if (adminLoading || !isFetched) {
    return (
      <div className="container max-w-2xl py-16">
        <Card>
          <CardContent className="py-16 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
            <div className="text-muted-foreground">Checking permissions...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied only when isAdmin is explicitly false
  if (isAdmin === false) {
    return (
      <div className="container max-w-2xl py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel. Only administrators can manage study materials.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
