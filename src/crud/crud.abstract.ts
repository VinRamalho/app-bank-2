import { Injectable } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { Data } from 'src/data/data.abstract';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class Crud<T> extends Data<T> {
  constructor(repository: Repository<T>) {
    super(repository);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const res = await super.createData(entity);

    return res;
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    const res = await super.findData(options);

    return res;
  }

  async findOne(options?: FindOneOptions<T>): Promise<T> {
    const res = await super.findOneData(options);

    return res;
  }

  async update(
    id: string,
    updateEntity: QueryDeepPartialEntity<T>,
  ): Promise<T | undefined> {
    const res = await super.updateData(id, updateEntity);

    return res;
  }

  async delete(id: string): Promise<void> {
    const res = await super.deleteData(id);

    return res;
  }

  protected get Repository(): Repository<T> {
    return super.RepositoryData;
  }
}
