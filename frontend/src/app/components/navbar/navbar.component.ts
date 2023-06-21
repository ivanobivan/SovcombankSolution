import { Component, OnDestroy } from '@angular/core';
import { PageName } from '../../app.module';
import { AuthenticationService } from '../../services/authentication.service';
import { Role } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {

    pageName = PageName;

    pages!: { link: string, title: string }[];

    isAuthorized = false;
    unsubscribe$ = new Subject();

    constructor(private authService: AuthenticationService) {
        this.setNavbarLinks();
    }

    setNavbarLinks() {
        this.isAuthorized = this.authService.isAuthorized();
        this.pages = [];
        if (this.isAuthorized) {
            if (this.authService.userInRole([Role.USER])) {
                this.pages.push({
                    link: `${PageName.DASHBOARD}/${PageName.VIEW}`,
                    title: 'ЛК'
                });
            }
            if (this.authService.userInRole([Role.ADMIN])) {
                this.pages.push({
                    link: PageName.ADMIN,
                    title: 'CRM'
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    logout() {
        this.authService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.setNavbarLinks();
        });

    }
}
