import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../auth/application/annotations/public.js';

@Controller()
export class AppController {
  @Public()
  @Get()
  get() {
    return {
      name: 'Drive School',
    };
  }
}
