import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestDescription, DescriptionType } from 'src/app/interface/backend-request-type';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BackendConnectService {

  constructor(
    private http: HttpClient
  ) { }

  public create(description: RequestDescription): Observable<string> {
    const requestDescription: RequestDescription = this.getRequestDescription(description);
    return this.http.post<any>(`${requestDescription.endpoint}`, requestDescription.bodyDescription);
  }

  public get(description: RequestDescription): Observable<any> {
    const requestDescription: RequestDescription = this.getRequestDescription(description);
    const params: HttpParams = requestDescription.params;
    return this.http.get<any>(`${requestDescription.endpoint}`, {params: params});
  }

  public update(description: RequestDescription): Observable<any> {
    const requestDescription: RequestDescription = this.getRequestDescription(description);
    return this.http.patch<any>(`${requestDescription.endpoint}/${requestDescription.id}`, requestDescription.bodyDescription);
  }
  public delete(description: RequestDescription): Observable<any> {
    const requestDescription: RequestDescription = this.getRequestDescription(description);
    return this.http.delete<any>(`${requestDescription.endpoint}/${requestDescription.id}`);
  }

  private getRequestDescription(description: RequestDescription): RequestDescription {
    return {
      endpoint: `http://localhost:3000/api/${description.endpoint}`,
      bodyDescription: description.bodyDescription,
      id: description.id,
      params: description.params
    };
  }
}
