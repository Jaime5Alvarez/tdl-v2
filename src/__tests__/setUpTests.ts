import { config } from 'dotenv';
import { User } from 'src/modules/users/domain/entities/users';
config();

export const userInfoTesting: User = {
    id: process.env.USER_ID_TESTING!,
    firstName: "jaime",
    lastName: "Alvarez",
}