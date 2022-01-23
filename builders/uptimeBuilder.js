module.exports = (upTime) => {
  const date = new Date(upTime * 1000),
    days = date.getUTCDate() - 1,
    hours = date.getUTCHours(),
    minutes = date.getUTCMinutes(),
    seconds = date.getUTCSeconds(),
    milliseconds = date.getUTCMilliseconds();
  let segments = [];
  if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
  if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
  if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
  if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
  if (milliseconds > 0) segments.push(milliseconds + ' millisecond' + ((seconds == 1) ? '' : 's'));
  return segments.join(', ');    
}