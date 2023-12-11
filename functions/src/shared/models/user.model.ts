import { IUser } from '../interfaces';


export class User {
  public id!: string;
  public created!: number;
  public isAdmin!: boolean;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public phone!: string;
  public birthday!: number;

  constructor(
    id: string,
    created: number,
    isAdmin: boolean,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: number
  ) {
    this.id = id;
    this.created = created;
    this.isAdmin = isAdmin;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.birthday = birthday;
  }

  public static fromDocumentData(userDocumentData: IUser): User {
    return new User(
      userDocumentData.id as string,
      userDocumentData.created as number,
      userDocumentData.isAdmin,
      userDocumentData.firstname,
      userDocumentData.lastname,
      userDocumentData.email,
      userDocumentData.phone,
      userDocumentData.birthday
    );
  }
}
