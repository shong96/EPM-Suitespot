import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, PageEvent, Sort, MatSnackBar } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { get } from 'lodash';
import { DialogComponent } from '../dialog/dialog.component';
import { TableColumnDefinition, ACTION_COLUMN } from '../../interface/property-table';
import { Property, Unit } from 'src/app/api/client/properties/property.service';
import { DescriptionType, RequestDescription } from 'src/app/interface/backend-request-type';
import { BackendConnectService } from 'src/app/api/client/backend-connect.service';
import { HttpParams } from '@angular/common/http';

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

  @Input() public title: string;
  @Input() public api: string;
  @Input() public data: any[];
  @Input() public columns: TableColumnDefinition[];
  @Input() public expandedColumns: TableColumnDefinition[];
  @Input() public subColumns: TableColumnDefinition[];
  @Input() public expandedElement: any;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplay: string[];
  columnToExpand: string;
  objectTemplate: any;
  pageEvent: PageEvent;
  params = new HttpParams();
  pageSize: number = 10;

  readonly dialogWidth: string = '700px';
  readonly actionColumn = ACTION_COLUMN;

  constructor(public dialog: MatDialog,
              public dataService: BackendConnectService,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (!this.data) {
      // this.dataSource.sort.sortChange.subscribe((sort: Sort) => {
      //   this.sortData(sort);
      // });
      // this.dataSource.paginator.page.subscribe((page: PageEvent) => {
      //   this.pageData(page);
      // });
      // this.params = this.params.set('offset', '0').set('limit', this.pageSize.toString());
      const description: DescriptionType = {params: this.params};
      this.dataService.get(this.getRequestDescription(description)).subscribe(results => {
        this.data = results;
        this.dataSource.data = this.data;
      });
    } else {
      this.dataSource.data = this.data;
    }
    this.columnsToDisplay = this.columns.filter((column) => !column.expand).map((column) => column.key);
    this.columnToExpand  = get(this.columns.find((column) => column.expand), 'key', '');
    this.setObjectTemplate();
  }

  sortData($event: Sort) {
  }
  
  pageData($event: PageEvent) {
    this.pageSize = $event.pageSize;
    // const offset = ($event.pageIndex * this.pageSize).toString();
    // this.params = this.params.set('offset', offset).set('limit', this.pageSize.toString());
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
          const description: DescriptionType = {data: result};
          const requestDescription: RequestDescription = this.getRequestDescription(description);
          this.dataService.create(requestDescription).subscribe(result => {
            this.openNotification('Created');
          });
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
        if(this.instanceOfProperty(result)) {
          const description: DescriptionType = {data: result};
          const requestDescription: RequestDescription = this.getRequestDescription(description);
          this.dataService.update(requestDescription).subscribe(res => {
            this.openNotification('Updated');
          });
        }
        const index = this.dataSource.filteredData.indexOf(element);
        this.data.splice(index, 1, result);
        this.dataSource.data = this.data;
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
        if(this.instanceOfProperty(result)) {
          const description: DescriptionType = {data: result};
          const requestDescription: RequestDescription = this.getRequestDescription(description);
          this.dataService.delete(requestDescription).subscribe(response => {
            this.openNotification('Deleted');
          });
        }
        const index = this.dataSource.filteredData.indexOf(element);
        this.data.splice(index, 1);
        this.dataSource.data = this.data;
      }
    });
  }
  
  private openNotification(action: string): void {
    this._snackBar.open(action + '!', "close", {
      duration: 2000,
    });
  }

  private getRequestDescription(description: DescriptionType): RequestDescription {
    const id: string = description.data ? description.data._id : undefined;
    const params: HttpParams = description.params ? description.params : undefined;
    return {
      id: id,
      endpoint: this.api,
      bodyDescription: description,
      params: params
    };
  }

  private instanceOfProperty(object: any): object is Property {
    return 'name' in object;
  }
}
