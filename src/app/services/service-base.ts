import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export default class ServiceBase {
  protected handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Error:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    
    return throwError(() => error.message);
  }
} 