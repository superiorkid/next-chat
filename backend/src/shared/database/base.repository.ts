import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export abstract class BaseRepository<
  TModel,
  TDelegate extends {
    findUnique: (args: any) => Promise<TModel | null>;
    findFirst: (args: any) => Promise<TModel | null>;
    findMany: (args?: any) => Promise<TModel[]>;
    create: (args: any) => Promise<TModel>;
    update: (args: any) => Promise<TModel>;
    delete: (args: any) => Promise<TModel>;
    count: (args?: any) => Promise<number>;
    deleteMany: (args?: any) => Promise<{ count: number }>;
    createMany: (args?: any) => Promise<{ count: number }>;
  },
> {
  protected constructor(
    protected readonly prisma: DatabaseService,
    protected readonly delegate: TDelegate,
  ) {}

  async findUnique<T extends Parameters<TDelegate['findUnique']>[0]>(
    args: T,
  ): Promise<TModel | null> {
    return this.delegate.findUnique(args);
  }

  async findFirst<T extends Parameters<TDelegate['findFirst']>[0]>(
    args: T,
  ): Promise<TModel | null> {
    return this.delegate.findFirst(args);
  }

  async findMany<T extends Parameters<TDelegate['findMany']>[0]>(
    args?: T,
  ): Promise<TModel[]> {
    return this.delegate.findMany(args);
  }

  async create<T extends Parameters<TDelegate['create']>[0]>(
    args: T,
  ): Promise<TModel> {
    return this.delegate.create(args);
  }

  async update<T extends Parameters<TDelegate['update']>[0]>(
    args: T,
  ): Promise<TModel> {
    return this.delegate.update(args);
  }

  async delete<T extends Parameters<TDelegate['delete']>[0]>(
    args: T,
  ): Promise<TModel> {
    return this.delegate.delete(args);
  }

  async count<T extends Parameters<TDelegate['count']>[0]>(
    args?: T,
  ): Promise<number> {
    return this.delegate.count(args);
  }

  async deleteMany<T extends Parameters<TDelegate['deleteMany']>[0]>(
    args?: T,
  ): Promise<{ count: number }> {
    return this.delegate.deleteMany(args);
  }

  async createMany<
    T extends Parameters<NonNullable<TDelegate['createMany']>>[0],
  >(args: T): Promise<{ count: number }> {
    if (!this.delegate.createMany) {
      throw new Error('createMany is not implemented in this delegate.');
    }
    return this.delegate.createMany(args);
  }
}
