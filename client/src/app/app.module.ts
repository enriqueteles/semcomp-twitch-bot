import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { LivePageComponent } from './pages/live-page/live-page.component';
import { CreateFormComponent } from './shared/components/create-form/create-form.component';
import { VoteOptionComponent } from './shared/components/vote-option/vote-option.component';

@NgModule({
  declarations: [
    AppComponent,
    EditPageComponent,
    LivePageComponent,
    VoteOptionComponent,
    CreateFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
