import { Injectable } from '@nestjs/common';
import { Failure, Result, Success } from 'src/utils/result';
import { CreateTransactionDto, shippingAddressDetailsDto, TransactionDto } from 'src/application/transaction/transaction.dto';
import { TransactionService } from 'src/domain/transaction/transaction.service';
import { BankService } from 'src/infraestructure/adapters/gateways/bank.service';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { CustomerDto } from '../customer/create-customer.dto';
import { CustomerService } from 'src/domain/customer/customer.service';
import { Customer } from 'src/domain/customer/customer.entity';
import { paymentService } from 'src/domain/payment/payment.service';
import { PaymentDto } from '../payment/payment.dto';
import { productService } from 'src/domain/product/product.service';
import { TransactionDetail } from 'src/domain/transaction/transaction-detail.entity';
import { TransactionDetailService } from 'src/domain/transaction/transaction-detail.service';


@Injectable()
export class TransactionOrchestrator {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly bankService: BankService,
    private readonly customerService:CustomerService,
    private readonly paymentService:paymentService,
    private readonly productsService: productService,
    private readonly transactionDetailService: TransactionDetailService
  ) { }
  // this shoul de be handled with aws secrets
  readonly publicAccesKey :string = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7" 
  readonly privateAccesKey : string = "prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg"
  readonly integrityKey : string = "stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp"

  async createTransaction(payload: CreateTransactionDto, userID: string, email:string): Promise<Result<any,string>> {
    const acceptanceToken = await this.bankService.getAcceptanceToken(this.publicAccesKey)
    if(acceptanceToken.isFailure()){
        return new Failure("Error fetching acceptacion token")
    }

    const CardToken = await this.bankService.cardTokenization(payload.cardDetails,this.publicAccesKey)
    if(CardToken.isFailure()){
        return new Failure("Error fetching card token")
    }
    const transactionNumber = uuid()
    const unsignedSignature = transactionNumber + payload.totalAmount + 'COP' + this.integrityKey
    const signature = crypto.createHash('sha256').update(unsignedSignature).digest('hex')
    const bankCreateTransactionPayload = {
      acceptance_token: acceptanceToken.value,
      amount_in_cents: payload.totalAmount,
      currency: "COP",
      customer_email: "testing@mail.com",
      payment_method: {
        type: "CARD",
        token: CardToken.value,
        installments: payload.installments
      },
      reference: transactionNumber,
      shipping_address : {
        address_line_1: payload.shippingAddressDetails.address_line_1,
        address_line_2: payload.shippingAddressDetails.address_line_2,
        country: payload.shippingAddressDetails.country,
        region: payload.shippingAddressDetails.region,
        city: payload.shippingAddressDetails.city,
        name: payload.shippingAddressDetails.name,
        postal_code: payload.shippingAddressDetails.postal_code,
        phone_number: payload.shippingAddressDetails.phone_number

      },
      signature,
    }

    const bankTransaction = await this.bankService.CreateTransaction(bankCreateTransactionPayload,this.privateAccesKey);
    if(bankTransaction.isFailure()){
      return new Failure("Error with bank transaction")
    }

    const customer = (await this.customerService.getCustomerByEmail(email)) as Success<Customer>
    const transactionPayload: TransactionDto = {
      transactionNumber,
      baseFee: payload.baseFee,
      deliveryFee: payload.deliveryFee,
      totalAmount: payload.totalAmount,
      customer: customer.value,
      status: "PENDING"
    } 

    const transaction = await this.transactionService.createTransaction(transactionPayload)
    if(transaction.isFailure()){
      return new Failure("Error creating transaction")
    }
    const productIds = payload.shoppingCartProdcuts.map(product => product.id);
    const products = await this.productsService.findProductsByIds(productIds);
    if(products.isFailure()){
      return new Failure("Error Finding products");
    }
    
    const quantities = payload.shoppingCartProdcuts.map(product => product.quantity);
    const transactionDetails = await this.transactionDetailService.createTransactionDetails(products.value,transaction.value,quantities)
    if(transactionDetails.isFailure()){
      return new Failure("Error Creating transaction details");
    }

    const paymentPayload: PaymentDto = {
      paymentMethod: "CARD",
      status: "PENDING",
      transaction: transaction.value,
      bankTransactionNumber: bankTransaction.value.id
    }

    const payment = await this.paymentService.createPayment(paymentPayload)
    if(payment.isFailure()){
      return new Failure("Error creating payment")
    }

    const bankTransactionResponse = await this.bankService.getTransaction(transactionNumber,this.privateAccesKey);
    if(bankTransactionResponse.isFailure()){
      return new Failure("Error fetching bank transaction response")
    }

    return new Success({transaction_id: transaction.value.id})
  }

  async confirmTransaction({ ref, status}){
    const transaction = await this.transactionService.updateTransactionStatus(ref,status)
    if(transaction.isFailure()){
      return new Failure("transaction not found")
    }

    const payment = await this.paymentService.updatePaymentStatus((await transaction.value).payment,status)
    if(payment.isFailure()){
      return new Failure("payment not found")
    }
  }

  

}
