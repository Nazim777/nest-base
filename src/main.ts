import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterCeptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule,{
    logger:['warn','error','fatal','verbose','log']
  });
  // global validation
app.useGlobalPipes(
  new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
    disableErrorMessages:false
  })
)
app.useGlobalInterceptors(new LoggingInterCeptor)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
