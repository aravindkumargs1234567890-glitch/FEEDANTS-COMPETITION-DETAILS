import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';

export class UserController {
  static async listUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      // omit passwordHash for security
      const sanitized = users.map(({ passwordHash, ...rest }) => rest);
      return res.json({ success: true, data: sanitized });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const { passwordHash, ...sanitized } = user;
      return res.json({ success: true, data: sanitized });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, phone, city } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }

      const existing = await UserModel.findOne({ email });
      if (existing) {
        const { passwordHash, ...sanitized } = existing;
        return res.json({ success: true, data: sanitized, message: 'Logged in as existing user' });
      }

      const user = await UserModel.create({
        name: name || 'Dance Participant',
        email,
        phone,
        city,
      });

      const { passwordHash, ...sanitized } = user;
      return res.status(201).json({ success: true, data: sanitized });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
