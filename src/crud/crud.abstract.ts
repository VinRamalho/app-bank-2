import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
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

  async findAll(relations?: string[], select?: (keyof T)[]): Promise<T[]> {
    return await super.findDataAll(relations, select);
  }

  async findById(
    id: string,
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T | undefined> {
    return await super.findDataById(id, relations, select);
  }

  async findByField(
    field: FindOptionsWhere<T>,
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T | undefined> {
    return await super.findDataByField(field, relations, select);
  }

  async findDatasByField(
    field: FindOptionsWhere<T>,
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T[]> {
    return await super.findDatasByField(field, relations, select);
  }

  async findDataByIds(
    ids: string[],
    relations?: string[],
    select?: (keyof T)[],
  ): Promise<T[]> {
    return await super.findDataByIds(ids, relations, select);
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
