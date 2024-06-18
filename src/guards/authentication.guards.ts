import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService : JwtService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest()
        const accessToken = req.headers.authorization as string;

        if(!accessToken) throw new UnauthorizedException();
        
        const { id } = this.validAccessToken(accessToken.split(' ')[1]);
        req.userId = id;

        return true;
    };

    validAccessToken(token : string){
        try{
            const valid = this.jwtService.verify(token);
            if(!valid) throw new UnauthorizedException()
            
            return this.jwtService.decode(token)    
        }catch(e){
            throw new UnauthorizedException()
        }
    }
}