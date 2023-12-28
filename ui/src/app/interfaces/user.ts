export interface User {
  _id: string;
  no: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isActive: boolean;
  createdTime: string;
}
