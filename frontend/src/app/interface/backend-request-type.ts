import { IPropertyDescription } from './property-type'
import { APIConfig } from '../api/client/api.config';
import { HttpParams } from '@angular/common/http';

export interface ReturnDescription {
    data: any;
}

export interface RequestDescription {
    id?: string;
    endpoint: string;
    bodyDescription: DescriptionType;
    params?: HttpParams;
}

export type DescriptionType = 
// add other types here
IPropertyDescription; 