import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/infraestructure/adapters/controllers/app.controller';
import { AppService } from 'src/infraestructure/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('app is healthy!');
    });
  });
});
