import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { cloneDeep } from 'lodash';
import { ACTION_COLUMN } from 'src/app/interface/property-table';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.data = cloneDeep(this.data);
    this.checkColumns();
  }

  checkColumns(): void {
    const actionColumn = {key: ACTION_COLUMN, hide: true};
    if (this.data.subColumnDefinition ) {
      this.data.subColumnDefinition.push(actionColumn);
      this.data.expandedColumns = this.data.subColumnDefinition;
    } else if (this.data.expandedColumns){
      this.data.expandedColumns.push(actionColumn);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this._snackBar.open(this.data.op + '!', "close", {
      duration: 2000,
    });
  };
  
  updateElement(value: string, column: any) {
    if (value && value.length > 0) {
      this.data.element[column.key] = value;
    } else {
      this.data.element[column.key] = undefined;
    }
  }
}
