import { Type } from "typescript"

interface ErrorMessage {
    Errors:Array<Type>
}
export interface ApiResponse {
    data:object,
    statusCode:number
    errors:ErrorMessage
}