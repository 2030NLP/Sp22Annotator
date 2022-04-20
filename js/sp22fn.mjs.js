
const fn = it => it;


const fff = () => {

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


const fn2 = () => {

  batchName="task1-01";

  log = console.log;
  annos = app.theDB.annos.filter(it=>it.batchName==batchName&&app.theDB.userDict[it.user]?.currTaskGroup!="zwdGroup");

  ll = annos.map(anno=>_.min([anno._timeInfo.totalDur,1000*60*3]));

  avg = _.sum(ll)/ll.length;
  log(`${batchName} 每条标注平均耗费时长（单位 秒，超过3分钟以3分钟计）：`, avg/1000);
  sorted_ll = _.sortBy(ll, it=>+it);
  log(`${batchName} 最短的耗时（单位 秒）：`, sorted_ll[0]/1000);
  log(`${batchName} 中位数耗时（单位 秒）：`, sorted_ll[Math.round(sorted_ll.length/2)]/1000);

  firstTimes = _.sortBy(annos.map(anno=>new Date(anno._timeInfo.detail[0][0])), it=>it.valueOf());
  log(`${batchName} 的第一条标注的时间是：`, firstTimes[0]);
  log(`${batchName} 的第50条标注的时间是：`, firstTimes[49]);
  log(`${batchName} 的最中间标注的时间是：`, firstTimes[Math.round(firstTimes.length/2)]);
  log(`${batchName} 的倒数第50条标注的时间是：`, firstTimes.at(-50));
  log(`${batchName} 的最后一条标注的时间是：`, firstTimes.at(-1));
  log(`${batchName} 总耗时（单位 小时）：`, (firstTimes.at(-1)-firstTimes[0])/1000/60/60);


  一些annos的总历时 = (annos, lo) => {
    let firstEnterTimes = lo.sortBy(annos.map(anno=>new Date(anno._timeInfo.detail[0][0])), it=>it.valueOf());
    let firstSaveTimes = lo.sortBy(annos.map(anno=>new Date(anno._timeInfo.detail[0][1])), it=>it.valueOf());
    return firstSaveTimes.at(-1)-firstEnterTimes[0];
  };

  一个用户某个批次的总历时 = (user, batchName, db, lo) => {
    let annos = db.annos.filter(it=>it.batchName==batchName&&it.user==user.id);
    return 一些annos的总历时(annos, lo);
  };

  每个用户的总历时pair列表 = app.theDB.users
    .filter(it=>it.currTaskGroup!="zwdGroup")
    .map(it=>[it, 一个用户某个批次的总历时(it, batchName, app.theDB, _)])
    .filter(it=>it[1]!=null&&!isNaN(it[1]));
  每个用户的总历时pair列表 = _.sortBy(每个用户的总历时pair列表, it=>+it[1]);
  pairs = 每个用户的总历时pair列表.map(it=>[it[0].id, it[0].currTaskGroup, it[0].name, +it[1]]);

  每个用户的总历时列表 = 每个用户的总历时pair列表.map(it=>it[1]);


  平均总历时 = _.sum(每个用户的总历时列表)/每个用户的总历时列表.length;
  log(`${batchName} 每个用户平均历时（单位 分钟）：`, 平均总历时/1000/60);

  sorted_每个用户的总历时列表 = _.sortBy(每个用户的总历时列表, it=>+it);
  log(`${batchName} 最快用户历时（单位 分钟）：`, sorted_每个用户的总历时列表[0]/1000/60);
  log(`${batchName} 中位用户历时（单位 分钟）：`, sorted_每个用户的总历时列表[Math.round(sorted_每个用户的总历时列表.length/2)]/1000/60);
  log(`${batchName} 最慢用户历时（单位 分钟）：`, sorted_每个用户的总历时列表.at(-1)/1000/60);





  一些annos的总耗时 = (annos, lo) => {
    let totalDurs = annos.map(anno=>anno._timeInfo.totalDur);
    return lo.sum(totalDurs);
  };

  一个用户某个批次的总耗时 = (user, batchName, db, lo) => {
    let annos = db.annos.filter(it=>it.batchName==batchName&&it.user==user.id);
    return 一些annos的总耗时(annos, lo);
  };

  每个用户的总耗时pair列表 = app.theDB.users
    .filter(it=>it.currTaskGroup!="zwdGroup")
    .map(it=>[it, 一个用户某个批次的总耗时(it, batchName, app.theDB, _)])
    .filter(it=>it[1]!=null&&!isNaN(it[1])&&it[1]!=0);
  每个用户的总耗时pair列表 = _.sortBy(每个用户的总耗时pair列表, it=>+it[1]);
  pairs = 每个用户的总耗时pair列表.map(it=>[it[0].id, it[0].currTaskGroup, it[0].name, +it[1]]);

  每个用户的总耗时列表 = 每个用户的总耗时pair列表.map(it=>it[1]);


  平均总耗时 = _.sum(每个用户的总耗时列表)/每个用户的总耗时列表.length;
  log(`${batchName} 每个用户平均耗时（单位 分钟）：`, 平均总耗时/1000/60);

  sorted_每个用户的总耗时列表 = _.sortBy(每个用户的总耗时列表, it=>+it);
  log(`${batchName} 最快用户耗时（单位 分钟）：`, sorted_每个用户的总耗时列表[0]/1000/60);
  log(`${batchName} 中位用户耗时（单位 分钟）：`, sorted_每个用户的总耗时列表[Math.round(sorted_每个用户的总耗时列表.length/2)]/1000/60);
  log(`${batchName} 最慢用户耗时（单位 分钟）：`, sorted_每个用户的总耗时列表.at(-1)/1000/60);



  log("pairs");
  csv = pairs.map(it=>it.map(xx=>JSON.stringify(xx)).join(",")).join("\n");
  log(csv);

  app.theSaver.saveText(csv, 'task1-01-实际耗时表.csv')

};









const reviewerWorkStatistics = async () => {
  // 统计审核员的工作量。
  // 遍历 annos
  //   检查 content?._ctrl?.timeLog 所有 [0] 为 'check' 的 [2] 中的 id 和 name
  //     注意连续的 同一个审核员 'check' 只记为 1 次
  //     如果没有 'check' 记录，说明是老版本，那么检查 content?.review?.reviewer 中的 id 和 name
  //   给 id 或 name 做计次
};









class Sp22FN {
  constructor(lodash) {
    this.lodash = lodash;
    this.lo = this.lodash;
  }
  useLodash(lodash) {
    this.lodash = lodash;
    this.lo = this.lodash;
  }

  static computeAnnoTimeInfo(anno) {
    const logs = anno?.content?._ctrl?.timeLog ?? [];

    let box = [];
    let pureBox = [];

    let pureStop = false;
    for (let log of logs) {
      if (log[0]=="check") {
        pureStop = true;
      };
      if (log[0]=="in") {
        box.push([log[1], null]);
        if (!pureStop) {
          pureBox.push([log[1], null]);
        };
      };
      if (log[0]=="out" && box.length) {
        if (box.at(-1)[1]==null) {
          box.at(-1)[1] = log[1];
          if (!pureStop) {
            pureBox.at(-1)[1] = log[1];
          };
        };
      };
    };

    let totalDur = 0;
    for (let pair of box) {
      if (pair[0].length&&pair[1].length) {
        let delta = (new Date(pair[1])) - (new Date(pair[0]));
        totalDur += delta;
      };
    };

    let pureTotalDur = 0;
    for (let pair of pureBox) {
      if (pair[0].length&&pair[1].length) {
        let delta = (new Date(pair[1])) - (new Date(pair[0]));
        pureTotalDur += delta;
      };
    };

    let firstDur = (new Date(box[0][1])) - (new Date(box[0][0]));
    let stride = (new Date(box.at(-1)[1])) - (new Date(box[0][0]));
    let pureStride = (new Date(pureBox.at(-1)[1])) - (new Date(pureBox[0][0]));
    let lastAt = box.at(-1)[1];
    let pureLastAt = pureBox.at(-1)[1];
    return {firstDur, totalDur, pureTotalDur, stride, pureStride, lastAt, pureLastAt, detail: box};
  };

  static lls = {
    ll0: ['t0', '第0期', '清洗', '0', 'clean', 'check'],
    ll1: ['t1', '第1期', '正确性', '1'],
    ll2: ['t2', '第2期', '同义性', '2'],
    ll3: ['t3', '第3期', '归因', '3', 'reason'],
    ll4: ['t4', '第4期', '精标', '4', 'detail'],
  };

  // 处理 topic 历史遗留混乱 用于 Task task.topic
  static topic_regulation(topic) {
    if (Sp22FN.lls.ll0.includes(topic)) {
      return '清洗';
    };
    if (Sp22FN.lls.ll1.includes(topic)) {
      return '第1期';
    };
    if (Sp22FN.lls.ll2.includes(topic)) {
      return '第2期';
    };
    if (Sp22FN.lls.ll3.includes(topic)) {
      return '归因';
    };
    if (Sp22FN.lls.ll4.includes(topic)) {
      return '精标';
    };
    return topic;
  }

  // 处理 topic 历史遗留混乱 用于 User user.currTask
  static topic_to_tag(topic) {
    if (Sp22FN.lls.ll0.includes(topic)) {
      return 't0';
    };
    if (Sp22FN.lls.ll1.includes(topic)) {
      return 't1';
    };
    if (Sp22FN.lls.ll2.includes(topic)) {
      return 't2';
    };
    if (Sp22FN.lls.ll3.includes(topic)) {
      return 't3';
    };
    if (Sp22FN.lls.ll4.includes(topic)) {
      return 't4';
    };
    return topic;
  }

  // 处理 topic 历史遗留混乱 用于 find()
  static topic_tags(topic) {
    if (Sp22FN.lls.ll0.includes(topic)) {
      return ll0;
    };
    if (Sp22FN.lls.ll1.includes(topic)) {
      return ll1;
    };
    if (Sp22FN.lls.ll2.includes(topic)) {
      return ll2;
    };
    if (Sp22FN.lls.ll3.includes(topic)) {
      return ll3;
    };
    if (Sp22FN.lls.ll4.includes(topic)) {
      return ll4;
    };
    return [topic];
  }

  static tasks_sta(tasks=[]) {
    let not_deleted = tasks.filter(task => !task.deleted);
    let assigned = not_deleted.filter(task => task.to?.length);
    let submitted = assigned.filter(task => task.submitters?.length>0);
    let working = submitted.filter(task => task.submitters?.length<task.to?.length);
    let done = submitted.filter(task => task.submitters?.length>=task.to?.length);
    return {
      total_num: tasks.length,
      deleted_num: tasks.length - not_deleted.length,
      assigned_num: assigned.length,
      working_num: working.length,
      done_num: done.length,
    }
  }

  static tasks_computed(db) {
    return {
      total: Sp22FN.tasks_sta(db.tasks),
      by_topic: Object.entries(db.computeTopicTaskDict()).map(pr => [pr[0], tasks_sta(pr[1])]),
      by_batchName: Object.entries(db.computeBatchNameTaskDict()).map(pr => [pr[0], tasks_sta(pr[1])]),
    };
  }







                                                                                                                               
                                                                                                                               
                                                                                                                               
                                                                                                     
  //                                                  .>l:.              I>>;          `ii!'           
  //                                 }O00QCCCQ00Q0O]  >kkC.              zaan    ;+>,  >kkb!           
  //                                 <ft/xkaac\\//f>  faaJ????--?-`      zaan    noa|  >kkb!           
  //                                    IJab{ -nzi   :qkbpdddkhhkq;  `\t<chkCcQ+`mkamQQOkkkOQQQQ0j     
  //                                 .:\paO_`"?dop-  xahz,::IOhb~,.  >h*{vhhuz#ZchhCjrrckkkcrrrrx{     
  //                                 :m*aawQOZmwbok<[khhqI  IdhZ'    )ak>chax,YboaZ:   !kkbl           
  // lJCCCCCCCCCCCCCCCCCCCCCCCCCCQf   -[?_?YYc<,~n)fkamqaY' taaf    'Co0'chan .{LL;    !kkbl           
  // ;vccccccccccccccccccccccccccz|    ''':phh<`'' ,fU;-kax>paw:    .l_> zhan   Intffffvkkkuffffj>     
  //                                  {bpppkkkpppb1     )bkphd?          zhan   iZOOOOOmkkkmOOOOm[     
  //                                  l{{}(dkk/}}}I      xahht           zhan    ......>kkbi.....      
  //                                      .qkk!'"l~`   !ukhqhdrI         zhan          !kkbl           
  //                                 :})\fvkaaqpbkql:[Yho0{,)m*bv-,      zhan .?}}}}}}}tkhk/}}}}}{>    
  //                                 ;ZpZQJcx/)]+!:>Zopc?'   "{Chp?      Xoou 'Qdpppppppwwwppppppbf    
  //                                  ^`'           !?"        .!:       >--!  ^""""""""""""""""""`    
                                                                                                   
  static task1LabelSide(label) {
    label = label.toLowerCase();
    const map = {
      'somebad': 'bad',
      'somefine': 'fine',
    };
    if (label in map) {
      return map[label];
    };
    return label;
  }

  static annoLabels(anno, lodash) {
    return lodash.sortedUniq(anno?.content?.annotations.map(it=>it.label));
  }

  static annoLabelText(anno, lodash) {
    return annoLabels(anno, lodash).join("&");
  }

  static annoTask1LabelSideText(anno, lodash) {
    return annoLabels(anno, lodash).map(it=>Sp22FN.task1LabelSide(it)).join("&");
  }

  static 多数标签占比(labels, lodash) {
    let countDict = lodash.countBy(labels, it=>it);
    // console.lodashg(countDict);
    let vmax = lodash.max(lodash.values(countDict));
    let vsum = lodash.sum(lodash.values(countDict));
    let rr = vmax/vsum;
    console.log(rr);
    return rr;
  }

  static 一条task的所有答题者的一致率(task, sp22db, 一致率计算函数, 标签函数, lodash) {
    if (一致率计算函数 == null) { 一致率计算函数 = Sp22FN.多数标签占比; };
    if (标签函数 == null) { 标签函数 = Sp22FN.annoLabelText; };
    if (lodash == null) { lodash = sp22db.lo; };
    let entry = sp22db.entryDict[task.entry];
    let aids = entry?.allAnnos??[];
    let annos = lodash.chain(aids).map(aid=>sp22db?.annoDict?.[aid]).filter(anno=>anno.task==task.id);
    let labels = 标签函数(annos, lodash);
    return 一致率计算函数(labels, lodash);
  }

  static 一条task1语料的多数标签占比(task, sp22db, lodash) {
    return Sp22FN.一条task的所有答题者的一致率(task, sp22db, Sp22FN.多数标签占比, Sp22FN.annoTask1LabelSideText, lodash);
  }

  static 两人在一条任务语料上是否一致(task, u1, u2, sp22db, 标签函数, 一致性计算函数, lodash) {
    if (标签函数 == null) { 标签函数 = Sp22FN.annoLabelText; };
    if (一致性计算函数 == null) { 一致性计算函数 = (a,b)=>a==b; };
    if (lodash == null) { lodash = sp22db.lo; };
    let [labelText1, labelText2] = lodash.chain([u1, u2])
      .map(user => lodash.chain(user.allAnnos)
        .map(aid=>sp22db.annoDict[aid])
        .filter(anno=>anno.task==task.id)
        .map(anno => 标签函数(anno))
        [0]
      );
    if(labelText1==null||labelText2==null){return;};
    return 一致性计算函数(labelText1, labelText2);
  }

  static inTask1(task) {
    return Sp22FN.topic_regulation(task.topic)==Sp22FN.topic_regulation('第1期');
  }

  static 两人在一条task1语料上是否一致(task, u1, u2, sp22db, lodash) {
    if (!inTask1(task)) {return;};
    return 两人在一条任务语料上是否一致(task, u1, u2, sp22db, Sp22FN.annoTask1LabelSideText, null, lodash);
  }

  static 两人在共有的task1语料上的一致率报告(u1, u2, sp22db, lodash) {
    if (lodash == null) { lodash = sp22db.lo; };
    let report = {};
    let aa = lodash.map(u1?.allAnnos??[], aid=>sp22db?.annoDict?.[aid]?.task);
    let bb = lodash.map(u2?.allAnnos??[], aid=>sp22db?.annoDict?.[aid]?.task);
    let tids = lodash.intersectionBy(aa, bb);
    if (!tids.length) {return;};
    let tasks = lodash.chain(tids).map(tid=>sp22db?.taskDict?.[tid]).filter(it=>inTask1(it));
    if (!tasks.length) {return;};
    let pairs = [];
    for (let task of tasks) {
      let item = 两人在一条task1语料上是否一致(task, u1, u2, sp22db, lodash);
      pairs.push([task.id, item]);
    };
    report.users = [u1.id, u2.id];
    report.task = task.id;
    report.summary = lodash.countBy(items, it=>it[1]);
    report.summary.sum = tasks.length;
    report.summary.trueRatio = (report.summary.true??0)/report.summary.sum;
    report.details = lodash.fromPairs(pairs);
    return report;
  }

  static userPairs(sp22db, lodash) {
    if (lodash == null) { lodash = sp22db.lo; };
    let pairs = [];
    let users = sp22db.users??[];
    for (let u1 of users) {
      for (let u2 of users) {
        let pair = lodash.sortBy([u1, u2], it=>(+it.id));
        pairs.push(pair);
      };
    };
    pairs = lodash.uniqBy(pairs, pair=>[pair[0].id, pair[1].id].join("&"));
    return pairs;
  }

  static 所有用户两两在共有的task1语料上的一致率报告(sp22db, lodash) {
    if (lodash == null) { lodash = sp22db.lo; };
    let report = {
      details: {},
    };
    let userPairs = Sp22FN.userPairs(sp22db, lodash);
    for (let pair of userPairs) {
      let [u1, u2] = pair;
      let key = `${u1.name}#${u1.id}&${u2.name}#${u2.id}`.replace(/ /g, "_");
      let oneReport = Sp22FN.两人在共有的task1语料上的一致率报告(u1, u2, sp22db, lodash);
      if (oneReport) {
        oneReport.key = key;
        report.details[key] = oneReport;
      };
    };
    let values = lodash.values(report.details);
    report.summary = lodash.countBy(values, it=>it.summary.trueRatio.toFixed(1));
    report.summary.sum = values.length;
    return report;
  }

}

export default Sp22FN;



















