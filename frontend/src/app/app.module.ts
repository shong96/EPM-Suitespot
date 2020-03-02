import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApiClientModule } from './api/client/api-client.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { NavComponent } from './pages/nav/nav.component';
import { PropertyComponent } from './pages/property/property.component';

// Angular libraries
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatButtonModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule, MatSelect} from '@angular/material/select';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './components/table/table.component';
import { FormComponent } from './pages/form/form.component';
import { DialogComponent } from './components/dialog/dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PropertyComponent,
    TableComponent,
    FormComponent,
    DialogComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    AppRoutingModule,
    BrowserModule,
    ApiClientModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
