import {
  reactive,
  computed,
  onMounted,
  h,
} from '../modules_lib/vue_3.2.31_.esm-browser.prod.min.js';
import UserListControl from './UserListControl.cpnt.mjs.js';
import UserListItem from './UserListItem.cpnt.mjs.js';

const UserListPanel = {
  props: ["db", "settings", "me", "functions"],
  emits: ["happy", 'click-add-user-btn'],
  component: {
    UserListControl,
    UserListItem,
  },
  setup(props, ctx) {
    const localData = reactive({
      newestBatchName: "",
      总审核量文本: "",
      当批审核量文本: "",
    });

    const theDB = props.db;
    const theFN = props.functions;
    const ctrl = props.settings;
    const theMe = props.me;
    const isManager = (user) => {
      return user.role?.includes?.('manager') || user.role?.includes?.('admin');
    };

    const 计算审核量 = () => {
      let newestBatchName = (theDB.tasks??[]).sort((a, b)=>(+a.batch-b.batch)).map(it=>it.batchName).at(-1);
      let reviewedAnnos = theDB?.annos?.filter?.(it=>it?.content?.review) ?? [];
      let newestAnnos = theDB?.annos?.filter?.(it=>it?.batchName==newestBatchName) ?? [];
      let reviewedAnnosOfNewestBatchName = reviewedAnnos?.filter?.(it=>it.batchName==newestBatchName) ?? [];
      localData.newestBatchName = newestBatchName;
      localData.总审核量文本 = `${reviewedAnnos.length} / ${theDB?.annos?.length} = ${(reviewedAnnos.length/theDB?.annos?.length).toFixed(2)}`;
      localData.当批审核量文本 = `${reviewedAnnosOfNewestBatchName.length} / ${newestAnnos.length} = ${(reviewedAnnosOfNewestBatchName.length/newestAnnos.length).toFixed(2)}`;
      console.log(localData);
    };

    const userList = theDB.users??[];

    return () => [
      h("div", {
          'class': "container",
        }, [
          h(UserListControl, {
            'db': theDB,
            'settings': ctrl,
            'managers': theDB.users.filter(user=>isManager(user)),
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
            h("div", { 'class': "col col-12", }, [
              h("div", { 'class': "d-inline-block align-middle my-1 me-2", }, [
                "全部已审", " ", localData.总审核量文本, " | ",
                "最新批次", `(${localData.newestBatchName})`, "已审", " ", localData.当批审核量文本,
              ]),
              h("button", {
                'type': "button",
                'class': "btn btn-sm btn-outline-dark my-1 me-2",
                'title': "重算审核量",
                'onClick': ()=>{计算审核量();},
              }, ["重算审核量"]),
            ]),
          ]),
          h("div", { 'class': "row align-items-center my-2", }, [
            h("div", { 'class': "col col-12 my-2", }, [
              h("div", { 'class': "container my-2", },
                userList.map(user => h(UserListItem, {
                  'db': theDB,
                  'me': theMe,
                  'user': user,
                  'settings': props.settings,
                  'functions': theFN,
                  'key': user.id,
                }))),
            ]),
          ]),
          h("div", { 'class': "row align-items-center my-2", }, [
            h("div", { 'class': "col col-12 my-2", }, []),
            h("div", { 'class': "col col-12 my-2", }, []),
          ]),
          h("div", { 'class': "row align-items-center my-2", }, []),
          h("div", { 'class': "row align-items-center my-2", }, []),
        ],
      ),
    ];
  },
};

export default UserListPanel;

