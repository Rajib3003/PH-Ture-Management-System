import { TGenericErrorMessage } from "../interfaces/error.types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerDuplicatedError = (error:any) : TGenericErrorMessage=>{
    const matcheArray = error.message.match(/"([^"]*)"/)
    return {
        statusCode: 400,
        message: `Duplicate value entered for ${matcheArray[1]} field, please choose another value`
    }
}