import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DataStatus {
  NONE = 0,
  DRAFT = 1,
  ENABLED = 2,
  DISABLED = 3,
  ARCHIVED = 4,
  BLOCKED = 5,
  OBSOLETE = 6,
  ERROR = 99,
}

export abstract class DataModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.DRAFT })
  status: DataStatus;

  @Column({ name: 'created_at', type: 'bigint' })
  @CreateDateColumn()
  createdAtMs: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: true })
  @UpdateDateColumn()
  updatedAtMs?: number;

  get createdAt(): Date {
    return new Date(this.createdAtMs);
  }

  set createdAt(value: Date) {
    this.createdAtMs = value.getTime();
  }

  get updatedAt(): Date | undefined {
    return this.updatedAtMs !== undefined
      ? new Date(this.updatedAtMs)
      : undefined;
  }

  set updatedAt(value: Date | undefined) {
    this.updatedAtMs = value ? value.getTime() : undefined;
  }
}
