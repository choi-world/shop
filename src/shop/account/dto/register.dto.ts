import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';

export class RegisterDTO extends BaseDTO {
  @IsString()
  @IsOptional()
  socialId?: string;

  @IsString()
  username: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  type: string;

  @IsString()
  birthday: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  gender: boolean;

  @IsString()
  @IsOptional()
  accountName?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
