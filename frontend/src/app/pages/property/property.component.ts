import { Component, OnInit } from '@angular/core';
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
    { key: 'units', expand: true, type: 'table'},
    { key: ACTION_COLUMN, hide: true},
  ];
  readonly expandedColumns: TableColumnDefinition[] = [
    { name: 'Number', key: 'number'},
    { name: 'Floor', key: 'floor'},
    { name: 'Rent', key: 'rent'},
    { name: 'Vacant', key: 'vacant', type: 'dropdown'}
  ];

  readonly title = 'Easy Property Management';
  readonly api = 'properties'

  constructor() { }

  ngOnInit(): void {
  }
}
