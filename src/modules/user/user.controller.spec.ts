import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { IProfileRequest } from '@common/interfaces/userProfileResponses';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from '@entities/Doctor';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { UpdateUserDto } from '@modules/user/dto/updateUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const mockConfigService = { get: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const email = 'test@example.com';
      const currentPassword = 'old_password';
      const newPassword = 'new_password';
      const dto: UpdateUserDto = {
        currentPassword,
        newPassword,
      };
      const req = { user: { email } } as unknown as IProfileRequest;

      const updatePasswordSpy = jest.spyOn(service, 'updatePassword');
      updatePasswordSpy.mockImplementation(() => Promise.resolve());

      const result = await controller.updatePassword(req, dto);

      expect(updatePasswordSpy).toHaveBeenCalledWith(
        { email },
        { currentPassword, newPassword },
      );
      expect(result).toEqual({
        statusCode: 200,
        message: 'Password was updated',
      });
    });
  });
});
