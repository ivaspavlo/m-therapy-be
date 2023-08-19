export class User {
  public id?: string;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public password!: string;

  constructor(
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    address: string,
    password: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.password = password;
  }
}
