import { Component, OnInit } from '@angular/core';
import { Property, PropertyService, Unit } from '../../api/client/properties/property.service';
import { TableColumnDefinition, ACTION_COLUMN } from 'src/app/interface/property-table';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  readonly columnList: TableColumnDefinition[] = [
    { name: 'Name', key: 'name'},
    { name: 'Address', key: 'address'},
    { key: 'units', expand: true, type: 'dropdown'},
    { key: ACTION_COLUMN, hide: true},
  ];
  readonly expandedColumns: TableColumnDefinition[] = [
    { name: 'Number', key: 'number'},
    { name: 'Floor', key: 'floor'},
    { name: 'Rent', key: 'rent'},
    { name: 'Vacant', key: 'vacant'}
    // { key: ACTION_COLUMN, hide: true},
  ];

  title = 'Easy Property Management';
  properties: Property[];

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getAllProperties().subscribe(properties => {
      this.properties = properties;
    });
  }
}
