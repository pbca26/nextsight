// ref: https://github.com/pbca26/agama-wallet-lib/blob/dev/src/time.js#L1
export const secondsToString = (seconds: number, skipMultiply?: boolean, showSeconds?: boolean) => {
  var a = new Date(seconds * (skipMultiply ? 1 : 1000));
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
  var min = a.getMinutes() < 10 ? `0${a.getMinutes()}` : a.getMinutes();
  var sec = a.getSeconds();
  var time = `${date} ${month} ${year} ${hour}:${min}${(showSeconds ? `:${sec}` : '')}`;

  return time;
};