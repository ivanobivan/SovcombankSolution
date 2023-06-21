import { Component, OnInit } from '@angular/core';
import { PageName } from '../../app.module';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    links = [
        {
            name: 'Профиль',
            routerLink: PageName.PROFILE
        },
        {
            name: 'Обзор',
            routerLink: PageName.VIEW,
            active: true
        },
        {
            name: 'Торговля',
            routerLink: PageName.TRADE
        },
        {
            name: 'История операций',
            routerLink: PageName.HISTORY
        }
    ];

    currentDateTime;

    constructor(private router: Router) {
        this.currentDateTime = new Date().toLocaleString();
    }

    ngOnInit(): void {
        const url = this.router.url;
        const split = url.replace('/', '').split('/');
        if (split?.length > 1) {
            this.links.forEach(e => {
                if (e.routerLink === PageName.TRADE && split[1].search(PageName.TRADE_DETAIL) >= 0 ) {
                    e.active = true;
                } else {
                    e.active = e.routerLink.search(split[1]) >= 0;
                }
            });
        }
    }

    changeActiveLink(index: number) {
        this.links.forEach((link, i) => {
            link.active = index === i;
        });
    }
}
