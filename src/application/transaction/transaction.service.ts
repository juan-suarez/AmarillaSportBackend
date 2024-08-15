import { Injectable } from '@nestjs/common';
import { Failure, Result, Success } from 'src/utils/result';
import { CreateTransactionDto } from 'src/application/transaction/transaction.dto';
import { TransactionService } from 'src/domain/transaction/transaction.service';
import { BankService } from 'src/infraestructure/adapters/gateways/bank.service';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { CustomerService } from 'src/domain/customer/customer.service';
import { Customer } from 'src/domain/customer/customer.entity';
import { paymentService } from 'src/domain/payment/payment.service';
import { productService } from 'src/domain/product/product.service';
import { TransactionDetailService } from 'src/domain/transaction-details/transaction-detail.service';
import { OrderService } from 'src/domain/order/order.service';
import { CustomerDto } from 'src/domain/customer/customer.dto';
import { Product } from 'src/domain/product/product.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { TransactionDto } from 'src/domain/transaction/transaction.dto';

@Injectable()
export class TransactionOrchestrator {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly bankService: BankService,
    private readonly customerService:CustomerService,
    private readonly paymentService:paymentService,
    private readonly productsService: productService,
    private readonly transactionDetailService: TransactionDetailService,
    private readonly orderService : OrderService
  ) { }
  // this shoul de be handled with aws secrets
  readonly publicAccesKey :string = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7" 
  readonly privateAccesKey : string = "prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg"
  readonly integrityKey : string = "stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp"

  async createTransaction(payload: CreateTransactionDto, email:string): Promise<Result<any,string>> {

    const { 
      shopping_cart_prodcuts: shoppingCartProdcuts,
      card_details: cardDetails,
      shipping_address_details: shippingAddressDetails,
      base_fee: baseFee,
      delivery_fee: deliveryFee,
      total_amount: totalAmount
     } = payload

    const productIds = shoppingCartProdcuts.map(product => product.id);
    const products = await this.productsService.findProductsByIds(productIds,true);
    if(products.isFailure()){
      return new Failure(products.error);
    }
    const isStockAvialable = products.value.some((product,index) => product.stock >= shoppingCartProdcuts[index].quantity)
    if( !isStockAvialable){
      return new Failure("Stock unavailable")
    }

    const acceptanceToken = await this.bankService.getAcceptanceToken(this.publicAccesKey)
    if(acceptanceToken.isFailure()){
        return new Failure(acceptanceToken.error)
    }

    const CardToken = await this.bankService.cardTokenization( cardDetails,this.publicAccesKey)
    if(CardToken.isFailure()){
        return new Failure(CardToken.error)
    }
    const transactionNumber = uuid()
    const unsignedSignature = transactionNumber + totalAmount + 'COP' + this.integrityKey
    const signature = crypto.createHash('sha256').update(unsignedSignature).digest('hex')
    const bankCreateTransactionPayload = {
      acceptance_token: acceptanceToken.value,
      amount_in_cents: totalAmount,
      currency: "COP",
      customer_email: "testing@mail.com",
      payment_method: {
        type: "CARD",
        token: CardToken.value,
        installments: payload.installments
      },
      reference: transactionNumber,
      shipping_address : {
        address_line_1: shippingAddressDetails.address_line_1,
        address_line_2: shippingAddressDetails.address_line_2,
        country: shippingAddressDetails.country,
        region: shippingAddressDetails.region,
        city: shippingAddressDetails.city,
        name: shippingAddressDetails.name,
        postal_code: shippingAddressDetails.postal_code,
        phone_number: shippingAddressDetails.phone_number

      },
      signature,
    }

    const bankTransaction = await this.bankService.CreateTransaction(bankCreateTransactionPayload,this.privateAccesKey);
    if(bankTransaction.isFailure()){
      return new Failure(bankTransaction.error)
    }

    const customer = await this.customerService.getCustomerByEmail(email,true)
    if(customer.isFailure()){
      return new Failure(customer.error);
    }

    const transactionPayload = {
      transactionNumber: uuid(),
      baseFee: baseFee,
      deliveryFee: deliveryFee,
      totalAmount: totalAmount,
      customer: customer.value as Customer,
      status: "PENDING"
    } 

    const transaction = await this.transactionService.createTransaction(transactionPayload, true)
    if(transaction.isFailure()){
      return new Failure(transaction.error)
    }
    
    const quantities = shoppingCartProdcuts.map(product => product.quantity);
    const transactionDetails = await this.transactionDetailService.createTransactionDetails(products.value as Product[],transaction.value as Transaction,quantities)
    if(transactionDetails.isFailure()){
      return new Failure(transactionDetails.error);
    }

    const paymentPayload = {
      paymentMethod: "CARD",
      status: "PENDING",
      transaction: transaction.value,
      bankTransactionNumber: bankTransaction.value.id
    }

    const payment = await this.paymentService.createPayment(paymentPayload)
    if(payment.isFailure()){
      return new Failure(payment.error)
    }

    const transactionValue = transaction.value as Transaction
    return new Success({transaction_number: transactionValue.transaction_number})
  }

  async confirmTransaction(ref , status):Promise<Result<string,string>>{
    const transaction = await this.transactionService.updateTransactionStatus(ref,status)
    if(transaction.isFailure()){
      return new Failure(transaction.error)
    }
    const updatedPayment = await this.paymentService.updatePaymentStatus(transaction.value.payments[0],status)
    if(updatedPayment.isFailure()){
      return new Failure(updatedPayment.error)
    }
    if(status === "APPROVED"){

      const customer = transaction.value.customer;
      const transactionDetails = transaction.value.transactionDetails
      const order = await this.orderService.createOrder(customer,transactionDetails)
      if(order.isFailure()){
        return new Failure(order.error)
      }
      const detailsInfo = transactionDetails.map(detail => {
        return {
          product: detail.product, 
          quantity: detail.quantity

        }
      })
      const updatedStock = await this.productsService.updateStock(detailsInfo)
      if(updatedStock.isFailure()){
        return new Failure(updatedStock.error)
      }

    }
    else{
      return new Failure("Unapproved bank transaction")
    }

    return new Success("Order created succesfully");
  }

  async getTransaction(ref: string){
    return await this.transactionService.getTransactionByRef(ref)
  }

}
