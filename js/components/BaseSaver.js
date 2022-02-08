const BaseSaver = () => {
  const methods = {
    saveText(text, fileName) {
      fileName = (fileName==null) ? "file.txt" : fileName;
      let file = new File([text], fileName, {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
    saveJson(obj, fileName) {
      let text = JSON.stringify(obj, null, 2);
      fileName = (fileName==null) ? "file.json" : fileName;
      methods.saveText(text, fileName);
    },
    save(obj) {
      methods.saveJson(obj);
    },
  };
  return { ...methods };
};