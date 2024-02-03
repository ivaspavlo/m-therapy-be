import { COLLECTIONS } from '../constants';
import { IAd } from './ad.interface';
import { IProduct } from './product.interface';

export interface IContent {
  [COLLECTIONS.ADS]: IAd[],
  [COLLECTIONS.PRODUCTS]: IProduct[]
}
