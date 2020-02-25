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
    console.log(data);
  }

  ngOnInit(): void {
    this.checkColumns();
    // this.data = cloneDeep(this.data);
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
    console.log(this.data.element);
    this._snackBar.open("Property saved", "close", {
      duration: 2000,
    });
  };

}
