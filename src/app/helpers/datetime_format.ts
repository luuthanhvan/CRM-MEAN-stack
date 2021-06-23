export function datetimeFormat(datetime: string){
    let dt = new Date(datetime);

    let amOrPm = (dt.getHours() < 12) ? "AM" : "PM";
    let dateFormatted = dt.getDate() + '/' + dt.getMonth() + '/' + dt.getFullYear();
    let timeFormatted = dt.getHours() + ':' + dt.getMinutes() + ' ' + amOrPm;

    return dateFormatted + ', ' + timeFormatted;
}