import {Credentials} from '../types';
import {HttpErrors} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {repository} from '@loopback/repository';
import {PasswordHasher} from './hash.password.bcryptjs';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/context';
import isemail from 'isemail';

export class MyUserService implements UserService<User, Credentials>{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async checkIfUserExist(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {email}
    });
    return user;
  }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    if (!isemail.validate(credentials.email)) {
      throw new HttpErrors.UnprocessableEntity('Invalid email');
    }

    if (credentials.password.length < 1) {
      throw new HttpErrors.UnprocessableEntity('Password in required');
    }

    if (credentials.password.length < 8) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const foundUser = await this.checkIfUserExist(credentials.email);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {[securityId]: String(user.id), name: user.name, id: user.id};
  }
}
