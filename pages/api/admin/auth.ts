import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { serialize } from 'cookie';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    console.log('Auth attempt with password:', password ? '[PROVIDED]' : '[MISSING]');

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Read the content file to get the admin password
    const contentData = JSON.parse(fs.readFileSync(CONTENT_FILE_PATH, 'utf8'));
    const adminPassword = contentData.settings?.adminPassword || 'admin123';
    
    console.log('Expected password:', adminPassword);
    console.log('Provided password:', password);
    console.log('Passwords match:', password === adminPassword);

    if (password !== adminPassword) {
      console.log('Authentication failed: incorrect password');
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a simple session token (in production, use JWT or better session management)
    const sessionToken = Buffer.from(`admin:${Date.now()}`).toString('base64');
    console.log('Generated session token:', sessionToken);

    // Set HTTP-only cookie for session
    const cookie = serialize('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    console.log('Setting cookie:', cookie);
    res.setHeader('Set-Cookie', cookie);
    console.log('Authentication successful, redirecting to dashboard');
    res.status(200).json({ message: 'Authentication successful' });
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
}