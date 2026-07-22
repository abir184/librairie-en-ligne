import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivreModule } from './livre/livre.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [LivreModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
