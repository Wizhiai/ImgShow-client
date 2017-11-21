import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }     from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { ShowComponent, AddImageDialog } from './show.component';

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule, MatCheckboxModule, MatIconModule, MatTooltipModule, MatInputModule, MatButtonModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ShowComponent,
    AddImageDialog
  ],
  entryComponents: [
    AddImageDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    //material
    MatGridListModule, MatCheckboxModule, MatIconModule, MatTooltipModule, MatInputModule, MatButtonModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
