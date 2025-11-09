import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../lib/prisma';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

/**
 * POST /api/auth/create-employee
 * Create a new employee or admin user
 * Requires: Admin role
 */
export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Email, password, and role are required'
      });
      return;
    }

    if (!['employee', 'admin'].includes(role)) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Role must be either "employee" or "admin"'
      });
      return;
    }

    // Check if requesting user is admin
    if (req.userRole !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can create employees'
      });
      return;
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError || !authData.user) {
      console.error('Supabase auth error:', authError);
      res.status(500).json({
        error: 'Failed to create user',
        message: authError?.message || 'Unknown error occurred'
      });
      return;
    }

    // Create user role in database
    await prisma.userRole.create({
      data: {
        user_id: authData.user.id,
        role: role as 'admin' | 'employee',
      }
    });

    res.status(201).json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role,
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to create employee'
    });
  }
};
