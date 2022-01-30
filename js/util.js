
const forceBlur = event => {
  let target = event.target;
  if (target.parentNode.className.split(/\s+/).includes("btn")) {
    target.blur();
    target = target.parentNode;
  }
  target.blur();
};

const timeString = () => {
  let the_date = new Date();
  let str = `${(''+the_date.getFullYear()).slice(2,4)}${(''+(the_date.getMonth()+1)).length==1?'0':''}${the_date.getMonth()+1}${(''+the_date.getDate()).length==1?'0':''}${the_date.getDate()}-${(''+the_date.getHours()).length==1?'0':''}${the_date.getHours()}${(''+the_date.getMinutes()).length==1?'0':''}${the_date.getMinutes()}${(''+the_date.getSeconds()).length==1?'0':''}${the_date.getSeconds()}`;
  return str;
};
