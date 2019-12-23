import {Credentials} from '../types';
import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';

interface UserCredentials extends Credentials {
  name: string;
}

export function validateCredentials(credentials: UserCredentials) {
  const {email, password, name} = credentials;
  // Validate Email
  if (!isemail.validate(email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password
  if (!password || password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }

  // Validate Name
  if (!name || name.length < 1) {
    throw new HttpErrors.UnprocessableEntity(
      'Name is required',
    );
  }
}
