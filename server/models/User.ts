import { db, MongoQuery } from '../db/mongoStore.js';
import crypto from 'crypto';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  profileImage: string;
  phone?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static hashPassword(password: string, salt: string = 'feedants_salt'): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
  }

  static verifyPassword(password: string, hash: string, salt: string = 'feedants_salt'): boolean {
    return this.hashPassword(password, salt) === hash;
  }

  static async findById(id: string): Promise<IUser | null> {
    return db.users.findById(id);
  }

  static async findOne(query: MongoQuery): Promise<IUser | null> {
    return db.users.findOne(query);
  }

  static async find(query: MongoQuery = {}): Promise<IUser[]> {
    return db.users.find(query);
  }

  static async create(userData: Partial<IUser> & { password?: string }): Promise<IUser> {
    const salt = 'feedants_salt';
    const passwordHash = userData.passwordHash || (userData.password ? this.hashPassword(userData.password, salt) : this.hashPassword('Default123!', salt));
    
    return db.users.insertOne({
      name: userData.name || 'Anonymous Dancer',
      email: userData.email,
      passwordHash,
      profileImage: userData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      phone: userData.phone || '+91 98765 43210',
      city: userData.city || 'Mumbai',
    });
  }
}
