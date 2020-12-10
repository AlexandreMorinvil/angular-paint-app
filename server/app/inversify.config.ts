import { Container } from 'inversify';
import { Application } from './app';
import { DatabaseController } from './controllers/database/database.controller';
import { EmailController } from './controllers/database/email/email.controller';
import { Server } from './server';
import { DatabaseService } from './services/database/database.service';
import { EmailService } from './services/email/email.service';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    // Database
    container.bind(TYPES.DatabaseController).to(DatabaseController);
    container.bind(TYPES.DatabaseService).to(DatabaseService);

    // Email
    container.bind(TYPES.EmailController).to(EmailController);
    container.bind(TYPES.EmailService).to(EmailService);

    return container;
};
