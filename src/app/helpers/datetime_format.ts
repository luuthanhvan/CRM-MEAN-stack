export function dateFormat(datetime: string){
    let dt = new Date(datetime);

    let dateFormatted = new Date(dt.getDate() + '/' + (dt.getMonth()+1) + '/' + dt.getFullYear()); // dd/mm/yyyy

    return dateFormatted;
}

export function timeFormat(datetime: string){
    let dt = new Date(datetime);

    let amOrPm = (dt.getHours() < 12) ? "AM" : "PM";

    let timeFormatted = dt.getHours() + ':' + dt.getMinutes() + ' ' + amOrPm;

    return timeFormatted;
}

export function datetimeFormat(datetime: string){
    return dateFormat(datetime) + ', ' + timeFormat(datetime);
}