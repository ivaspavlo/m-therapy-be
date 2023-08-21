export class User {
  public id?: string;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public phone!: string;
  public birthday!: number;
  public password!: string;

  constructor(
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: number,
    password: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.birthday = birthday;
    this.password = password;
  }
}
