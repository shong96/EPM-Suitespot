import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { cloneDeep } from 'lodash';

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
    if (this.data.subColumnDefinition ) {
      this.data.expandedColumns = this.data.subColumnDefinition;
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

}
