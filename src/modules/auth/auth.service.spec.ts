import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Doctor } from '@entities/Doctor';
import { Role } from '@common/enums/Role';
import { AuthService } from '@modules/auth/auth.service';
import { EmailService } from '@modules/email/email.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockDoctorRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => dto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        EmailService,
        { provide: getRepositoryToken(Doctor), useValue: mockDoctorRepo },
        {
          provide: JwtService,
          useValue: createMock<JwtService>({
            signAsync: async () => 'test_token',
          }),
        },
        { provide: MailerService, useValue: createMock<MailerService>() },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: () => 'mock_config_data',
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should send confirmation link to the doctor', async () => {
    const dto = {
      firstName: 'Alex',
      lastName: 'Belman',
      email: 'fakemail@gmail.com',
      password: 'fakepass',
      city: 'Kiev',
      country: 'Ukraine',
      dateOfBirth: new Date('1985-05-28'),
      role: Role.LocalDoctor,
      timeZone: 'Europe/Paris',
      specialityId: 1,
    };

    expect(await service.signup(dto)).toEqual(
      'mock_config_data/login?token=test_token',
    );
  });
});
