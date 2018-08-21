import { Injectable } from '@angular/core';

import { ScanData } from "../models/scan-data.model";

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName   } from '@ionic-native/contacts';



import { ModalController, Platform, ToastController } from "ionic-angular";
import { MapaPage } from "../pages/mapa/mapa";
import { EmailComposer } from '@ionic-native/email-composer';



@Injectable()


export class HistorialService {
  to: string;
  sub:string;
  body:string;

  private _historial:ScanData[] = [];


  constructor( private iab: InAppBrowser,
               private modalCtrl: ModalController,
               private contacts: Contacts,
               private platform:Platform,
               private toastCtrl:ToastController,
               private emailComposer: EmailComposer) { }


  agregar_historial( texto:string ){

    let data = new ScanData( texto );



    this._historial.unshift( data );

    console.table( this._historial );

    //this.abrir_scan(0);


  }


  abrir_scan( index:number){

    let scanData = this._historial[index];
    console.log( scanData );

    switch( scanData.tipo ){

      case "http":
        this.iab.create( scanData.info, "_system" );

      break;

      case "mapa":

        this.modalCtrl.create( MapaPage, { coords: scanData.info })
            .present();

      break;

      case "contacto":

          this.crear_contacto(  scanData.info );

      break;

      case "email":
    
        this.send(scanData.info);
      break;

      default:
        console.error("Tipo no soportado");

    }


  }

  private send(texto:string){
    
    let direccion = texto.split(";");

      this.to = direccion[0].replace("MATMSG:TO:","");
      this.sub = direccion[1].replace("SUB:","");
      this.body = direccion[2].replace("BODY:","");
    
    this.iab.create("mailto:"+this.to+"?subject="+this.sub+"&body="+this.body, "_system");
  }
  private crear_contacto( texto:string ){

    let campos:any = this.parse_vcard( texto );
    console.log( campos );

    let nombre = campos['fn'];
    let tel    = campos.tel[0].value[0];


    if( !this.platform.is('cordova') ){
      console.warn("Estoy en la computadora, no puedo crear contacto.");
      return;
    }

    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, nombre );
    contact.phoneNumbers = [ new ContactField('mobile', tel ) ];

    contact.save().then(
      ()=> this.crear_toast("Contacto " + nombre + " creado!"),
      (error) => this.crear_toast( "Error: " + error )
    );


  }

  private crear_toast( mensaje:string ){

    this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    }).present();

  }


  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
};



  cargar_historial(){
    return this._historial;
  }


}
