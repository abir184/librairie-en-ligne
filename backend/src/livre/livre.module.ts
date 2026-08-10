import { Module } from '@nestjs/common';
import { LivreService } from './livre.service';
import { LivreController } from './livre.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IaModule } from '../ia/ia.module';

@Module({
  imports: [PrismaModule, IaModule],
  controllers: [LivreController],
  providers: [LivreService],
})
export class LivreModule {}