import { Component, OnInit } from '@angular/core';
import { Property, PropertyService, Unit } from '../../api/client/properties/property.service';
import { TableColumnDefinition, ACTION_COLUMN } from 'src/app/interface/property-table';
import { BackendConnectService } from 'src/app/api/client/backend-connect.service';
import { DescriptionType, RequestDescription } from 'src/app/interface/backend-request-type';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  readonly columnList: TableColumnDefinition[] = [
    { name: 'Name', key: 'name'},
    { name: 'Address', key: 'address'},
    { key: 'units', expand: true, type: 'table'},
    { key: ACTION_COLUMN, hide: true},
  ];
  readonly expandedColumns: TableColumnDefinition[] = [
    { name: 'Number', key: 'number'},
    { name: 'Floor', key: 'floor'},
    { name: 'Rent', key: 'rent'},
    { name: 'Vacant', key: 'vacant', type: 'dropdown'}
    // { key: ACTION_COLUMN, hide: true},
  ];

  readonly title = 'Easy Property Management';
  readonly api = 'properties'

  constructor() { }

  ngOnInit(): void {
  }
}
