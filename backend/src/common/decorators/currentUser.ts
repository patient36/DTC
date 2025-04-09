import { createParamDecorator,ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data,ctx:ExecutionContext)=>{
    const request = ctx.switchToHttp().getRequest()
    return request.user
})