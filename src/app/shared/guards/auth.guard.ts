import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);

  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        console.log('Working=============');
        if (!authenticated) {
          const urlTree = router.parseUrl(`login`);
          console.log('Url========>', urlTree);

          return of(urlTree);
        }

        // Allow the access
        return of(true);
      })
    );
};
