/**
 * Middleware to verify admin authentication
 * Used to protect admin API routes
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No valid authentication token provided'
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No authentication token provided'
      });
    }
    
    // Verify the token with Supabase
    const { data, error } = await req.supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error('Auth error:', error);
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: error?.message || 'Invalid or expired token'
      });
    }
    
    // Check if user has admin role
    const isAdmin = data.user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Admin privileges required'
      });
    }
    
    // Store user data in request object
    req.user = data.user;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Authentication service temporarily unavailable'
    });
  }
};

module.exports = adminAuth;
