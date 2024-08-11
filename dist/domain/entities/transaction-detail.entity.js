"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDetail = void 0;
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("./transaction.entity");
const product_entity_1 = require("./product.entity");
let TransactionDetail = class TransactionDetail {
};
exports.TransactionDetail = TransactionDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(Type => transaction_entity_1.Transaction, (transaction) => transaction.detail),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", transaction_entity_1.Transaction)
], TransactionDetail.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(Type => product_entity_1.Product, product => product.detail),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", product_entity_1.Product)
], TransactionDetail.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TransactionDetail.prototype, "created_at", void 0);
exports.TransactionDetail = TransactionDetail = __decorate([
    (0, typeorm_1.Entity)()
], TransactionDetail);
//# sourceMappingURL=transaction-detail.entity.js.map