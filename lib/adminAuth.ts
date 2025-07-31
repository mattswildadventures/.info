import { NextApiRequest, NextApiResponse } from 'next';
import { GetServerSidePropsContext } from 'next';

export function checkAdminAuth(req: NextApiRequest): boolean {
  const sessionCookie = req.cookies['admin-session'];
  
  if (!sessionCookie) {
    return false;
  }

  try {
    // Basic session validation (in production, use proper JWT validation)
    const decoded = Buffer.from(sessionCookie, 'base64').toString('utf8');
    const [user, timestamp] = decoded.split(':');
    
    if (user !== 'admin') {
      return false;
    }

    // Check if session is expired (24 hours)
    const sessionTime = parseInt(timestamp);
    const now = Date.now();
    const sessionAge = now - sessionTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    return sessionAge < maxAge;
  } catch (error) {
    return false;
  }
}

export function requireAdminAuth(handler: (req: NextApiRequest, res: NextApiResponse) => void) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return handler(req, res);
  };
}

export function getServerSidePropsWithAuth() {
  return {
    getServerSideProps: async (context: GetServerSidePropsContext) => {
      const req = context.req as any;
      
      if (!checkAdminAuth(req)) {
        return {
          redirect: {
            destination: '/admin/login',
            permanent: false,
          },
        };
      }

      return {
        props: {},
      };
    },
  };
}