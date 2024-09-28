import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    surname?: string;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;
  
    @IsString()
    @IsOptional()
    phone?: string;
  
    @IsString()
    @IsOptional()
    district?: string;
  
    @IsString()
    @IsOptional()
    role?: string;
  }