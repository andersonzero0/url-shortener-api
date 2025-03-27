import { Request } from 'express';

export interface RequestWithUserId extends Request {
  user_id: string;
}
