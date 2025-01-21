import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarCitaPage } from './confirmar-cita.page';

describe('ConfirmarCitaPage', () => {
  let component: ConfirmarCitaPage;
  let fixture: ComponentFixture<ConfirmarCitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarCitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
