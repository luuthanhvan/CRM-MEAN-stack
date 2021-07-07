import { Component, Input, OnInit, ViewChild, TemplateRef, ViewContainerRef, DoCheck } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';
import { OverlayRef } from '@angular/cdk/overlay';

import { OverlayService, } from '../../overlay/overlay.module';
import { AppOverlayConfig } from '../../overlay/overlay.service';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
})
export class ProgressSpinnerComponent {
	@Input() color?: ThemePalette;
	@Input() diameter?: number = 100;
	@Input() mode?: ProgressSpinnerMode;
	@Input() strokeWidth?: number;
	@Input() value?: number;
	@Input() backdropEnabled = true;
	@Input() positionGloballyCenter = true;
	@Input() displayProgressSpinner: boolean;

  	@ViewChild('progressSpinnerRef', {static: false})
	
	private progressSpinnerRef: TemplateRef<any>;
	private progressSpinnerOverlayConfig: AppOverlayConfig;
	private overlayRef: OverlayRef;
	
	constructor(private vcRef: ViewContainerRef, private overlayService: OverlayService) { }

	ngOnInit() {
		// Config for Overlay Service
		this.progressSpinnerOverlayConfig = {
			hasBackdrop: this.backdropEnabled
		};
		if (this.positionGloballyCenter) {
			this.progressSpinnerOverlayConfig['positionStrategy'] = this.overlayService.positionGloballyCenter();
		}
		// Create Overlay for progress spinner
		this.overlayRef = this.overlayService.createOverlay(this.progressSpinnerOverlayConfig);
	}

	ngDoCheck() {
		// Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
		if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
			this.overlayService.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
		} else if (!this.displayProgressSpinner && this.overlayRef.hasAttached()) {
			this.overlayRef.detach();
		}
	}
}