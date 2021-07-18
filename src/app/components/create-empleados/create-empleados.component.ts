import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-empleados',
  templateUrl: './create-empleados.component.html',
  styleUrls: ['./create-empleados.component.scss']
})
export class CreateEmpleadosComponent implements OnInit {

  createEmpleado: FormGroup;
  submited = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';

  constructor(private fb: FormBuilder, private _empleadoService: EmpleadoService,
              private router: Router, private toastr: ToastrService,
              private aRoute: ActivatedRoute) { 
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required]
    })

    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);

  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarEmpleado(){
    this.submited = true;

    if(this.createEmpleado.invalid){
      return;
    }

    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }

    
  }

  agregarEmpleado(){

    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }

    this.loading = true;

    this._empleadoService.agregarEmpleado(empleado).then( () => {
      console.log('Empleado registrado con exito!');
      this.toastr.success('Empleado registrado con exito!', 'Empleado Registrado');

      this.loading = false;
      this.router.navigate(['/list-empleados']);

    }).catch( error => {
      console.log(error);
      this.loading = false;
    })

  }

  esEditar(){
    this.titulo = 'Editar Empleado'
    if(this.id !== null){
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe( (data: any) => {
        this.loading = false;
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        })
      })
    }else{
      this.titulo = 'Agregar Empleado';
    }
  }


  editarEmpleado(id: string){
    
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date(),
    }

    this.loading = true;

    this._empleadoService.actualizarEmpleado(id, empleado).then( () => {
      this.loading = false;
      this.toastr.info('Empleado modificado con exito!', 'Empleado Modificado');
      this.router.navigate(['/list-empleados']);
    })

  }

}
