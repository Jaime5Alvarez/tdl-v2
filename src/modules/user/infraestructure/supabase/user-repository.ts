import { UserRepository } from "../user-repository";
import { User } from "@/modules/user/domain/interface";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseUserRepository implements UserRepository {
  constructor(private supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getUserInfo(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User not found");
    }
    if (!data.user.email) {
      throw new Error("Email not found");
    }

    return {
      id: data.user.id,
      email: data.user.email,
    };
  }
}
