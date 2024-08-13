import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm';
import { Data } from 'src/data/data.abstract';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class Crud<T> extends Data<T> {
  constructor(repository: Repository<T>) {
    super(repository);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    return await super.createData(entity);
  }

  async find(
    options: FindManyOptions<T>,
  ): Promise<T[]> {
    

    return await super.findData(options);
  }

  async findOne(
    options: FindOneOptions<T>,
  ): Promise<T> {
    

    return await super.findOneData(options);
  }

  async update(
    id: string,
    updateEntity: QueryDeepPartialEntity<T>,
  ): Promise<T | undefined> {
    return await super.updateData(id, updateEntity);
  }

  async delete(id: string): Promise<void> {
    return await super.deleteData(id);
  }
}
