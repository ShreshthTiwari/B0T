const e = require("../emojiIDs.json");

module.exports = (client, percentage) =>{
  var bar = [], mainBar;
  const whitebar = client.emojis.cache.get(e.whitebar);
  const darkgreenwhiterbar = client.emojis.cache.get(e.darkgreenwhiterbar);
  const darkgreenwhitebar = client.emojis.cache.get(e.darkgreenwhitebar);
  const darkgreenerwhitebar = client.emojis.cache.get(e.darkgreenerwhitebar); 
  const darkgreenbar = client.emojis.cache.get(e.darkgreenbar);
  const greenwhiterbar = client.emojis.cache.get(e.greenwhiterbar);
  const greenwhitebar = client.emojis.cache.get(e.greenwhitebar);
  const greenerwhitebar = client.emojis.cache.get(e.greenerwhitebar); 
  const greenbar = client.emojis.cache.get(e.greenbar);
  const yellowwhiterbar = client.emojis.cache.get(e.yellowwhiterbar);
  const yellowwhitebar = client.emojis.cache.get(e.yellowwhitebar);
  const yellowerwhitebar = client.emojis.cache.get(e.yellowerwhitebar);
  const yellowbar = client.emojis.cache.get(e.yellowbar);
  const orangewhiterbar = client.emojis.cache.get(e.orangewhiterbar);
  const orangewhitebar = client.emojis.cache.get(e.orangewhitebar);
  const orangerwhitebar = client.emojis.cache.get(e.orangerwhitebar);
  const orangebar = client.emojis.cache.get(e.orangebar);
  const redwhiterbar = client.emojis.cache.get(e.redwhiterbar);
  const redwhitebar = client.emojis.cache.get(e.redwhitebar);
  const rederwhitebar = client.emojis.cache.get(e.rederwhitebar);
  const redbar = client.emojis.cache.get(e.redbar);
  
  bar[0] = bar[1] = bar[2] = bar[3] = bar[4] = whitebar; 
  
  if(percentage <= 5)
    bar[0] = redwhiterbar;
  else if(percentage <= 10)
    bar[0] = redwhitebar;
  else if(percentage <= 15)
    bar[0] = rederwhitebar;
  else if(percentage <= 20)
    bar[0] = redbar;
  else{
    bar[0] = orangebar;
    if(percentage <= 25)
      bar[1] = orangewhiterbar;
    else if(percentage <= 30)
      bar[1] = orangewhitebar;
    else if(percentage <= 35)
      bar[1] = orangerwhitebar;
    else if(percentage <= 40)
      bar[1] = orangebar;
    else{
      bar[0] = bar[1] = yellowbar;
      if(percentage <= 45)
        bar[2] = yellowwhiterbar;
      else if(percentage <= 50)
        bar[2] = yellowwhitebar;
      else if(percentage <= 55)
        bar[2] = yellowerwhitebar;
      else if(percentage <= 60)
        bar[2] = yellowbar;
      else{
        bar[0] = bar[1] = bar[2] = greenbar;
        if(percentage <= 65)
          bar[3] = greenwhiterbar;
        else if(percentage <= 70)
          bar[3] = greenwhitebar;
        else if(percentage <= 75)
          bar[3] = greenerwhitebar;
        else if(percentage <= 80)
          bar[3] = greenbar;
        else{
          bar[0] = bar[1] = bar[2] = bar[3] = darkgreenbar;
          if(percentage <= 85)
            bar[4] = darkgreenwhiterbar;
          else if(percentage <= 90)
            bar[4] = darkgreenwhitebar;
          else if(percentage <= 95)
            bar[4] = darkgreenerwhitebar;
          else if(percentage <= 100)
            bar[4] = darkgreenbar;
        }  
      }    
    }      
  }
  mainBar = bar.join("");
  return mainBar;
}