import { UserRole } from "./userTypes";

export interface JwtPayload {
    id: string;
    role: UserRole;
  }
  