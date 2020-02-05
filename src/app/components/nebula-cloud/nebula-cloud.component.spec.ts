import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NebulaCloudComponent } from './nebula-cloud.component';

describe('NebulaCloudComponent', () => {
  let component: NebulaCloudComponent;
  let fixture: ComponentFixture<NebulaCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NebulaCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NebulaCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
