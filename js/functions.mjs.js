
fn = it => it;


fff = () => {

  labelsAgree = (labels, lo) => {
    let countDict = lo.countBy(labels, it=>it);
    // console.log(countDict);
    let vmax = lo.max(lo.values(countDict));
    let vsum = lo.sum(lo.values(countDict));
    let rr = vmax/vsum;
    console.log(rr);
    return rr;
  };

  labelSide = (label) => {
    label = label.toLowerCase();
    const map = {
      'somebad': 'bad',
      'somefine': 'fine',
    };
    if (label in map) {
      return map[label];
    };
    return label;
  };

  annoLabels = (anno, lo) => lo.uniq(anno?.content?.annotations.map(it=>it.label).sort());

  annoLabelText = (anno, lo) => annoLabels(anno, lo).join("&");

  annoLabelSide = (anno, lo) => annoLabels(anno, lo).map(it=>labelSide(it)).join("&");

  // task1最宽松一致性 = (entry, db, lo) => {
  //   let aids = entry?.allAnnos??[];
  //   let annos = aids.map(aid=>db?.annoDict?.[aid]);
  //   let labelses = annos.map(anno=>annoLabels(anno, lo));
  //   return labelsAgree(labelTexts, lo);
  // };

  单条较宽松一致性 = (entry, db, lo) => {
    let aids = entry?.allAnnos??[];
    let annos = aids.map(aid=>db?.annoDict?.[aid]);
    let labelTexts = annos.map(anno=>annoLabelSide(anno, lo));
    return labelsAgree(labelTexts, lo);
  };

  单条严格一致性 = (entry, db, lo) => {
    let aids = entry?.allAnnos??[];
    let annos = aids.map(aid=>db?.annoDict?.[aid]);
    let labelTexts = annos.map(anno=>annoLabelText(anno, lo));
    return labelsAgree(labelTexts, lo);
  };

  双人一致率 = (甲, 乙, db, lo) => {
    let aa = (甲?.allAnnos??[]).map(aid=>db?.annoDict?.[aid]?.entry);
    let bb = (乙?.allAnnos??[]).map(aid=>db?.annoDict?.[aid]?.entry);
    let eids = lo.intersectionBy(aa, bb);
    let entries = eids.map(eid=>db?.entryDict?.[eid]).filter(it=>it);
    console.log(entries);
    let result = {};
    for (let entry of entries) {
      单条严格一致性(entry, db, lo);
      单条较宽松一致性(entry, db, lo);
    };
  };
  aa = app.theDB.userDict["9"];
  bb = app.theDB.userDict["10"];
  双人一致率(aa, bb, app.theDB, _);





};


export { fn };
