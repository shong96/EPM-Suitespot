import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { get, isEmpty } from 'lodash';
import { DialogComponent } from '../dialog/dialog.component';
import { TableColumnDefinition, ACTION_COLUMN } from '../../interface/property-table';
import { PropertyBindingType } from '@angular/compiler';
import { Property, Unit, PropertyService } from 'src/app/api/client/properties/property.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableComponent implements OnInit {

  @Input() public data: any[];
  @Input() public columns: TableColumnDefinition[];
  @Input() public expandedColumns: TableColumnDefinition[];
  @Input() public subColumns: TableColumnDefinition[];
  @Input() public expandedElement: any;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource: any;
  columnsToDisplay: string[];
  columnToExpand: string;
  objectTemplate: any;

  readonly dialogWidth: string = '600px';
  readonly actionColumn = ACTION_COLUMN;

  constructor(public dialog: MatDialog,
              public propertyService: PropertyService) {}


  ngOnInit() {
    this.columnsToDisplay = this.columns.filter((column) => !column.expand).map((column) => column.key);
    this.columnToExpand  = get(this.columns.find((column) => column.expand), 'key', '');
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setObjectTemplate();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator.firstPage();
  }

  setObjectTemplate(): void {
    if (this.expandedColumns) {
      let property: Property = {name: null, address: null, units: []};
      this.objectTemplate = property;
    } else {
      let unit: Unit = {number: null, floor: null, rent: null, vacant: null};
      this.objectTemplate = unit;
    }
  }

  openCreateDialog(): void {
    const columns = this.subColumns ? this.subColumns : this.expandedColumns;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.dialogWidth,
      data: {op: 'Create', columnDefinition: this.columns, element: this.objectTemplate, subColumnDefinition: columns}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.push(result);
        this.dataSource.data = this.data;
        if(this.instanceOfProperty(result)) {
          this.propertyService.createProperty(result).subscribe(result => {
          })
        }
      }
    });
  }

  openEditDialog($event: Event, element: any): void {
    $event.stopPropagation();
    let obj = element ? element : this.objectTemplate;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.dialogWidth,
      data: {op: 'Update', columnDefinition: this.columns, expandedColumns: this.expandedColumns, element: obj}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(this.dataSource.data);
        // console.log(result);
        const index = this.data.findIndex(row => result._id == row._id);
        console.log(this.data);
        console.log(index);
        console.log(result);
        this.data.splice(index, 1, result);
        console.log(this.data);
        this.dataSource.data = this.data;
        if(this.instanceOfProperty(result)) {
          this.propertyService.updateProperty(result._id, result).subscribe(result => {
          })
        }
      }
    });
  }

  openDeleteDialog($event: Event, element: any): void {
    $event.stopPropagation();
    let expandedColumns = this.expandedColumns;
    if (this.expandedColumns) {
      expandedColumns = this.expandedColumns.filter((col) => !col.hide);
    };
    const dialogRef = this.dialog.open(DialogComponent, {
      width: this.dialogWidth,
      data: {op: 'Delete', columnDefinition: this.columns, expandedColumns: expandedColumns, element}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        if(this.instanceOfProperty(result)) {
          this.propertyService.deleteProperty(result._id).subscribe(response => {
            this.data.filter((row) => row._id !== result._id);
            this.dataSource.data = this.data;
          });
        } else {
          this.data = this.data.filter((row) => !this.compareUnits(row, result));
          this.dataSource.data = this.data;
          console.log(this.dataSource.data);
        }
      }
    });
  }

  private instanceOfProperty(object: any): object is Property {
    return 'name' in object;
  }

  private compareUnits(u1: Unit, u2: Unit) {
    let bool: boolean = true;
    Object.keys(u1).forEach((key) => {
      if (u1[key]!==u2[key]) bool = false;
    });
    return bool;
  }
}
