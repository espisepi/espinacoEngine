import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { Demo1Component } from '../demo1/demo1.component';
import { ThreejsComponent } from '../components/threejs/threejs.component';
import { ProcessingComponent } from '../components/processing/processing.component';
import { NebulaCloudComponent } from '../components/nebula-cloud/nebula-cloud.component';


const routes: Routes = [
  { path: 'demo1', component: Demo1Component},
  { path: 'nebulaCloud', component: NebulaCloudComponent},
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
