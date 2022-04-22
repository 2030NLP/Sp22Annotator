import {
  reactive,
  computed,
  onMounted,
  h,
} from '../modules_lib/vue_3.2.31_.esm-browser.prod.min.js';
import UserListControl from './UserListControl.cpnt.mjs.js';
import UserListItem from './UserListItem.cpnt.mjs.js';

const UserListPanel = {
  props: ["db", "me", "functions"],
  emits: ["happy", 'click-add-user-btn', 'click-user-progress-btn', 'click-user-detail-btn'],
  component: {
    UserListControl,
    UserListItem,
  },
  setup(props, ctx) {
    const localData = reactive({
      selectedBatchName: "",
      总审核量文本: "",
      此批审核量文本: "",
      listControlSettings: {
        showQuittedUsers: false,
        managerFilter: "【all】",
        groupFilter: "【all】",
        sortMethod: "id+",
      },
    });

    const theDB = props.db;
    const theFN = props.functions;
    const theMe = props.me;
    const isManager = (user) => {
      return user.role?.includes?.('manager') || user.role?.includes?.('admin');
    };

    const batchNames = computed(()=>theDB.batchNames());
    const managers = computed(()=>theDB.users.filter(user=>isManager(user)));
    const groups = computed(()=>[...(new Set(theDB.users.map(user=>user.currTaskGroup)))]);
    const newestBatchName = computed(()=>(theDB.tasks??[]).sort((a, b)=>(+a.batch-b.batch)).map(it=>it.batchName).at(-1));

    onMounted(()=>{localData.selectedBatchName=newestBatchName.value;});

    const 计算审核量 = () => {
      let allReviewedAnnos = theDB?.annos?.filter?.(it=>it?.content?.review) ?? [];
      let currAnnos = theDB?.annos?.filter?.(it=>it?.batchName==localData.selectedBatchName) ?? [];
      let currReviewedAnnos = allReviewedAnnos?.filter?.(it=>it.batchName==localData.selectedBatchName) ?? [];
      localData.总审核量文本 = `${allReviewedAnnos.length} / ${theDB?.annos?.length} = ${(allReviewedAnnos.length/theDB?.annos?.length).toFixed(2)}`;
      localData.此批审核量文本 = `${currReviewedAnnos.length} / ${currAnnos.length} = ${(currReviewedAnnos.length/currAnnos.length).toFixed(2)}`;
      console.log(localData);
    };

    const userList = computed(()=>{
      // console.log(localData.listControlSettings);
      let list = theDB.users??[];
      if (!localData.listControlSettings.showQuittedUsers) {
        list = list.filter(it => !it.quitted);
      };
      if (localData.listControlSettings.managerFilter!="【all】") {
        list = list.filter(it => (it.manager??"")==localData.listControlSettings.managerFilter);
      };
      if (localData.listControlSettings.groupFilter!="【all】") {
        list = list.filter(it => (it.currTaskGroup??"")==localData.listControlSettings.groupFilter);
      };
      const sortMethodsMap01 = {
        "id+": it => (+it.id),
        "progress+": it => (+theDB.userProgress(it, localData.selectedBatchName).ratio),
        "progress-": it => (-theDB.userProgress(it, localData.selectedBatchName).ratio),
        "done+": it => (+theDB.userProgress(it, localData.selectedBatchName).cDoneLen),
        "done-": it => (-theDB.userProgress(it, localData.selectedBatchName).cDoneLen),
      };
      if (localData.listControlSettings.sortMethod in sortMethodsMap01) {
        list = theDB.lo.sortBy(list, sortMethodsMap01[localData.listControlSettings.sortMethod]);
      };
      const sortMethodsMap02 = {
        "pass+": (a,b) => theDB.sortFnByPassRatio(a,b, localData.selectedBatchName),
        "pass-": (a,b) => theDB.sortFnByPassRatioR(a,b, localData.selectedBatchName),
      };
      if (localData.listControlSettings.sortMethod in sortMethodsMap02) {
        list = list.sort(sortMethodsMap02[localData.listControlSettings.sortMethod]);
      };
      // console.log(list);
      return list;
    });

    return () => [
      h("div", {
          'class': "container",
        }, [

          h("div", { 'class': "row align-items-center my-2", }, [
            h("div", { 'class': "col col-12", }, [
              h("div", { 'class': "d-inline-block my-1 me-2 align-middle", }, [
                h("select", {
                  'class': "form-select form-select-sm",
                  'onChange': (event) => {
                    localData.selectedBatchName = event?.target?.value;
                  },
                }, [
                  h("option", {
                    'value': newestBatchName.value,
                    'selected': true,
                  }, [`【最新(${newestBatchName.value})】`]),

                  ...batchNames.value.map(batchName=>h("option", {
                    'value': batchName,
                  }, [batchName])),

                ]),
              ]),

              h("div", { 'class': "d-inline-block align-middle my-1 me-2", }, [
                "全部已审", " ", localData.总审核量文本, " | ",
                "此批已审", " ", localData.此批审核量文本,
              ]),
              h("button", {
                'type': "button",
                'class': "btn btn-sm btn-outline-dark my-1 me-2",
                'title': "重算审核量",
                'onClick': ()=>{计算审核量();},
              }, ["重算审核量"]),
            ]),
          ]),

          h(UserListControl, {
            'db': theDB,
            'settings': localData.listControlSettings,
            'managers': managers.value,
            'groups': groups.value,
            'batchnames': batchNames.value,
            'batchname': localData.selectedBatchName,
          }, {
            default: () => isManager(theMe) ? [
              h("button", {
                'type': "button",
                'class': "btn btn-sm btn-outline-dark my-1 me-2",
                'title': "新增用户",
                'onClick': (event)=>{ctx.emit('click-add-user-btn', event)},
              }, ["新增用户"]),
            ] : null,
          }),

          h("div", { 'class': "row align-items-center my-2", }, [
            h("div", { 'class': "col col-12 my-2", }, [
              h("div", { 'class': "container my-2", },
                userList.value.map(user => h(UserListItem, {
                  'db': theDB,
                  'me': theMe,
                  'user': user,
                  'settings': props.settings,
                  'functions': theFN,
                  'batchname': localData.selectedBatchName,
                  'key': user.id,
                  'onClickUserDetailBtn': ()=>{ctx.emit('click-user-detail-btn', user);},
                  'onClickUserProgressBtn': ()=>{ctx.emit('click-user-progress-btn', user);},
                }))),
            ]),
          ]),

          // h("div", { 'class': "row align-items-center my-2", }, [
          //   h("div", { 'class': "col col-12 my-2", }, []),
          //   h("div", { 'class': "col col-12 my-2", }, []),
          // ]),
          // h("div", { 'class': "row align-items-center my-2", }, []),
          // h("div", { 'class': "row align-items-center my-2", }, []),
        ],
      ),
    ];
  },
};

export default UserListPanel;

