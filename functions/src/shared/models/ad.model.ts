import { AD_TYPE } from '../constants';
import { IAd } from '../interfaces';

export class Ad implements IAd {

  public type!: AD_TYPE;
  public title!: string;
  public content!: string;
  public endDate?: number;
  public link?: string;

  constructor() {}

  public static of(
    value: IAd
  ): Ad {
    const ad = new Ad();
    ad.type = value.type;
    ad.title = value.title;
    ad.content = value.content;
    ad.endDate = value.endDate;
    ad.link = value.link;
    return ad;
  }
}
