import { PropertyDAO } from './property.dao';
import { Property } from './property.model';

export class PropertyService {

  constructor(
    private dao = new PropertyDAO()
  ) { }

  public listProperties(query?: any, offset?: number, limit?: number): Promise<Property[]> {
    return this.dao.query({}, offset, limit);
  }

  public createProperty(property: Property): Promise<string> {
    return this.dao.insert(property);
  }

  public getProperty(id: string): Promise<Property> {
    return this.dao.getProperty(id);
  }

  public updateProperty(property: Property): Promise<string> {
    return this.dao.updateProperty(property);
  }
 
  public deleteProperty(id: string): Promise<string> {
    return this.dao.deleteProperty(id);
  }
}
