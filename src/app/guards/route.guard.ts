import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

export const routeGuard: CanActivateFn = () => {
  const localStorageService = inject(LocalStorageService)
  const router = inject(Router)
  if (localStorageService.hasLocalStorage()) {
    return true
  } else {
    router.navigate(['/'])
    return false
  };
};
