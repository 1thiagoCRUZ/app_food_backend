import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Put, Param, Request, UseGuards } from '@nestjs/common';
import { CourierFacade } from '../../application/courier.facade';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateCourierProfileDto } from '../dtos/update-courier-profile.dto';

@ApiTags('Couriers')
@ApiBearerAuth()
@Controller('couriers')
@UseGuards(JwtAuthGuard)
export class CourierController {
  constructor(private readonly courierFacade: CourierFacade) {}

  @Patch('me/status')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Request() req, @Body('isOnline') isOnline: boolean) {
    const userId = req.user.id;
    const courier = await this.courierFacade.toggleOnlineStatus(userId, isOnline);
    return {
      message: 'Status updated successfully',
      isOnline: courier.getIsOnline(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os entregadores (Admin)' })
  async listAll() {
    return this.courierFacade.listAll();
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar perfil do entregador (CNH e Placa)' })
  async updateProfile(@Request() req, @Body() dto: UpdateCourierProfileDto) {
    const userId = req.user.id;
    await this.courierFacade.updateProfile(userId, dto);
    return { message: 'Perfil do entregador atualizado com sucesso' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Consultar o próprio perfil do entregador e total de entregas' })
  async getMyProfile(@Request() req) {
    const userId = req.user.id;
    return this.courierFacade.getProfile(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar perfil de um entregador específico' })
  async getProfile(@Param('id') id: string) {
    return this.courierFacade.getProfile(Number(id));
  }
}
