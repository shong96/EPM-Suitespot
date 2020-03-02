import { Collection, Database, Datastore } from '../datastore/datastore';
import { Property } from './property.model';

export class PropertyDAO {

  constructor(
    private db: Database = Datastore.getDB()
  ) { }

  public async insert(property: Property): Promise<string> {
    const result = await this.propertyCollection().insert(property);
    return result._id;
  }

  public async query(query?: any, offset?: number, limit?: number): Promise<Property[]> {
    const properties = await this.propertyCollection().find(query);
    return properties;
    // return properties.slice(offset, offset + limit);
  }

  public async getProperty(id: string): Promise<Property> {
    const result = await this.propertyCollection().findById(id);
    return result;
  }

  public async updateProperty(property: Property): Promise<string> {
    const result = await this.propertyCollection().update(property).catch();
    return result._id;
  }

  public async deleteProperty(id: string): Promise<string> {
    const result = await this.propertyCollection().remove(id);
    return id;
  }

  public clearAll() {
    return this.propertyCollection().destroy();
  }

  private propertyCollection(): Collection<Property> {
    return this.db.collection('properties');
  }

}
