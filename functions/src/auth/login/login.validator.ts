import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { ERROR_MESSAGES } from '../../shared/constants';


export const LoginValidator = (queryByEmail: QuerySnapshot): string[] | null => {
  if (queryByEmail.empty) {
    return [ERROR_MESSAGES.NOT_FOUND];
  }
  const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find(d => !!d);
  if (!userDocumentSnapshot || !userDocumentSnapshot.data()) {
    return [ERROR_MESSAGES.NOT_FOUND];
  }

  return null;
}
