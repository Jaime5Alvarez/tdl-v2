import { UserRepository } from "./user-repository";
import { SupabaseUserRepository } from "./supabase/user-repository";
import { createClient } from "src/utils/supabase/server";

export async function UserRepositoryFactory(): Promise<UserRepository> {
    const supabase = await createClient();
    return new SupabaseUserRepository(supabase);
  } 