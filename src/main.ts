import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cors from 'cors'
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as fs from 'fs';
import * as morgan from 'morgan';

const logStream = fs.createWriteStream('api.log', {
    flags: 'a'
});
async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, { cors: true });
    const configService = app.get(ConfigService);

    const config = new DocumentBuilder()
        .setTitle('Auto Got')
        .setDescription('REST api documentation')
        .addBearerAuth()
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.use(morgan('combined', {stream: logStream}))
    app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 63158411826 },
    }));

    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
