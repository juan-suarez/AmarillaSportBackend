import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/infraestructure/adapters/controllers/auth/auth.controller';
import { AppModule } from 'src/infraestructure/app.module';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ], 
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
