import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
  };
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        id: '2b9e4e3c-7a43-4b71-a545-92ad3c42df31',
        name: 'Enrique Custodio',
        email: 'enrique@test.com',
        createdAt: '2026-05-22T13:00:00.000Z',
        updatedAt: '2026-05-22T13:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email is already registered' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '2b9e4e3c-7a43-4b71-a545-92ad3c42df31',
          name: 'Enrique Custodio',
          email: 'enrique@test.com',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile',
    schema: {
      example: {
        id: '2b9e4e3c-7a43-4b71-a545-92ad3c42df31',
        name: 'Enrique Custodio',
        email: 'enrique@test.com',
        createdAt: '2026-05-22T13:00:00.000Z',
        updatedAt: '2026-05-22T13:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user.sub);
  }
}
