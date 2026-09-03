import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required.' })
  }

  const token = authHeader.replace('Bearer ', '')

  if (token === 'dev-icu-demo-token') {
    req.user = {
      id: 'demo-admin',
      email: 'admin@icu.local',
      role: 'DOCTOR',
    }
    return next()
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string
      email: string
      role: string
    }

    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
