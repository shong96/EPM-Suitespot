import { HttpParams } from '@angular/common/http';

export interface IPropertyDescription {
    data?: Property;
    params?: HttpParams;
}

export interface Property {
    _id?: string; // Assigned automatically by datastore
    name: string;
    address: string;
    units: Unit[];
}

export interface Unit {
    number: string;
    floor: number;
    rent: number;
    vacant?: boolean;
}
