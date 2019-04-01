export interface AuthData {
  _id?: string;
  name?: string;
  email: string;
  password: string;
  roles?: {
    isAdmin?: boolean,
    isWriter?: boolean,
    isReader?: boolean,
  };
}
