import { User } from '../shared/models';
import { IUpdateUser } from './user.interface';

/**
 * Remove undefined values and not intended values.
 * @param {IUpdateUser} updateData
 * @param {User} user 
 * @returns {Partial<User>}
 */
export const UpdateUserMapper = (updateData: IUpdateUser, user: User): Partial<User> => {
  const allowedUpdateUserKeys = ['firstname', 'lastname', 'email', 'phone', 'birthday', 'hasEmailConsent', 'lang'];
  const filteredUpdateData = Object.entries(updateData).reduce((acc, [key, value]) => {
    return !allowedUpdateUserKeys.includes(key) || value === undefined
      ? acc
      : {...acc, [key]: value};
  }, {});
  return {
    ...user,
    ...filteredUpdateData
  };
}
