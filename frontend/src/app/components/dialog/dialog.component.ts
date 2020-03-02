import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cloneDeep, forOwn } from 'lodash';
import { ACTION_COLUMN } from 'src/app/interface/property-table';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{

  formGroup: FormGroup = new FormGroup({});
  formInvalid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.data = cloneDeep(this.data);
    this.checkColumns();
    this.getFormControls(this.data.columnDefinition.filter(column => column.key !== 'actions' && column.type !== 'table'));
  }

  getFormControls(formColumns: any) {
    forOwn(formColumns, (column: any) => {
      const control = new FormControl({value: this.data.element[column.key], disabled: this.data.op == 'Delete'});
      control.setValidators(Validators.required);
      this.formGroup.addControl(column.key, control);
    });
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
    if (this.formGroup.invalid) {
      this.formInvalid = true;
      this.scrollToError();
    } else {
      this.updateData();
      this.dialogRef.close(this.data.element);
    }
  };

  updateData(): void {
    Object.keys(this.formGroup.value).forEach((key) => {
      this.data.element[key] = this.formGroup.value[key];
    });
  }
  
  updateElement(value: string, column: any) {
    if (value && value.length > 0) {
      this.data.element[column.key] = value;
    } else {
      this.data.element[column.key] = undefined;
    }
  }

  private scrollToError(): void {
    const errorColumn = document.querySelector('input.ng-invalid,mat-select.ng-invalid') as HTMLInputElement;
    errorColumn.scrollIntoView({behavior: 'smooth'});
    errorColumn.focus();
  }
}
