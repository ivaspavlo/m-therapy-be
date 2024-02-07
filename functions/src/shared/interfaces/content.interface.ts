import { COLLECTIONS } from '../constants';
import { IAd } from './ad.interface';
import { IContact } from './contact.interface';
import { IProduct } from './product.interface';

export interface IContent {
  [COLLECTIONS.ADS]: IAd[],
  [COLLECTIONS.PRODUCTS]: IProduct[]
  [COLLECTIONS.CONTACTS]: IContact[]
}
