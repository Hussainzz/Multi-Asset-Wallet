import { Express } from "express-serve-static-core";

type UserInfo = {
  id: number;
  email: string;
} 


declare module "express-serve-static-core" {
  interface Request {
    appUrl: string;
    user: UserInfo;
  }
}