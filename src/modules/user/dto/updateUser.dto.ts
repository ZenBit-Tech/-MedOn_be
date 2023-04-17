import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: "Current doctor's password",
    example: 'TyuiOp123!',
  })
  @MinLength(6)
  @IsString()
  @Matches(/(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!',
  })
  currentPassword: string;

  @ApiProperty({
    description: "New doctor's password",
    example: 'TyuiOp123!',
  })
  @MinLength(6)
  @IsString()
  @Matches(/(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!',
  })
  newPassword: string;
}
