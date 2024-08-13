import { Injectable } from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  In,
  FindOptionsWhere,
  FindOptions,
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

  protected async findData(
    options: FindManyOptions<T>,
  ): Promise<T[]> {

    return await this.repository.find(options);
  }

  protected async findOneData(
    options: FindOneOptions<T>,
  ): Promise<T> {

    return await this.repository.findOne(options);
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
