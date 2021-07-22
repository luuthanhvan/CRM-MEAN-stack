import { Component, LOCALE_ID, Inject } from '@angular/core';

export const languageList = [
	{ code: 'en', label: 'English' },
	{ code: 'vi', label: 'Tiếng việt' }
];

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent{
    title = 'CRM-app';
	constructor(@Inject(LOCALE_ID) protected localeId: string){}
}
