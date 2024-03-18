import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Multi-Asset Wallet API",
      version,
      description: "API documentation for the Multi-Asset Wallet application",
    },
    servers: [
      {
        url: "http://localhost:8002", // Update with your server URL
      },
    ],
    components: {
      securitySchemes: {
        "wallet-x-key": {
          type: "apiKey",
          in: "header",
          name: "wallet-x-key",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/schema/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export function initSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
