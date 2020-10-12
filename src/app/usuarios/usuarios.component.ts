import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuario:any;
  level:string;
  nuevoUser = {user:'', nombre:'',pass:'',tipo:''};
  tmpUser = {user:'', nombre:''};
  constructor(private datos:DatosService, private router:Router, private msg:ToastrService) { }

  ngOnInit(): void {
    this.level = this.datos.getCuenta().level;
    this.llenarUsarios();
  }
  llenarUsarios(){
    this.datos.getUser().subscribe(resp => {
      this.usuario = resp;
      //console.log(resp);
    }, error => {
      console.log(error);
      if(error.status==408) this.router.navigate(['']);
    })
  }

  verUsaurio(Usario){
    this.datos.setTemaActivo(Usario.user, Usario.nombre);
    this.router.navigate(['/mensajes']);
  }

  agregarUser(){
    if(this.nuevoUser.user == '' && this.nuevoUser.nombre == '' && this.nuevoUser.pass == '' 
    && this.nuevoUser.tipo == ''){
      this.msg.error("Los campos son obligatorios");
      return;
    }
    this.datos.postUsers(this.nuevoUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let user = JSON.parse(JSON.stringify(this.nuevoUser))
        this.usuario.push(user);
        this.nuevoUser.user = '';
        this.nuevoUser.nombre = '';
        this.nuevoUser.pass = '';
        this.nuevoUser.tipo = '';
        this.msg.success("El usuario se guardo correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }

  temporalUsuario(Usuario){
    this.tmpUser = JSON.parse(JSON.stringify(Usuario));
  }

  guardarCambios(){
    this.datos.putUser(this.tmpUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.usuario.indexOf( this.usuario.find( usuario => usuario.user == this.tmpUser.user ));
        this.usuario[i].nombre = this.tmpUser.nombre;
        this.msg.success("El tema se guardo correctamente.");
      }else{
        this.msg.error("El tema no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }

  confirmarEliminar(){
    this.datos.deleteUser(this.tmpUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.usuario.indexOf( this.usuario.find( usuario => usuario.user == this.tmpUser.user ));
        this.usuario.splice(i,1);
        this.msg.success("El tema se elimino correctamente.");
      }else{
        this.msg.error("El tema no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }
}
