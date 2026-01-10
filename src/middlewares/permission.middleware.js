import db from "../config/db.js";

const permissionCache = new Map();

export const checkPermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;
      const cacheKey = `${userRole}:${permissionKey}`;
      
      // Check cache
      if (permissionCache.has(cacheKey)) {
        const hasPermission = permissionCache.get(cacheKey);
        if (!hasPermission) {
          return res.status(403).json({ 
            success: false,
            error: "You don't have permission to perform this action" 
          });
        }
        return next();
      }
      
      // Query database
      const [rows] = await db.query(`
        SELECT 1 
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.permission_id
        WHERE rp.role = ? AND p.key = ?
        LIMIT 1
      `, [userRole, permissionKey]);
      
      const hasPermission = rows.length > 0;
      permissionCache.set(cacheKey, hasPermission);
      
      if (!hasPermission) {
        return res.status(403).json({ 
          success: false,
          error: "You don't have permission to perform this action" 
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Server error during permission check' 
      });
    }
  };
};

export const clearPermissionCache = () => {
  permissionCache.clear();
};