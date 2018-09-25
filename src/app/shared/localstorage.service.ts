import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

const STORAGE_KEY = 'local_user';

export interface Player {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }

  setUser(user) {
    this.storage.set(STORAGE_KEY, user);
  }

  getUser() {
    return this.storage.get(STORAGE_KEY);
  }

}
