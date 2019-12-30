import {
  Request,
  RestBindings,
  get,
  post,
  requestBody,
  getModelSchemaRef,
  ResponseObject,
  HttpErrors
} from '@loopback/rest';

import {model, property} from '@loopback/repository';

import {UserProfile, SecurityBindings} from '@loopback/security';

import {inject} from '@loopback/context';

import {
  AuthenticationBindings,
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';

import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from '../keys';

import _ from 'lodash';

import {
  Credentials
} from '../types';


import {PasswordHasher} from '../services/hash.password.bcryptjs';

import {validateCredentials} from '../validations/user-validation';

import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';


import {RegistrationMail} from '../mails';

const GET_USER_RESPONSE: ResponseObject = {
  description: 'User Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          email: {type: 'string'}
        },
      },
    },
  },
};

const EXCHANGE_TOKEN_RESPONSE: ResponseObject = {
  description: 'Exchange User Credentials Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          id: {type: 'string'},
          email: {type: 'string'},
          password: {type: 'string'}
        },
      },
    },
  },
}

@model()
export class NewUserRequest{
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
}

export class UserController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private req: Request,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,

    @inject('repositories.UserRepository')
    public repository : UserRepository,
  ) {}

  @get('/user', {
    responses: {
      '200': GET_USER_RESPONSE,
    },
  })
  @authenticate('jwt')
  async getUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  /**
   * Exchange User Credentials For A Token
   *
   * @param credentials
   */

  @post('/user/exchange-token', {
    responses: {
      '200': EXCHANGE_TOKEN_RESPONSE,
    },
  })
  async exchangeUserToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email','password'],
            properties: {
              email: {type: 'string'},
              password: {type: 'string'}
            },
          },
        },
      },
    })
    credentials: Credentials
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return { token }
  }

   /**
   * Create user
   *
   * @param newUserRequest
   */

  @post('/user', {
    responses: {
      '200': GET_USER_RESPONSE,
    },
  })
  async createUser(
    @inject('registration.mail')
    registrationMail: RegistrationMail,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest),
        },
      },
    })
    newUserRequest: NewUserRequest
  ): Promise<User> {
    const credentials =_.pick(newUserRequest,['email','password','name']);
    validateCredentials(credentials)
    const {email, name} = credentials;
    const userExist = await this.repository.findOne({
      where: {email}
    });
    if(userExist) throw new HttpErrors.Conflict('User already exist');
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );
    const newUser = await this.repository.create({...newUserRequest, password});

    registrationMail.send({
      email,
      name
    });
    return newUser;
  }
}
