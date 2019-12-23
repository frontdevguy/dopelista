import {
Request , RestBindings, get, ResponseObject, param
} from '@loopback/rest';

import {inject} from '@loopback/context';

const SEARCH_RESPONSE: ResponseObject = {
  description: 'Search Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: {type: 'string'},
        },
      },
    },
  },
};

export class SearchController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request
  ) {}



  @get('/search/{name}', {
    responses: {
      '200': SEARCH_RESPONSE,
    },
  })
  search(
    @param.path.string('name') name: string
  ): object {
    return { name }
  }
}
