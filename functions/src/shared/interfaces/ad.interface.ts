import { AD_TYPE } from '../constants';

export interface IAd {
  type: AD_TYPE,
  title: string,
  content: string,
  endDate?: Date,
  link?: string
}

export interface IAdDB {
  type: AD_TYPE,
  title: string,
  content: string,
  endDate?: number,
  link?: string
}
