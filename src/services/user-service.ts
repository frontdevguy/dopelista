import {Credentials} from '../types';
import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export class MyUserService implements UserService<User, Credentials>{
  constructor() {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    return {
      ...credentials,
      id: '983753527',
      name: 'Developer'
    };
  }

  convertToUserProfile(user: User): UserProfile {
    return {[securityId]: user.id, name: user.name, id: user.id};
  }
}
