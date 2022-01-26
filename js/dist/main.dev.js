"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var the_vue = new Vue({
  el: '#bodywrap',
  data: {
    "file_meta_list": [],
    "current_file_meta": {},
    "data": [],
    "worker": "",
    "tag_map_1": ['无法判断', '不成立', '成立'],
    "tag_map_2": ['无法判断', '搭配不合适', '意义冲突', '语义变化不大', '语义变化大'],
    "showLoadLocalStorage": false,
    "documentId": -1,
    "desc": "空间关系认知语料标注",
    "apiVersion": "21-0131-00",
    "meta": {
      "workers": [],
      "createdTime": "2021-01-30",
      "modifiedTime": "2021-01-30",
      "stage": 1
    }
  },
  computed: {
    question_done_num: function question_done_num() {
      var self = this;
      var sum = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = self.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var dataItem = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = dataItem.clusters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var cluster = _step2.value;

              if (!cluster.neglect && cluster.question.trim() != "") {
                sum++;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return sum;
    },
    question_total_num: function question_total_num() {
      var self = this;
      var sum = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = self.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var dataItem = _step3.value;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = dataItem.clusters[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var cluster = _step4.value;
              var judgeType4Num = 0;
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = dataItem.changesObjects[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var changes_obj = _step5.value;

                  if (changes_obj.clusterId == cluster.id) {
                    if (changes_obj.judgeType == 4) {
                      judgeType4Num += 1;
                    }
                  }
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                    _iterator5["return"]();
                  }
                } finally {
                  if (_didIteratorError5) {
                    throw _iteratorError5;
                  }
                }
              }

              if (judgeType4Num <= 0) {
                cluster.neglect = true;
              } else {
                cluster.neglect = false;
                sum++;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return sum;
    },
    question_done_pct: function question_done_pct() {
      var self = this;
      if (self.question_total_num == 0) return "".concat(0, "%");
      return "".concat(self.question_done_num / self.question_total_num * 100, "%");
    },
    done_num: function done_num() {
      var self = this;
      var sum = 0;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = self.data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var dataItem = _step6.value;

          if (!dataItem.originalError) {
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = dataItem.changesObjects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var changes_obj = _step7.value;

                if (changes_obj.finished && !changes_obj.dropped) {
                  sum++;
                }

                ;
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                  _iterator7["return"]();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            ;
          }

          ;
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      ;
      return sum;
    },
    total_num: function total_num() {
      var self = this;
      var sum = 0;
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = self.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var dataItem = _step8.value;

          if (!dataItem.originalError) {
            sum += dataItem.sentencesLength;
          }

          ;
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      ;
      return sum;
    },
    done_pct: function done_pct() {
      var self = this;
      return "".concat(self.done_num / self.total_num * 100, "%");
    },
    done_num1: function done_num1() {
      var self = this;
      var sum = 0;
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = self.data[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var dataItem = _step9.value;

          if (!dataItem.originalError) {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = dataItem.changesObjects[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var changes_obj = _step10.value;

                if (changes_obj.judgeCorrection == 2 && changes_obj.judgeType == 4) {
                  if (changes_obj.choicesMade == 2) {
                    sum++;
                  }

                  ;
                }

                ;
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                  _iterator10["return"]();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }

            ;
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
              for (var _iterator11 = dataItem.clusters[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var _changes_obj = _step11.value;

                if (_changes_obj.originObject.choicesMade == 2) {
                  sum++;
                }

                ;
              }
            } catch (err) {
              _didIteratorError11 = true;
              _iteratorError11 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
                  _iterator11["return"]();
                }
              } finally {
                if (_didIteratorError11) {
                  throw _iteratorError11;
                }
              }
            }

            ;
          }

          ;
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      ;
      return sum;
    },
    total_num1: function total_num1() {
      var self = this;
      var sum = 0;
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = self.data[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var dataItem = _step12.value;

          if (!dataItem.originalError) {
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
              for (var _iterator13 = dataItem.changesObjects[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                var changes_obj = _step13.value;

                if (changes_obj.judgeCorrection == 2 && changes_obj.judgeType == 4) {
                  sum++;
                }

                ;
              }
            } catch (err) {
              _didIteratorError13 = true;
              _iteratorError13 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
                  _iterator13["return"]();
                }
              } finally {
                if (_didIteratorError13) {
                  throw _iteratorError13;
                }
              }
            }

            ;
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
              for (var _iterator14 = dataItem.clusters[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var _changes_obj2 = _step14.value;
                sum++;
              }
            } catch (err) {
              _didIteratorError14 = true;
              _iteratorError14 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion14 && _iterator14["return"] != null) {
                  _iterator14["return"]();
                }
              } finally {
                if (_didIteratorError14) {
                  throw _iteratorError14;
                }
              }
            }

            ;
          }

          ;
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
            _iterator12["return"]();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      ;
      return sum;
    },
    done_pct1: function done_pct1() {
      var self = this;
      return "".concat(self.done_num1 / self.total_num1 * 100, "%");
    }
  },
  methods: {
    submit: function submit(changes_obj) {
      var self = this;
      changes_obj.formFilled = true;
      changes_obj.finished = true;
    },
    onImport: function onImport() {
      var self = this;
      var fileList = document.forms["file-form"]["file-input"].files; // console.log(fileList);

      var file_meta_list = [];
      var idx = 0;
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = fileList[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var file = _step15.value;
          file_meta_list.push({
            "idx": idx,
            "name": file.name,
            "file": file,
            "url": URL.createObjectURL(file) // "content": "",

          });
          idx += 1;
        }
      } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion15 && _iterator15["return"] != null) {
            _iterator15["return"]();
          }
        } finally {
          if (_didIteratorError15) {
            throw _iteratorError15;
          }
        }
      }

      self.file_meta_list = file_meta_list;
      self.current_file_meta = file_meta_list[idx - 1]; // console.log(self.current_file_meta);

      self.readData();
    },
    onExport: function onExport() {
      var self = this;

      if (!this.worker) {
        alert("请填写姓名！");
      } else {
        var jn = JSON.stringify(self.makeExport(), null, 2);
        var filename = self.makeFileName(self.current_file_meta.name);
        var file = new File([jn], "".concat(filename), {
          type: "text/plain; charset=utf-8"
        });
        saveAs(file);
      }
    },
    makeExport: function makeExport() {
      var self = this;
      var product = {};
      product.documentId = self.documentId;
      product.desc = self.desc;
      product.apiVersion = self.apiVersion;
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
        for (var _iterator16 = self.data[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
          var dataItem = _step16.value;
          // 删掉句子，压缩文件大小
          var _iteratorNormalCompletion17 = true;
          var _didIteratorError17 = false;
          var _iteratorError17 = undefined;

          try {
            for (var _iterator17 = dataItem.changesObjects[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
              var changes_obj = _step17.value;
              changes_obj.sentence = [];
            }
          } catch (err) {
            _didIteratorError17 = true;
            _iteratorError17 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion17 && _iterator17["return"] != null) {
                _iterator17["return"]();
              }
            } finally {
              if (_didIteratorError17) {
                throw _iteratorError17;
              }
            }
          }

          ; // 添加工作人员，并去除人员列表中的空字符串

          if (dataItem.workers.indexOf(self.worker) == -1 && self.worker.trim() != "") {
            dataItem.workers.push(self.worker.trim());
          }

          ;
          dataItem.workers = dataItem.workers.filter(function (i) {
            return i != "";
          });
        }
      } catch (err) {
        _didIteratorError16 = true;
        _iteratorError16 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion16 && _iterator16["return"] != null) {
            _iterator16["return"]();
          }
        } finally {
          if (_didIteratorError16) {
            throw _iteratorError16;
          }
        }
      }

      ;
      product.data = self.data;

      if (true) {
        self.meta.modifiedTime = self.timeString(); // 添加工作人员，并去除人员列表中的空字符串

        if (self.meta.workers.indexOf(self.worker) == -1 && self.worker.trim() != "") {
          self.meta.workers.push(self.worker.trim());
        }

        ;
        self.meta.workers = self.meta.workers.filter(function (i) {
          return i != "";
        });
      }

      ;
      product.meta = self.meta;
      return product;
    },
    timeString: function timeString() {
      var self = this;
      var the_date = new Date();
      var str = "".concat(('' + the_date.getFullYear()).slice(2, 4)).concat(('' + (the_date.getMonth() + 1)).length == 1 ? '0' : '').concat(the_date.getMonth() + 1).concat(('' + the_date.getDate()).length == 1 ? '0' : '').concat(the_date.getDate(), "-").concat(('' + the_date.getHours()).length == 1 ? '0' : '').concat(the_date.getHours()).concat(('' + the_date.getMinutes()).length == 1 ? '0' : '').concat(the_date.getMinutes()).concat(('' + the_date.getSeconds()).length == 1 ? '0' : '').concat(the_date.getSeconds());
      return str;
    },
    makeFileName: function makeFileName(name) {
      var self = this;
      var time_str = self.timeString();
      var the_reg = /(--\d{6}-\d{6})?(\.[a-zA-Z0-9]+)$/; //let filename = name.replace(the_reg, `--${time_str}`);

      var filename = "\u7A7A\u95F4\u5173\u7CFB\u7406\u89E3-".concat(self.documentId, "-").concat(self.meta.stage == 1 ? "[标注]" : "[出题]", "-").concat(self.worker, "--").concat(time_str, ".json"); //filename = `${filename}.json`

      return filename;
    },
    readData: function readData() {
      var self = this;
      var reader = new FileReader();
      reader.readAsText(self.current_file_meta.file, "utf-8");

      reader.onload = function (evt) {
        var result = JSON.parse(this.result);
        var data = [];

        if ('desc' in result && result.desc == '空间关系认知语料标注') {
          data = result.data || [];
          self.documentId = result.documentId || -1; // self.apiVersion = result.apiVersion || self.apiVersion;

          self.meta = result.meta || {
            workers: [],
            createdTime: self.timeString(),
            modifiedTime: self.timeString(),
            stage: 1
          };
        } else if (result.length && 'originalSentence' in result[0]) {
          data = result;
        }

        ;
        self.data = self.repairData(data);
      };
    },
    readDataFromLocalStorage: function readDataFromLocalStorage() {
      var self = this;
      self.data = JSON.parse(window.localStorage['data']);
    },
    repairData: function repairData(data) {
      var self = this;
      var repaired_data = [];
      var count = 0;
      var _iteratorNormalCompletion18 = true;
      var _didIteratorError18 = false;
      var _iteratorError18 = undefined;

      try {
        for (var _iterator18 = data[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
          var dataItem = _step18.value;
          var repaired_item = {}; //
          // repaired_item.substitutableCount = dataItem.substitutableCount || -1;
          //

          self.documentId = typeof data.documentId != 'undefined' ? data.documentId : dataItem.documentId; // self.documentId = dataItem.documentId;

          repaired_item.documentId = dataItem.documentId;
          repaired_item.batchId = typeof dataItem.batchId != 'undefined' ? dataItem.batchId : -1;
          repaired_item.itemId = typeof dataItem.itemId != 'undefined' ? dataItem.itemId : -1;
          repaired_item.foundFre = typeof dataItem.foundFre != 'undefined' ? dataItem.foundFre : 0;
          repaired_item.originalError = dataItem.originalError || false;
          repaired_item.showSentences = dataItem.showSentences || false;
          repaired_item.showSentences2 = dataItem.showSentences2 || false;
          repaired_item.finished = dataItem.finished || false; //

          repaired_item.feedback1 = typeof dataItem.feedback1 != 'undefined' ? dataItem.feedback1 : ""; //

          repaired_item.droppedIdxs = [];
          repaired_item.sentencesLength = 0;
          repaired_item.branchLength = 0; //功能2

          repaired_item.newBranchLength = 0; //替换句里存在"成立，语义变化大"的被替换词个数

          repaired_item.newSentencesLength = 0; //两种"成立"的替换句总数
          //功能2

          repaired_item.clusters = dataItem.clusters || []; //

          repaired_item.workers = dataItem.workers || [];
          repaired_item.originalSentence = dataItem.originalSentence || [];
          var _iteratorNormalCompletion19 = true;
          var _didIteratorError19 = false;
          var _iteratorError19 = undefined;

          try {
            for (var _iterator19 = repaired_item.originalSentence[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
              var frag = _step19.value;

              if (frag.substitutable) {
                frag.notSpatial = typeof frag.notSpatial != 'undefined' ? frag.notSpatial : false;
              } else {
                frag.notSpatial = typeof frag.notSpatial != 'undefined' ? frag.notSpatial : true;
              }

              ;
            }
          } catch (err) {
            _didIteratorError19 = true;
            _iteratorError19 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion19 && _iterator19["return"] != null) {
                _iterator19["return"]();
              }
            } finally {
              if (_didIteratorError19) {
                throw _iteratorError19;
              }
            }
          }

          var changesObjects = dataItem.changesObjects || dataItem.substitutedSentences || [];
          var repaired_changes_objs = [];
          var _iteratorNormalCompletion20 = true;
          var _didIteratorError20 = false;
          var _iteratorError20 = undefined;

          try {
            for (var _iterator20 = changesObjects[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
              var changes_obj = _step20.value;
              var repaired_changes_obj = {}; //

              repaired_changes_obj.docIdx = count; //替换句在文档中的编号

              count += 1; //

              repaired_changes_obj.changes = changes_obj.changes || changes_obj.substitutedWords || [];
              repaired_changes_obj.changed_idxs = changes_obj.changed_idxs || [];
              repaired_changes_obj.clusterId = typeof changes_obj.clusterId != 'undefined' ? changes_obj.clusterId : -1; //

              repaired_changes_obj.finished = changes_obj.finished || false;
              repaired_changes_obj.judgeCorrection = typeof changes_obj.judgeCorrection != 'undefined' ? changes_obj.judgeCorrection : -1; // {'-1':'未判断', '0':'无法判断', '1':'不成立', 2:'成立'}

              repaired_changes_obj.judgeType = typeof changes_obj.judgeType != 'undefined' ? changes_obj.judgeType : -1; // {'-1':'未判断', '0':'无法判断', 1:'不成立，搭配不合适', 2:'不成立，意义冲突', 3:'成立，语义变化不大', 4:'成立，语义变化大'}
              //

              repaired_changes_obj.choices = changes_obj.choices || [{
                content: "材料语义错误"
              }, {
                content: "难以判断"
              }];
              repaired_changes_obj.choicesString = changes_obj.choicesString || "[\"\u6750\u6599\u8BED\u4E49\u9519\u8BEF\",\"\u96BE\u4EE5\u5224\u65AD\"]";
              repaired_changes_obj.choicesMade = typeof changes_obj.choicesMade != 'undefined' ? changes_obj.choicesMade : -1; //
              // repaired_changes_obj.localID = changes_obj.localID || -1;
              //

              repaired_changes_obj.whyNot = changes_obj.whyNot || {
                isDaPeiBuDang: false,
                isYuYiChongTu: false,
                isQiTa: false,
                text_1_1: '',
                text_1_2: '',
                text_2_1: '',
                text_2_2: '',
                text_3: ''
              };
              repaired_changes_obj.explanation = typeof changes_obj.explanation != 'undefined' ? changes_obj.explanation : "";
              repaired_changes_obj.formFilled = typeof changes_obj.formFilled != 'undefined' ? changes_obj.formFilled : false; //

              repaired_changes_objs.push(repaired_changes_obj);
            }
          } catch (err) {
            _didIteratorError20 = true;
            _iteratorError20 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion20 && _iterator20["return"] != null) {
                _iterator20["return"]();
              }
            } finally {
              if (_didIteratorError20) {
                throw _iteratorError20;
              }
            }
          }

          ;
          repaired_item.changesObjects = repaired_changes_objs;
          self.updateSpatial(repaired_item);
          self.updateSentences(repaired_item);
          repaired_data.push(repaired_item);
        }
      } catch (err) {
        _didIteratorError18 = true;
        _iteratorError18 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion18 && _iterator18["return"] != null) {
            _iterator18["return"]();
          }
        } finally {
          if (_didIteratorError18) {
            throw _iteratorError18;
          }
        }
      }

      ;
      return repaired_data;
    },
    genTmpCluster: function genTmpCluster(changesObject, dataItem) {
      // 初始化cluster信息
      var self = this;
      var tmp_cluster = {
        id: -1,
        dropped: changesObject.dropped,
        neglect: true,
        sentenceNum: 0,
        changed_idxs: changesObject.changed_idxs,
        changed: [],
        question: "",
        originObject: {
          choices: [{
            content: "材料语义错误",
            isCorrect: false
          }, {
            content: "难以判断",
            isCorrect: false
          }],
          choicesString: "[\"\u6750\u6599\u8BED\u4E49\u9519\u8BEF\",\"\u96BE\u4EE5\u5224\u65AD\"]",
          choicesMade: -1
        }
      };
      var _iteratorNormalCompletion21 = true;
      var _didIteratorError21 = false;
      var _iteratorError21 = undefined;

      try {
        for (var _iterator21 = changesObject.changes[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
          var change = _step21.value;
          // 添加被替换词信息
          tmp_cluster.changed.push({
            idx: change.idx,
            from: dataItem.originalSentence[+change.idx].word
          });
        }
      } catch (err) {
        _didIteratorError21 = true;
        _iteratorError21 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion21 && _iterator21["return"] != null) {
            _iterator21["return"]();
          }
        } finally {
          if (_didIteratorError21) {
            throw _iteratorError21;
          }
        }
      }

      ; // console.log(tmp_cluster);

      return tmp_cluster;
    },
    showSign: function showSign(dataItem, cluster) {
      var self = this;
      var cnt = 0;
      var _iteratorNormalCompletion22 = true;
      var _didIteratorError22 = false;
      var _iteratorError22 = undefined;

      try {
        for (var _iterator22 = dataItem.changesObjects[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
          var changes_obj = _step22.value;

          if (changes_obj.clusterId == cluster.id && changes_obj.judgeType == 4) {
            cnt += 1;
          }
        }
      } catch (err) {
        _didIteratorError22 = true;
        _iteratorError22 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion22 && _iterator22["return"] != null) {
            _iterator22["return"]();
          }
        } finally {
          if (_didIteratorError22) {
            throw _iteratorError22;
          }
        }
      }

      ; //cluster.Count = cnt;

      if (cnt > 0) return true;
      return false;
    },
    makeClusters: function makeClusters(dataItem) {
      //先对changesObjects中的每个替换词（未被drop）生成一个cluster，然后压缩clusters
      var self = this; //

      var oldClusters = dataItem.clusters; //
      // 重新生成 changed_idxs
      // 重新判断 changes_obj 是否被 drop

      var tmp_clusters = [];
      var _iteratorNormalCompletion23 = true;
      var _didIteratorError23 = false;
      var _iteratorError23 = undefined;

      try {
        for (var _iterator23 = dataItem.changesObjects[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
          var changes_obj = _step23.value;
          var changed_idxs = [];
          changes_obj.dropped = false;
          var _iteratorNormalCompletion25 = true;
          var _didIteratorError25 = false;
          var _iteratorError25 = undefined;

          try {
            for (var _iterator25 = changes_obj.changes[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
              var change = _step25.value;
              change.dropped = false; //indexOf()如果未找到则返回-1，“+”可将后面的字符串转换成数字值

              if (dataItem.droppedIdxs.indexOf(+change.idx) > -1) {
                //在drop列表中找到idx
                change.dropped = true;
                changes_obj.dropped = true;
              }

              ;
              changed_idxs.push(+change.idx);
            }
          } catch (err) {
            _didIteratorError25 = true;
            _iteratorError25 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion25 && _iterator25["return"] != null) {
                _iterator25["return"]();
              }
            } finally {
              if (_didIteratorError25) {
                throw _iteratorError25;
              }
            }
          }

          ;
          changes_obj.changed_idxs = changed_idxs; //

          if (!changes_obj.dropped) {
            //对每个替换词都生成cluster（有重复，需要去重）
            var tmp_cluster = self.genTmpCluster(changes_obj, dataItem);
            tmp_clusters.push(tmp_cluster);
          }

          ;
        }
      } catch (err) {
        _didIteratorError23 = true;
        _iteratorError23 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion23 && _iterator23["return"] != null) {
            _iterator23["return"]();
          }
        } finally {
          if (_didIteratorError23) {
            throw _iteratorError23;
          }
        }
      }

      ; //
      //
      // let example_final_cluster = {
      //     id: 6,
      //     dropped: false, question: "选哪个？",
      //     changed: [{idx: 13, from: "来"}, {idx: 25, from: "上面"}], changed_idxs: [13, 25],
      //     originObject: {
      //         choices: [{content:"别选这个",isCorrect: false}, {content:"选这个啦",isCorrect: true},
      //                   {content:"材料语义错误",isCorrect: false}, {content:"难以判断",isCorrect: false}],
      //         choicesString: `["别选这个","选这个啦","材料语义错误","难以判断"]`, choicesMade: -1,
      //     },
      // };
      //
      //
      // 把以前的数据写进来

      var tmp2_clusters = [];

      for (var _i = 0, _tmp_clusters = tmp_clusters; _i < _tmp_clusters.length; _i++) {
        var _tmp_cluster = _tmp_clusters[_i];
        var _iteratorNormalCompletion26 = true;
        var _didIteratorError26 = false;
        var _iteratorError26 = undefined;

        try {
          for (var _iterator26 = oldClusters[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
            var oldCluster = _step26.value;

            if (JSON.stringify(_tmp_cluster.changed) == JSON.stringify(oldCluster.changed)) {
              var _ccc = JSON.parse(JSON.stringify(oldCluster));

              _ccc.id = -1;
              tmp2_clusters.push(_ccc);
              _tmp_cluster.used = true;
            }

            ;
          }
        } catch (err) {
          _didIteratorError26 = true;
          _iteratorError26 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion26 && _iterator26["return"] != null) {
              _iterator26["return"]();
            }
          } finally {
            if (_didIteratorError26) {
              throw _iteratorError26;
            }
          }
        }

        ; // };
        // for (let tmp_cluster of tmp_clusters) {

        if (!_tmp_cluster.used) {
          var ccc = JSON.parse(JSON.stringify(_tmp_cluster));
          ccc.id = -1;
          tmp2_clusters.push(ccc);
        }

        ;
      }

      ; //
      // 重制 clusters 的序号
      //

      var tmp_json_clusters = [];

      for (var _i2 = 0, _tmp2_clusters = tmp2_clusters; _i2 < _tmp2_clusters.length; _i2++) {
        var tmp2_cluster = _tmp2_clusters[_i2];
        // console.log([tmp2_cluster.question]);
        var it = JSON.stringify(tmp2_cluster);
        tmp_json_clusters.push(it); // console.log([tmp2_cluster.question, it]);
      }

      ; // console.log(['bfr', ...tmp_json_clusters]);

      tmp_json_clusters = _toConsumableArray(new Set(tmp_json_clusters)); // 去重
      // console.log(['aft', ...tmp_json_clusters]);

      var clusters = [];

      for (var id in tmp_json_clusters) {
        clusters.push(JSON.parse(tmp_json_clusters[id]));
        clusters[id].id = id; // console.log(clusters[id]);
      }

      ; // console.log(clusters);

      dataItem.clusters = clusters;
      dataItem.branchLength = clusters.length; //
      //使 changes_obj 与 clusters 对应

      var _iteratorNormalCompletion24 = true;
      var _didIteratorError24 = false;
      var _iteratorError24 = undefined;

      try {
        for (var _iterator24 = dataItem.changesObjects[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
          var _changes_obj3 = _step24.value;
          var _iteratorNormalCompletion27 = true;
          var _didIteratorError27 = false;
          var _iteratorError27 = undefined;

          try {
            for (var _iterator27 = dataItem.clusters[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
              var cluster = _step27.value;

              if (JSON.stringify(cluster.changed_idxs) == JSON.stringify(_changes_obj3.changed_idxs)) {
                _changes_obj3.clusterId = cluster.id;
              }

              ;
            }
          } catch (err) {
            _didIteratorError27 = true;
            _iteratorError27 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion27 && _iterator27["return"] != null) {
                _iterator27["return"]();
              }
            } finally {
              if (_didIteratorError27) {
                throw _iteratorError27;
              }
            }
          }

          ;
        }
      } catch (err) {
        _didIteratorError24 = true;
        _iteratorError24 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion24 && _iterator24["return"] != null) {
            _iterator24["return"]();
          }
        } finally {
          if (_didIteratorError24) {
            throw _iteratorError24;
          }
        }
      }

      ; //
      //
    },
    updateSentences: function updateSentences(dataItem) {
      var self = this; //

      self.makeClusters(dataItem); //
      // 重新生成 changes_obj 对应的 sentence
      // 顺便计算句子数量

      dataItem.sentencesLength = 0;
      var _iteratorNormalCompletion28 = true;
      var _didIteratorError28 = false;
      var _iteratorError28 = undefined;

      try {
        for (var _iterator28 = dataItem.changesObjects[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
          var changes_obj = _step28.value;
          changes_obj.sentence = [];

          if (!changes_obj.dropped) {
            //如果替换词未被drop
            // changes_obj.localID = dataItem.sentencesLength;
            dataItem.sentencesLength += 1;
            self.makeSentence(changes_obj, dataItem);
          }

          ;
        }
      } catch (err) {
        _didIteratorError28 = true;
        _iteratorError28 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion28 && _iterator28["return"] != null) {
            _iterator28["return"]();
          }
        } finally {
          if (_didIteratorError28) {
            throw _iteratorError28;
          }
        }
      }

      ; //
    },
    makeSentence: function makeSentence(changes_obj, dataItem) {
      var self = this; //

      var sentence = [];
      var origin = dataItem.originalSentence;

      for (var idx in origin) {
        var frag = origin[idx];
        var thing = {
          POSTag: frag.POSTag,
          isEntity: frag.isEntity,
          substitutable: frag.substitutable && !frag.notSpatial,
          notSpatial: frag.notSpatial
        };
        var idy = changes_obj.changed_idxs.indexOf(+idx);
        var change = changes_obj.changes[+idy];

        if (idy > -1 && !change.dropped) {
          thing.word = change.to;
          thing.word_origin = frag.word;
          thing.changed = true;
          thing.bert = change.bert || false;
        } else {
          thing.word = frag.word;
          thing.word_origin = null;
          thing.changed = false;
          thing.bert = false;
        }

        ;
        sentence.push(thing);
      }

      ;
      changes_obj.sentence = sentence;
    },
    updateSpatial: function updateSpatial(dataItem) {
      //更新每个句子drop掉的空间方位词在句子中的索引
      var self = this;
      dataItem.droppedIdxs = [];
      var frags = dataItem.originalSentence;

      for (var idx in dataItem.originalSentence) {
        if (frags[idx].substitutable && frags[idx].notSpatial) {
          dataItem.droppedIdxs.push(+idx);
        }

        ;
      }

      ; // self.updateSentences(dataItem);
    },
    changeSpatial: function changeSpatial(frag, dataItem) {
      var self = this;

      if (frag.substitutable) {
        frag.notSpatial = !frag.notSpatial;
      }

      ;
      dataItem.showSentences = false;
      self.updateSpatial(dataItem);
      self.updateSentences(dataItem);
    },
    judge: function judge(changes_obj, xx) {
      var self = this; // 点击保存的时候

      if (xx[0] == 1 && xx[1] == 6) {
        if (!(changes_obj.whyNot.text_1_1 && changes_obj.whyNot.text_1_2 || changes_obj.whyNot.text_2_1 && changes_obj.whyNot.text_2_2 || changes_obj.whyNot.text_3)) {
          alert('请填写原因');
        } else {
          changes_obj.judgeCorrection = xx[0];
          changes_obj.judgeType = xx[1];

          if (window.localStorage) {
            window.localStorage['data'] = JSON.stringify(self.data);
            window.localStorage['documentId'] = self.documentId;
          }
        }
      } else {
        changes_obj.judgeCorrection = xx[0];
        changes_obj.judgeType = xx[1];
      }

      if (xx[0] == 1 && (xx[1] == 1 || xx[1] == 2)) {} else if (xx[0] != -1 && xx[1] != -1) {
        changes_obj.finished = true;
      } else if (xx[0] == -1 && xx[1] == -1) {
        changes_obj.finished = false;
        changes_obj.explanation = "";
        changes_obj.formFilled = false;
        changes_obj.whyNot = {
          isDaPeiBuDang: false,
          isYuYiChongTu: false,
          isQiTa: false,
          text_1_1: '',
          text_1_2: '',
          text_2_1: '',
          text_2_2: '',
          text_3: ''
        };
      }

      ;
    },
    makeChoices: function makeChoices(changes_obj) {
      var self = this;
      var choice_contents = [];

      try {
        choice_contents = JSON.parse(changes_obj.choicesString);
        changes_obj.choicesMade = 1;
      } catch (eee) {
        changes_obj.choicesString += "\u3010\u6570\u636E\u683C\u5F0F\u9519\u8BEF\uFF08".concat(eee, "\uFF09\uFF01\u3011");
        console.log("\u3010\u6570\u636E\u683C\u5F0F\u9519\u8BEF\uFF08".concat(eee, "\uFF09\uFF01\u3011"));
        changes_obj.choicesMade = 0;
      } finally {
        changes_obj.choices = [{
          content: "材料语义错误",
          isCorrect: false
        }, {
          content: "难以判断",
          isCorrect: false
        }];
        var _iteratorNormalCompletion29 = true;
        var _didIteratorError29 = false;
        var _iteratorError29 = undefined;

        try {
          for (var _iterator29 = choice_contents[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
            choice_content = _step29.value;
            if (choice_content != "难以判断" && choice_content != "材料语义错误") changes_obj.choices.push({
              content: choice_content,
              isCorrect: false
            });
          }
        } catch (err) {
          _didIteratorError29 = true;
          _iteratorError29 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion29 && _iterator29["return"] != null) {
              _iterator29["return"]();
            }
          } finally {
            if (_didIteratorError29) {
              throw _iteratorError29;
            }
          }
        }

        ;
      }

      ;
    },
    makeCorrect: function makeCorrect(answer, changes_obj) {
      var self = this;
      var _iteratorNormalCompletion30 = true;
      var _didIteratorError30 = false;
      var _iteratorError30 = undefined;

      try {
        for (var _iterator30 = changes_obj.choices[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
          choice = _step30.value;
          choice.isCorrect = choice.content == answer; // console.log([choice.content,answer,choice.isCorrect]);
        }
      } catch (err) {
        _didIteratorError30 = true;
        _iteratorError30 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion30 && _iterator30["return"] != null) {
            _iterator30["return"]();
          }
        } finally {
          if (_didIteratorError30) {
            throw _iteratorError30;
          }
        }
      }

      ;
    },
    updateStage2Statistics: function updateStage2Statistics() {
      var self = this;
      var _iteratorNormalCompletion31 = true;
      var _didIteratorError31 = false;
      var _iteratorError31 = undefined;

      try {
        for (var _iterator31 = self.data[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
          var dataItem = _step31.value;
          var newBranchLength = 0;
          var newSentencesLength = 0;
          var _iteratorNormalCompletion32 = true;
          var _didIteratorError32 = false;
          var _iteratorError32 = undefined;

          try {
            for (var _iterator32 = dataItem.clusters[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
              var cluster = _step32.value;
              var judgeType3Num = 0;
              var judgeType4Num = 0;
              var _iteratorNormalCompletion33 = true;
              var _didIteratorError33 = false;
              var _iteratorError33 = undefined;

              try {
                for (var _iterator33 = dataItem.changesObjects[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
                  var changes_obj = _step33.value;

                  if (changes_obj.clusterId == cluster.id) {
                    if (changes_obj.judgeType == 3) {
                      judgeType3Num += 1;
                    } else if (changes_obj.judgeType == 4) {
                      judgeType4Num += 1;
                    }
                  }
                }
              } catch (err) {
                _didIteratorError33 = true;
                _iteratorError33 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion33 && _iterator33["return"] != null) {
                    _iterator33["return"]();
                  }
                } finally {
                  if (_didIteratorError33) {
                    throw _iteratorError33;
                  }
                }
              }

              if (judgeType4Num <= 0) {
                cluster.neglect = true;
              } else {
                cluster.neglect = false;
                cluster.sentenceNum = judgeType4Num + judgeType3Num;
                newBranchLength += 1;
                newSentencesLength += cluster.sentenceNum;
              }
            }
          } catch (err) {
            _didIteratorError32 = true;
            _iteratorError32 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion32 && _iterator32["return"] != null) {
                _iterator32["return"]();
              }
            } finally {
              if (_didIteratorError32) {
                throw _iteratorError32;
              }
            }
          }

          dataItem.newBranchLength = newBranchLength;
          dataItem.newSentencesLength = newSentencesLength;
        }
      } catch (err) {
        _didIteratorError31 = true;
        _iteratorError31 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion31 && _iterator31["return"] != null) {
            _iterator31["return"]();
          }
        } finally {
          if (_didIteratorError31) {
            throw _iteratorError31;
          }
        }
      }
    },
    stage: function stage(num) {
      var self = this;

      if (num == 2) {
        self.updateStage2Statistics();
      }

      self.meta.stage = num;
    }
  },
  watch: {
    documentId: function documentId(val) {
      // 如果有localStorage，且对于该documentId有缓存数据，就显示【加载缓存数据】按钮
      console.log(window.localStorage['documentId'], val);

      if (window.localStorage && window.localStorage['documentId'] == val) {
        this.showLoadLocalStorage = true;
      } else {
        this.showLoadLocalStorage = false;
      }
    }
  },
  mounted: function mounted() {// 如果有标注者，则自动填入标注者
    // if (!self.worker){
    //     let self = this;
    //     self.worker = self.meta.workers ? self.meta.workers.slice(-1)[0] : ''
    // }
  } // beforeDestroyed() {
  //     let self = this;
  // },

}); // Vue.component('sentence-dataItem', {
//     props: ['origin', 'changesets'],
//     template: ``,
//     data() {
//         return {}
//     },
//     computed: {
//         // audio: function() {
//             // let self = this;
//         //     return self.$refs.audio ? self.$refs.audio : {"currentTime": 0};
//         // },
//         // audio_currentTime: function() {
//             // let self = this;
//         //     return self.audio.currentTime;
//         // },
//         // player_range_should_end: function() {
//             // let self = this;
//         //     return self.audio_currentTime*1000 >= self.player.range.end;
//         // },
//     },
//     methods: {
//         // happy: function() {},
//     },
// }