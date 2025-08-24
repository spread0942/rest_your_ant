import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API docs using Swagger in Express + TypeScript',
        },
    },
    apis: [path.join(__dirname, '../routes/*.{ts,js}')],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
    console.log('✅ Swagger route registered at /api-docs');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
