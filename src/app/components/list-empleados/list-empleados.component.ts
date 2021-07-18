import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.scss']
})
export class ListEmpleadosComponent implements OnInit {

  empleados: any[] = [];
  loading = true;

  constructor(private _empleadoService: EmpleadoService, private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados(){
    this._empleadoService.getEmpleados().subscribe( data => {
      this.empleados = [];
      data.forEach((element: any) => {
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
        this.loading = false;
      })
    })
  }

  eliminarEmpleado(id: string){
    this._empleadoService.eliminarEmpleado(id).then(() => {
     this.toastr.error('Empleado eliminado con exito!', 'Empleado Eliminado!');
    }).catch(error => {
      console.log(error);
    })
  }


}
