import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const hashedPassword = await bcrypt.hash(createClientDto.password, 10);
    return this.prisma.client.create({
      data: { ...createClientDto, password: hashedPassword },
    });
  }

  findAll() {
    return this.prisma.client.findMany({
      select: { id: true, nom: true, email: true, adresse: true, telephone: true, createdAt: true },
    });
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
      select: { id: true, nom: true, email: true, adresse: true, telephone: true, createdAt: true },
    });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}
