import { User } from '../shared/models';
import { IUpdateUser } from './user.interface';

/**
 * Fields available for update: firstname, lastname, email, phone, birthday, hasEmailConsent, lang.
 * @param {IUpdateUser} updateData
 * @param {User} user 
 * @returns {User}
 */
export const UpdateUserMapper = (updateData: IUpdateUser, user: User): User => {
  return new User(
    user.id,
    user.created,
    updateData.firstname || user.firstname,
    updateData.lastname || user.lastname,
    updateData.email || user.email,
    updateData.phone || user.phone,
    updateData.birthday || user.birthday,
    updateData.hasEmailConsent || user.hasEmailConsent,
    user.isConfirmed,
    updateData.lang || user.lang
  );
}
