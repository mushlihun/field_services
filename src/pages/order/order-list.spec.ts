import { OrderServiceMock } from './../../providers/order/order-mock.service';
import { OrderService } from './../../providers/order/order.service';
import { IonicModule, Platform } from 'ionic-angular';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NgModule } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaxiApp } from '../../app/app.component';
import { OrderPage } from './order';
import { GeocoderServiceMock } from '../../providers/map/geocoder-mock.service';
import { GeocoderService } from '../../providers/map/geocoder.service';
import { MapService } from '../../providers/map/map.service';
import { MapServiceMock } from '../../providers/map/map-mock.service';
import { NavMock } from '../../ionic-mock';

describe('Page: OrderPage', () => {

  let comp: OrderPage;
  let fixture: ComponentFixture<OrderPage>;
  let de: DebugElement;
  let el: HTMLElement;
  let mapService: MapService;
  let orderService: OrderService;
  let geocoderService: GeocoderServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TaxiApp, OrderPage],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: OrderService, useClass: OrderServiceMock},
        {provide: MapService, useClass: MapServiceMock},
        {provide: GeocoderService, useClass: GeocoderServiceMock}
      ],
      imports: [
        IonicModule.forRoot(TaxiApp)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(OrderPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    mapService = TestBed.get(MapService);
    orderService = TestBed.get(OrderService);
    geocoderService = TestBed.get(GeocoderService);
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
  });

  it('should render `ion-content`', () => {
    fixture.detectChanges();
    expect(de.nativeElement.querySelectorAll('ion-content').length).toBe(1);
  });

  it('should fetch all taxi rides at page load', () => {
    spyOn(OrderService, 'listorderan').and.returnValue(Promise.resolve([]));

    const instance = fixture.componentInstance;
    instance.ionViewDidEnter();

    expect(orderService.listorderan).toHaveBeenCalled();
    expect(instance.order).not.toBeUndefined();
  });
});
