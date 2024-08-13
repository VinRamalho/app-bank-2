import { Injectable } from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  In,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DataStatus } from './entities/data.entity';

@Injectable()
export abstract class Data<T> {
  constructor(private readonly repository: Repository<T>) {}

  protected async createData(entity: DeepPartial<T>): Promise<T> {
    const status = DataStatus.DRAFT;

    const model = this.repository.create({ ...entity, status });

    return await this.repository.save(model);
  }

  protected async findDataAll(
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T[]> {
    const options: FindManyOptions<T> = {};
    if (relations) options.relations = relations;
    if (select) options.select = select;

    return await this.repository.find(options);
  }

  protected async findDataById(
    id: string,
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T | undefined> {
    try {
      const options: FindOneOptions<T> = { where: { id } as any };
      if (relations) options.relations = relations;
      if (select) options.select = select;

      return await this.repository.findOne(options);
    } catch (err) {
      return this.validNotFound(err);
    }
  }

  protected async findDataByField(
    field: FindOptionsWhere<T>,
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T | undefined> {
    try {
      const options: FindOneOptions<T> = { where: field };
      if (relations) options.relations = relations;
      if (select) options.select = select;

      return await this.repository.findOne(options);
    } catch (err) {
      return this.validNotFound(err);
    }
  }

  protected async findDatasByField(
    field: FindOptionsWhere<T>,
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T[]> {
    const options: FindManyOptions<T> = { where: field };
    if (relations) options.relations = relations;
    if (select) options.select = select;

    return await this.repository.find(options);
  }

  protected async findDataByIds(
    ids: string[],
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T[]> {
    const options: FindManyOptions<T> = {
      where: { id: In(ids) } as any,
    };
    if (relations) options.relations = relations;
    if (select) options.select = select;

    return await this.repository.find(options);
  }

  protected async updateData(
    id: string,
    updateEntity: QueryDeepPartialEntity<T>,
  ): Promise<T | undefined> {
    try {
      await this.repository.update(id, updateEntity);
      return await this.repository.findOne({ where: { id } as any });
    } catch (err) {
      return this.validNotFound(err);
    }
  }

  protected async deleteData(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (err) {
      this.validNotFound(err);
    }
  }

  private validNotFound(err: any) {
    if (err.name === 'EntityNotFound') {
      return undefined;
    } else {
      console.error('###ERR', err);
      throw err;
    }
  }
}
