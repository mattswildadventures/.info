import { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAuth } from '../../../lib/adminAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test auth endpoint called');
  console.log('Cookies:', req.cookies);
  
  const isAuthenticated = checkAdminAuth(req);
  console.log('Authentication check result:', isAuthenticated);
  
  res.status(200).json({ 
    authenticated: isAuthenticated,
    cookies: req.cookies,
    timestamp: new Date().toISOString()
  });
}