import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

const STORAGE_KEY = 'local_user';

export interface Player {
  name: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  setUser(user) {
    this.storage.set(STORAGE_KEY, user);
  }

  getUser() {
    return this.storage.get(STORAGE_KEY);
  }

}
