import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APIConfig } from '../api.config';

const PROPERTIES_PATH = `${APIConfig.BASE_API_PATH}/api/properties`;

export interface Unit {
  number: string;
  floor: number;
  rent: number;
  vacant?: boolean;
}

export interface Property {
  _id?: string; // Assigned automatically by datastore
  name: string;
  address: string;
  units: Unit[];
}


@Injectable()
export class PropertyService {

  constructor(
    private http: HttpClient
  ) { }

  public createProperty(body: Property): Observable<string> {
    return this.http.post<string>(PROPERTIES_PATH, body);
  }

  public getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(PROPERTIES_PATH);
  }

  public updateProperty(id: string, body: Property): Observable<string> {
    return this.http.patch<string>(`${PROPERTIES_PATH}/${id}`,body);
  }
  public deleteProperty(id: string): Observable<string> {
    return this.http.delete<string>(`${PROPERTIES_PATH}/${id}`);
  }
}
