import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtservice: JwtService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest()
            const payload = await this.jwtservice.verifyAsync(request.cookies.accessToken,{
                secret: "secreto",
            })

            request['user'] = payload
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException();
        }

        return true;
    }
}