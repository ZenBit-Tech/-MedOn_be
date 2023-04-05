import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Speciality } from '@entities/Speciality';
import { SpecialitiesService } from './specialities.service';

@ApiTags('specialities')
@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Get()
  @ApiOperation({ summary: "Get all doctor's specialities" })
  async getAll(): Promise<Speciality[]> {
    const specialities = await this.specialitiesService.getAllSpecialities();
    if (!specialities)
      throw new NotFoundException('There are no specialities!');
    return specialities;
  }
}