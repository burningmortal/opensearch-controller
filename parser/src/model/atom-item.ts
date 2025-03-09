import { IsString, MinLength } from 'class-validator';

export class AtomItem {
  constructor(data?: Partial<AtomItem>) {
    Object.assign(this, data);
  }

  @IsString()
  author!: string;

  @IsString()
  id!: string;

  @IsString()
  link!: string;

  @IsString()
  summary!: string;

  @IsString()
  title!: string;
}
