import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
}
export class BaseWithCreateDateEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @CreateDateColumn()
  created_at: Date;
}
export class BaseWithUpdateDateEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @UpdateDateColumn()
  updated_at: Date;
}
export class BaseWithCreateAndUpdateDateEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
