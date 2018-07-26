import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// tslint:disable-next-line:import-destructuring-spacing
import { enableProdMode} from '@angular/core';
import { AppModule } from './app.module';

// RxJS
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
// this is the magic wand
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
