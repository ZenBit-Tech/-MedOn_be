import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';
import { Test } from '@nestjs/testing';
import { UpdateUserDto } from '@modules/user/dto/updateUser.dto';
import { UserService } from '@modules/user/user.service';

describe('UserService', () => {
  let userService: UserService;
  let doctorRepo: Repository<Doctor>;
  const mockConfigService = { get: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Doctor),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    doctorRepo = moduleRef.get<Repository<Doctor>>(getRepositoryToken(Doctor));
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const user = new Doctor();

      user.email = 'test@example.com';
      user.password = await argon.hash('oldPassword');

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(doctorRepo, 'save').mockResolvedValue(user);

      const updateDto = new UpdateUserDto();

      updateDto.currentPassword = 'oldPassword';
      updateDto.newPassword = 'newPassword';

      await userService.updatePassword({ email: user.email }, updateDto);

      expect(user.password).not.toBe('oldPassword');
      expect(await argon.verify(user.password, 'newPassword')).toBe(true);
      expect(doctorRepo.save).toHaveBeenCalledWith(user);
    });

    it('should throw an UnauthorizedException if the current password is incorrect', async () => {
      const user = new Doctor();

      user.email = 'test@example.com';
      user.password = await argon.hash('oldPassword');

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);

      const updateDto = new UpdateUserDto();

      updateDto.currentPassword = 'wrongPassword';
      updateDto.newPassword = 'newPassword';

      await expect(
        userService.updatePassword({ email: user.email }, updateDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if the user cannot be found', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockRejectedValue(new UnauthorizedException());

      const updateDto = new UpdateUserDto();

      updateDto.currentPassword = 'oldPassword';
      updateDto.newPassword = 'newPassword';

      await expect(
        userService.updatePassword(
          { email: 'nonexistent@example.com' },
          updateDto,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
