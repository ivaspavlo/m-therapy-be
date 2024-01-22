import { AD_TYPE } from '../constants';
import { IAd, IAdDB } from '../interfaces';

export class Ad implements IAd {

  public type!: AD_TYPE;
  public title!: string;
  public content!: string;
  public endDate?: Date;
  public link?: string;

  constructor() {}

  public static of(
    value: IAdDB
  ): Ad {
    const ad = new Ad();
    ad.type = value.type;
    ad.title = value.title;
    ad.content = value.content;
    ad.endDate = value.endDate ? new Date(value.endDate) : undefined;
    ad.link = value.link;
    return ad;
  }
}
