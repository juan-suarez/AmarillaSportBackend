// services/wompi.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Failure, Result, Success } from 'src/utils/result';
import { CardDetailsDto } from 'src/application/transaction/transaction.dto';

@Injectable()
export class   
 BankService {
  constructor(private readonly httpService: HttpService) {}
  
  async getAcceptanceToken(key: string): Promise<Result<string,string>> {
    const url = `https://api-sandbox.co.uat.wompi.dev/v1/merchants/${key}`;
    
    try {
      const response: AxiosResponse = (await this.httpService.get(url).toPromise()).data;
      return new Success(response.data.presigned_acceptance.acceptance_token);
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      return new Failure("Error fetching to bank"); 
    }
  }

  async cardTokenization(cardDetails:CardDetailsDto, key: string):Promise<Result<string,string>>{

    const url = `https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards`;
    const headers = {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    };

    try {
      const response: AxiosResponse = (await this.httpService.post(url, JSON.stringify(cardDetails), { headers }).toPromise()).data;
      
      return new Success(response.data.id);
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      return new Failure("Error fetching to bank"); 
    }
  }

  async CreateTransaction ( payload: any, key){
    const url = `https://api-sandbox.co.uat.wompi.dev/v1/transactions`;
    const headers = {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    };

    try {
      const response: AxiosResponse = (await this.httpService.post(url, JSON.stringify(payload), { headers }).toPromise()).data;
      
      return new Success(response.data);
    } catch (error) {
      //console.error('Error fetching merchant data:', error);
      return new Failure("Error fetching to bank"); 
    }
  }

  async getTransaction(ref: string, key: string){
    const url = `https://api-sandbox.co.uat.wompi.dev/v1/transactions?reference=${ref}`
    const headers = {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    };

    try {
      const response: AxiosResponse = (await this.httpService.get(url, {headers}).toPromise()).data;
      return new Success(response.data);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      return new Failure("Error fetching to bank"); 
    }
  }

}