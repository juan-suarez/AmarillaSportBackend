import { Inject } from "@nestjs/common";
import { CustomerService } from "src/domain/customer/customer.service";
import { LoginDto } from "./adapters/controllers/auth/auth.dto";
import { Failure } from "src/utils/result";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt  from 'bcrypt'


export class AuthService{
    constructor(
        @Inject()private readonly customerService: CustomerService,
        private readonly jwtService:JwtService, 
    ){}

    async login( {email, password } : LoginDto){
        const fetchedCustomer = await this.customerService.getCustomerByEmail(email);

        if(fetchedCustomer.isFailure()){
            return new Failure("customer not found")
        }
        const customer = fetchedCustomer.value
        const passwordsAreNotEqual  = await bcrypt.compare( password, customer.password )
        if(passwordsAreNotEqual){
            return new Failure("Incorrect password")
        }

        const payload = {
            id: customer.id,
            firstName:customer.first_name,
            lastName: customer.last_name,
            email: customer.email
        }

        return this.jwtService.signAsync(
            payload,
            {
                secret: "secreto",
                expiresIn: "60m"
            }
        )
    }
}
