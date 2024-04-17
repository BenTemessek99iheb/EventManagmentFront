import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './pages/category/category-list/category-list.component';
import { NewCategoryComponent } from './pages/category/new-category/new-category.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EntrepriseComponent } from './pages/entreprise/entreprise.component'; 
import { EvenementComponent } from './pages/evenement/evenement.component'; 
import { CommunicationComponent } from './pages/communication/communication.component'; 
import { StageComponent } from './pages/stage/stage.component';
import { CandidatureComponent } from './pages/candidature/candidature.component'; 
import { UserprofilComponent } from './pages/userprofil/userprofil.component';
import { EvenementUserComponent } from './pages/evenement-user/evenement-user.component';
import { ParticiperEventComponent } from './participer-event/participer-event.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CancelPaymentComponent } from './cancel-payment/cancel-payment.component';
import { SuccessPaymentComponent } from './success-payment/success-payment.component';
const routes: Routes = [
  { path:'dashboard', component: DashboardComponent },
  { path:'category', component: CategoryListComponent },
  { path: '', redirectTo: 'view-category', pathMatch: 'full' }, 
  { path:'new-category', component: NewCategoryComponent },
  {path:'entreprise', component:EntrepriseComponent},
  {path:'evenement', component:EvenementComponent},
  {path:'communication',component:CommunicationComponent},
  {path:'stage',component:StageComponent},
  {path:'candidature',component:CandidatureComponent},
  {path:'userprofil',component:UserprofilComponent},
  {path:'EvenementUser',component:EvenementUserComponent },
  {path:'PartciperEvent/:eventId',component:ParticiperEventComponent },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  { path: 'cancel', component: CancelPaymentComponent },
  { path: 'success', component: SuccessPaymentComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
