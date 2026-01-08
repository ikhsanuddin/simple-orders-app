import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Check the API health status. Returns the current status and timestamp. This endpoint does not require authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy and running.',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
