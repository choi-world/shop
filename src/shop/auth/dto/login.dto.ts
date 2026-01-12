import { IsOptional, IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';

export class LoginDTO extends BaseDTO {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
