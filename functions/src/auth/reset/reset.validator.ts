import { IValidatorSet } from '../../shared/interfaces';
import { ERROR_MESSAGES } from '../../shared/constants';
import { passwordValidator, validate } from '../../shared/utils';
import { IResetReq } from './reset.interface';


const fieldValidators: Record<keyof IResetReq, IValidatorSet> = {
  password: {validators: [passwordValidator]}
}

export const ResetValidator = async (req: IResetReq): Promise<string[] | null> => {
  const errors = validate(req, fieldValidators);
  if (errors.length) {
    return Promise.resolve([`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]);
  }
  return null;
}
