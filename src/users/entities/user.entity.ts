import { Entity, Column, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { DataModel } from 'src/data/entities/data.entity';
import { Account } from 'src/account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends DataModel {
  @ApiProperty()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ unique: true })
  document: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column('bigint', {
    default: 0,
    transformer: {
      to: (value: number) => Math.round(value * 100), // Converte reais para centavos antes de salvar
      from: (value: number) => value / 100, // Converte centavos para reais ao recuperar
    },
  })
  creditLimit: number; // in cents

  @ApiProperty()
  @IsNotEmpty()
  @Column()
  password: string;

  @ApiProperty({
    description: `Lista de 'roles' atribuídos ao usuário. Cada 'role' pode ter diferentes permissões associadas.
    Exemplos:
    - Role: 'admin'
      Permissões: [CREATE, READ, UPDATE, DELETE]
    - Role: 'user'
      Permissões: [CREATE, READ]`,
  })
  @IsNotEmpty()
  @Column('simple-array')
  roles: string[];

  @OneToMany(() => Account, (Account) => Account.user)
  accounts: Account[];
}
