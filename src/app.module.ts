import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true ,
      cache : true
    }),
    MongooseModule.forRootAsync({
      imports : [ConfigModule],
      useFactory : (configService : ConfigService) => ({
        uri : configService.get('MONGODB_URI') as string
      }),
      inject : [ConfigService]
    }),
    JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : (configService : ConfigService) => ({
        secret : configService.get('JWT_SECRET') as string,
      }),
      global : true,
      inject : [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports : [ConfigModule],
      useFactory : (configService : ConfigService) => ({
        transport : {
          service : 'gmail',
          auth : {
            user : configService.get('GMAIL_AUTH_USER') as string,
            pass : configService.get('GMAIL_AUTH_PASS') as string
          }
        }
      }),
      inject : [ConfigService]
    }),
    AuthModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*')
  }
}
