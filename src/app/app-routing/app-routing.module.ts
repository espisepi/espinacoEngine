import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { Demo1Component } from '../demo1/demo1.component';
import { ThreejsComponent } from '../components/threejs/threejs.component';
import { ProcessingComponent } from '../components/processing/processing.component';


const routes: Routes = [
  { path: 'demo1', component: Demo1Component},
  { path: 'threejs', component: ThreejsComponent },
  { path: 'processing', component: ProcessingComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

  // exportamos el RouterModule para indicar a nuestro modulo que tiene una dependencia de ese modulo
})
export class AppRoutingModule { }
