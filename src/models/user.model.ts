import {Entity, model, property} from '@loopback/repository';


@model({
  name: 'users',
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  // @hasMany(() => Order)
  // orders: Order[];

  // @hasOne(() => UserCredentials)
  // userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
