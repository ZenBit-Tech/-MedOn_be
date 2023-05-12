import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Doctor } from '@entities/Doctor';
import { Patient } from '@entities/Patient';
import { Speciality } from '@entities/Speciality';

import { AuthModule } from '@modules/auth/auth.module';
import { EmailModule } from '@modules/email/email.module';
import { UserModule } from '@modules/user/user.module';
import { SpecialitiesModule } from '@modules/specialities/specialities.module';
import { PatientsModule } from '@modules/patients/patients.module';
import { PatientNotesModule } from '@modules/patient-notes/patient-notes.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Patient, Speciality, Doctor],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EmailModule,
    UserModule,
    SpecialitiesModule,
    PatientsModule,
    PatientNotesModule,
    AppointmentsModule,
  ],
  providers: [JwtStrategy, RolesGuard],
})
export class AppModule {}
