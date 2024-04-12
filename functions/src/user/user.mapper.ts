import { User } from '../shared/models';
import { ISubscriber, IUpdateUser } from './user.interface';

/**
 * Remove undefined and not intended values.
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

/**
 * Remove undefined and not intended values.
 * @param {email: string, [key:string]: any} data
 * @returns {ISubscriber}
 */
export const SubscriberMapper = (data: {email: string, [key:string]: any}): ISubscriber => {
  return {
    email: data.email
  };
}
