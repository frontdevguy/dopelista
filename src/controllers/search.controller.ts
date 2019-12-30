import {
  Request,
  RestBindings,
  get,
  ResponseObject,
} from '@loopback/rest';

import {inject} from '@loopback/context';

import {RegistrationMail} from '../mails';

const SEARCH_RESPONSE: ResponseObject = {
  description: 'Search Response'
};

export class SearchController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mail: any;
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private req: Request,
  ) {}

  @get('/search', {
    responses: {
      '200': SEARCH_RESPONSE,
    },
  })
  search(
    name: string,
    @inject('registration.mail')
    mail: RegistrationMail,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    return mail.send();
  }
}
