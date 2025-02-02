import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SEO_HANDLER } from './tokens/seo.token';
import { SwUpdate } from '@angular/service-worker';
import { CULTURE_HANDLER } from './tokens/culture.token';
import { SharedMenuComponent } from './utility/components/menu/menu.component';

describe('AppComponent', () => {
  let mockCultureHandler: jest.Mock;
  let mockSeoHandler: jest.Mock;
  let swUpdate: jest.Mock;
  let activatedRouteHandler: jest.Mock;

  beforeEach(async () => {
    // Create Jest mock functions
    mockCultureHandler = jest.fn();
    mockSeoHandler = jest.fn();
    swUpdate = jest.fn();
    activatedRouteHandler = jest.fn();
    await TestBed.configureTestingModule({
      imports: [RouterOutlet, SharedMenuComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteHandler },
        { provide: SwUpdate, useValue: swUpdate },
        { provide: CULTURE_HANDLER, useValue: mockCultureHandler },
        { provide: SEO_HANDLER, useValue: mockSeoHandler },
      ],
    }).compileComponents();
  });

  it('should call cultureHandler and seoHandler in constructor', () => {
    TestBed.createComponent(AppComponent);

    expect(mockCultureHandler).toHaveBeenCalledTimes(1);
    expect(mockSeoHandler).toHaveBeenCalledTimes(1);
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Baza karm dla kotów'
    );
  });

  it(`should have as title 'baza-karm'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('baza-karm');
  });
});
