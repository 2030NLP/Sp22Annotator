import {  reactive, onMounted, h  } from '../modules_lib/vue_3.2.31_.esm-browser.prod.min.js';

const UserListControl = {
  props: ["db", "settings", "managers", "groups", "batchnames", "user"],
  // emits: ['update:manager_id'],
  setup(props, ctx) {
    const localData = reactive({
      showQuittedUsers: false,
      // selectedManagerId: "【all】",
    });

    const spDB = props.db;
    const userProgress = (user) => spDB.userCurrBatchProgress(user);

    return () => [

      h("div", { 'class': "row align-items-center my-2", }, [
        h("div", { 'class': "col col-12 my-2", }, [
          h("div", {}, [

            //

            h("div", { 'class': "d-inline-block my-1 me-2 align-middle", }, [
              h("select", {
                'class': "form-select form-select-sm",
                'onChange': (event) => {
                  props.settings.managerFilter = event?.target?.value;
                },
              }, [
                h("option", { 'value': "【all】", 'selected': true, }, ["【按组长筛选】"]),

                ...props.managers.map(manager=>h("option", {
                  'value': manager.id,
                }, [manager.name])),

                h("option", { 'value': "", }, ["【empty】"]),
                h("option", { 'value': "【all】", }, ["【all】"]),
              ]),
            ]),

            h("div", { 'class': "d-inline-block my-1 me-2 align-middle", }, [
              h("select", {
                'class': "form-select form-select-sm",
                'onChange': (event) => {
                  props.settings.groupFilter = event?.target?.value;
                },
              }, [
                h("option", { 'value': "【all】", 'selected': true, }, ["【按组别筛选】"]),

                ...props.groups.map(group=>h("option", {
                  'value': group,
                }, [group])),

                h("option", { 'value': "", }, ["【empty】"]),
                h("option", { 'value': "【all】", }, ["【all】"]),
              ]),
            ]),

            h("div", { 'class': "d-inline-block my-1 me-2 align-middle", }, [
              h("select", {
                'class': "form-select form-select-sm",
                'onChange': (event) => {
                  props.settings.sortMethod = event?.target?.value;
                },
              }, [
                h("option", { 'value': "id+", 'selected': true, }, ["【排序方式】"]),
                h("option", { 'value': "id+", }, ["序号 升序"]),
                h("option", { 'value': "progress+", }, ["进度 升序"]),
                h("option", { 'value': "progress-", }, ["进度 降序"]),
                h("option", { 'value': "done+", }, ["总完成量 升序"]),
                h("option", { 'value': "done-", }, ["总完成量 降序"]),
                h("option", { 'value': "pass+", }, ["审核通过率 升序"]),
                h("option", { 'value': "pass-", }, ["审核通过率 降序"]),
              ]),
            ]),

            h("button", {
              'type': "button",
              'class': ["btn btn-sm my-1 me-2", props.settings.showQuittedUsers ? 'btn-primary' : 'btn-outline-primary'],
              'onClick': ()=>{
                props.settings.showQuittedUsers = !props.settings.showQuittedUsers;
              },
            }, ["显示/隐藏已退出人员"]),

            ctx?.slots?.default ? h("div", { 'class': "d-inline-block my-1 me-2 align-middle", }, ctx.slots.default()) : null,

            //

          ]),
        ]),
      ]),



    ];
  },
};

export default UserListControl;
