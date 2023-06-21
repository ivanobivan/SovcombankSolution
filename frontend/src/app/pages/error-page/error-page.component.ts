import { Component } from '@angular/core';
import { PageName } from '../../app.module';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {

    pageName = PageName;

}
