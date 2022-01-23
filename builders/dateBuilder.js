module.exports = () =>{
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; 
  const yyyy = today.getFullYear();
  if(dd < 10){
    dd = '0' + dd;
  }
  if(mm < 10){ 
    mm = '0' + mm;
  }
  let hr = today.getHours();
  let min = today.getMinutes();
  if(min < 10){ 
    min = "0" + min;
  }
  let ampm = "AM";
  if(hr > 12){
    hr -= 12;
    ampm = "PM";
  }
  const dateArray = dd + '-' + mm + '-' + yyyy + ' | ' + hr + ':' + min + ' ' + ampm;
  return dateArray;
}