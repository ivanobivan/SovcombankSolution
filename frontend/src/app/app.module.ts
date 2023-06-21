import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuard } from './app.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { Role } from './models';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { JwtInterceptor } from './iterceptors/jwt.interceptor';
import { ErrorInterceptor } from './iterceptors/error.interceptor';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ViewComponent } from './components/view/view.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TradeComponent } from './components/trade/trade.component';
import { HistoryComponent } from './components/history/history.component';
import { CardModalComponent } from './components/card-modal/card-modal.component';
import { NgxMaskModule } from 'ngx-mask';
import { TradeDetailComponent } from './components/trade-detail/trade-detail.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export enum PageName {
    DEFAULT = '',
    ADMIN = 'admin',
    LOGIN = 'login',
    PREVIEW = '',
    DASHBOARD = 'dashboard',
    ERROR = '404',
    VIEW = 'view',
    PROFILE = 'profile',
    TRADE = 'trade',
    TRADE_DETAIL = 'tradeDetail',
    HISTORY = 'history'
}

export enum LoginType {
    LOGIN,
    SIGNUP
}

const routes: Routes = [
    {
        path: PageName.DEFAULT,
        component: HomePageComponent,
        children: [
            {
                path: PageName.PREVIEW,
                component: PreviewComponent
            },
            {
                path: PageName.DASHBOARD,
                component: DashboardPageComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.USER]
                },
                children: [
                    {
                        path: PageName.VIEW,
                        component: ViewComponent
                    },
                    {
                        path: PageName.PROFILE,
                        component: ProfileComponent
                    },
                    {
                        path: PageName.TRADE,
                        component: TradeComponent,
                    },
                    {
                        path: PageName.TRADE_DETAIL,
                        component: TradeDetailComponent
                    },
                    {
                        path: PageName.HISTORY,
                        component: HistoryComponent
                    }
                ]
            },
            {
                path: PageName.ADMIN,
                component: AdminPageComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [Role.ADMIN]
                }
            },
        ]
    },
    {
        path: PageName.LOGIN,
        component: LoginPageComponent
    },
    {
        path: PageName.ERROR,
        component: ErrorPageComponent,
    },
    {
        path: '**',
        redirectTo: PageName.ERROR
    }
];

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        AdminPageComponent,
        LoginPageComponent,
        ModalComponent,
        DashboardPageComponent,
        ErrorPageComponent,
        NavbarComponent,
        PreviewComponent,
        SidebarComponent,
        ViewComponent,
        ProfileComponent,
        TradeComponent,
        HistoryComponent,
        CardModalComponent,
        TradeDetailComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
        NgxMaskModule.forRoot()
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
