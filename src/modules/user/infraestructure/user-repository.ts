import { User } from "../domain/interface";

export interface UserRepository {
  getUserInfo(): Promise<User | null>;
}