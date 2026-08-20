import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE } from 'angular-webstorage-service';

import { LocalstorageService } from './localstorage.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;
  let storageSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LOCAL_STORAGE, useValue: storageSpy }
      ]
    });
    service = TestBed.get(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setUser() stores the user under the local_user key', () => {
    const user = { name: 'Test User' };
    service.setUser(user);
    expect(storageSpy.set).toHaveBeenCalledWith('local_user', user);
  });

  it('getUser() reads the user from the local_user key', () => {
    storageSpy.get.and.returnValue({ name: 'Test User' });
    expect(service.getUser()).toEqual({ name: 'Test User' });
    expect(storageSpy.get).toHaveBeenCalledWith('local_user');
  });

  it('deleteUser() removes the local_user key', () => {
    service.deleteUser();
    expect(storageSpy.remove).toHaveBeenCalledWith('local_user');
  });
});
