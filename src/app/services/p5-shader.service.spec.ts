import { TestBed } from '@angular/core/testing';

import { P5ShaderService } from './p5-shader.service';

describe('P5ShaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: P5ShaderService = TestBed.get(P5ShaderService);
    expect(service).toBeTruthy();
  });
});
