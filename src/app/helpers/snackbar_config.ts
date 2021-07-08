import { MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

export function snackbarConfig(verticalPosition : MatSnackBarVerticalPosition, 
                                horizontalPosition : MatSnackBarHorizontalPosition, 
                                setAutoHide : boolean, 
                                duration : number, 
                                extraClass : string[]){
    let config = new MatSnackBarConfig();
    config.verticalPosition = verticalPosition;
    config.horizontalPosition = horizontalPosition;
    config.duration = setAutoHide ? duration : 0;
    config.panelClass = extraClass;

    return config;
}