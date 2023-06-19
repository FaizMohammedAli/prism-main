import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { GeneratedTextComponent } from './generated-text/generated-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenerateEpicComponent } from './generate-epic/generate-epic.component';
import { AuthGuard } from './auth.guard';

const routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'generatebacklogs',
    component: GenerateEpicComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'log-in',
    loadChildren: () =>
      import('./pages/log-in/log-in.module').then((m) => m.LogInModule),
  },
]

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, HeaderComponent, LoaderComponent, GeneratedTextComponent, GenerateEpicComponent],
  imports: [BrowserModule, ReactiveFormsModule, RouterModule.forRoot(routes), ComponentsModule, NgbModule, HttpClientModule, FormsModule],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
