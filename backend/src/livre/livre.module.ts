import { Module } from '@nestjs/common';
import { LivreService } from './livre.service';
import { LivreController } from './livre.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LivreController],
  providers: [LivreService],
})
export class LivreModule {}