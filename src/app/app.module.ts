import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

// Mapas
import { AgmCoreModule } from '@agm/core';


import { GuardadosPage, HomePage, MapaPage, TabsPage } from "../pages/index.paginas";


// servicios
import { HistorialService } from "../providers/historial";

// plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts } from '@ionic-native/contacts';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    MyApp,
    GuardadosPage,
    HomePage,
    MapaPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBEqKtJCsyLJBQibxDIdqqwd_KijpnchNc'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GuardadosPage,
    HomePage,
    MapaPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    InAppBrowser,
    Contacts,
    HistorialService,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
