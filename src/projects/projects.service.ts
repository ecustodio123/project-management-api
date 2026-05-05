import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string) {
    const { name, description } = createProjectDto;

    return this.prisma.project.create({
      data: {
        name,
        description,
        ownerId,
      },
    });
  }

  async findAll(ownerId: string) {
    return this.prisma.project.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    ownerId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
  }

  async remove(id: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Project deleted successfully',
    };
  }
}
