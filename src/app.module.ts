import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BibleModule } from './bible/bible.module';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://4.dbt.io/api',
    }),
    BibleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
