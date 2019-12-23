import {
  Request,
  RestBindings,
  get,
  post,
  HttpErrors,
  requestBody,
  getModelSchemaRef,
  ResponseObject
} from '@loopback/rest';

import {repository, model, property} from '@loopback/repository';

import {UserProfile, securityId, SecurityBindings} from '@loopback/security';

import {inject} from '@loopback/context';

import {
  AuthenticationBindings,
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';

import {
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';

import {
  Credentials,
  User,
} from '../types'

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
   * @return newUserRequest
   * @throws HttpErrors
   */

  @post('/user', {
    responses: {
      '200': GET_USER_RESPONSE,
    },
  })
  async createUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest),
        },
      },
    })
    newUserRequest: NewUserRequest
  ): Promise<User> {
    if(!newUserRequest.email)
      throw new HttpErrors.BadRequest('Email is required');

    return {
      name: `Modified ${newUserRequest.name}`,
      email: newUserRequest.email,
      password: '8*&&ww2233'
    }
  }
}
