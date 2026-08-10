import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivreModule } from './livre/livre.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategorieModule } from './categorie/categorie.module';
import { ClientModule } from './client/client.module';
import { CommandeModule } from './commande/commande.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { IaModule } from './ia/ia.module';

@Module({
  imports: [LivreModule, PrismaModule, CategorieModule, ClientModule, CommandeModule, AuthModule , ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'uploads'),
  serveRoot: '/uploads',
}), IaModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}