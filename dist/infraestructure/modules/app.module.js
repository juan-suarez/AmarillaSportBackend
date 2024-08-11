"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("../../adapters/controllers/app.controller");
const app_service_1 = require("../../application/services/app.service");
const customer_entity_1 = require("../../domain/entities/customer.entity");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const product_entity_1 = require("../../domain/entities/product.entity");
const transaction_detail_entity_1 = require("../../domain/entities/transaction-detail.entity");
const typeorm_2 = require("typeorm");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST || 'localhost',
                port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
                username: process.env.POSTGRES_USER || 'user',
                password: process.env.POSTGRES_PASSWORD || 'password',
                database: process.env.POSTGRES_DB || 'app',
                entities: [
                    typeorm_2.Transaction,
                    customer_entity_1.Customer,
                    product_entity_1.Product,
                    transaction_detail_entity_1.TransactionDetails,
                    payment_entity_1.Payment,
                ],
                synchronize: true,
                logging: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([
                typeorm_2.Transaction,
                customer_entity_1.Customer,
                product_entity_1.Product,
                transaction_detail_entity_1.TransactionDetails,
                payment_entity_1.Payment,
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map