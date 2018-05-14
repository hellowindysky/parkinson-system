<template lang="html">
  <div class="custom-table-wrapper" ref="customtable">
    <table class="table table-head" ref="tbhead" :class="{'table-shadow':boxShadowStatus}">
      <thead>
        <tr class="row title-row">
          <th class="col title-col"
           v-for="(item,index) in tableTitleData"
           :key="'tbtitle'+index"
           :rowspan="rowSpan(item)"
           :colspan="colSpan(item)"
           @click="dataSort(item)">
            <div :style="{width:colStyle[item.dataKey] ? colStyle[item.dataKey].width : ''}" class="coldiv">
              {{item.colName}}
            </div>
            <i class="iconfont" v-if="!item.subCol" :class="iconClass(item.dataKey)"></i>
          </th>
        </tr>
        <tr class="row title-row">
          <th class="col title-col"
           v-for="(item,index) in tableTitleData_sub"
           :key="'tbtitle_sub'+index"
           @click="dataSort(item)">
            <div :style="{width:colStyle[item.dataKey] ? colStyle[item.dataKey].width : ''}" class="coldiv">
              {{item.colName}}
            </div>
            <i class="iconfont" :class="iconClass(item.dataKey)"></i>
          </th>
        </tr>
      </thead>
    </table>

    <div class="table-box" :style="tableBoxStyle" @scroll="boxScroll" ref="tableBox">
      <div :style="lineWidth"></div>
      <table class="table">
        <tbody>
          <tr class="row content-row" v-for="(item,index) in tableContentData" :key="'data'+index">
            <td class="col content-col" v-for="(subItem,tdIndex) in tableTitleItems" :key="'col'+tdIndex">
              <div :ref="'td'+index">
                <span v-if="subItem.key.length===32 &&
                  (item[subItem.key]===undefined || item[subItem.key]==='')">
                  0
                </span>
                <span v-else>
                  {{item[subItem.key]}}
                </span>
              </div>
            </td>
          </tr>
          <tr class="row content-row total-row">
            <td class="col content-col" v-for="(subItem,tdIndex) in tableTitleItems" :key="'col'+tdIndex">
              <div v-if="tdIndex===0">
                合计
              </div>
              <div v-else>
                {{totalLine[subItem.key]}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="block" v-if="pageBtnStatus">
      <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :page-size="pageSize"
       :page-sizes="[500, 1000, 1500, 2000]"
       layout="sizes, prev, pager, next"
       :total="tableData.totalNum">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { deepCopy } from 'utils/helper.js';
export default {
  data() {
    return {
      tableContentData: [],
      order: false,
      colStyle: {},
      tableBoxStyle: {
        height: '',
        marginTop: 0
      },
      boxShadowStatus: false,
      lineWidth: {
        width: '0px'
      },
      pageSize: 500, // 每页显示多少条
      pageNo: 1 // 显示第几页
    };
  },
  props: {
    tableData: {
      type: Object,
      default: () => {}
    },
    pageBtnStatus: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tableTitleData() {
      if (this.tableData && Array.isArray(this.tableData.template)) {
        return this.tableData.template;
      } else {
        return [];
      }
    },
    tableTitleData_sub() {
      let sub = [];
      this.tableTitleData.forEach((item) => {
        if (item.subCol) {
          sub = sub.concat(item.subCol);
        }
      });
      return sub;
    },
    tableTitleItems() {
      let items = [];
      this.tableTitleData.forEach((item) => {
        if (item.subCol && Array.isArray(item.subCol)) {
          item.subCol.forEach((subItem) => {
            items.push({
              key: subItem.dataKey,
              type: subItem.dataType
            });
          });
        } else {
          items.push({
            key: item.dataKey,
            type: item.dataType
          });
        }
      });
      return items;
    },
    totalLine() {
      let totalNumObj = {};
      for (let item of this.tableTitleItems) {
        totalNumObj[item.key] = this.getTotalNum(item.key, item.type);
      }
      return totalNumObj;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      setTimeout(() => {
        this.$emit('sizeChange', {pageSize: this.pageSize, pageNo: this.pageNo});
      }, 0);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.$emit('pageChange', {pageSize: this.pageSize, pageNo: this.pageNo});
    },
    boxScroll() {
      let scrollLeft = this.$refs.tableBox.scrollLeft;
      this.$refs.tbhead.style.left = -scrollLeft + 'px';

      let scrollTop = this.$refs.tableBox.scrollTop;
      if (scrollTop > 0) {
        this.boxShadowStatus = true;
      } else {
        this.boxShadowStatus = false;
      };
    },
    rowSpan(item) {
      if (item.subCol && item.subCol.length > 0) {
        return 1;
      } else {
        return 2;
      }
    },
    colSpan(item) {
      if (item.subCol && item.subCol.length > 0) {
        return item.subCol.length;
      } else {
        return 1;
      }
    },
    dataSort(item) {
      let key = item.dataKey;
      if (!this.colStyle[key]) {
        return;
      }

      let dataType = item.dataType;
      var compare = function(x, y) {
        if (y[key] === undefined) {
          return false;
        } else if (x[key] === undefined) {
          return true;
        }
        if (dataType === 1) {
          return x[key] - y[key];
        } else if (dataType === 4) {
          return x[key].toString().localeCompare(y[key], 'zh');
        } else if (dataType === 5) {
          return new Date(x[key]).getTime() - new Date(y[key]).getTime();
        }
      };

      let colStyleItem = this.colStyle[key];
      if (colStyleItem.order === -1) {
        this.$set(colStyleItem, 'order', 1);
      } else if (colStyleItem.order === 1) {
        this.$set(colStyleItem, 'order', 0);
      } else if (colStyleItem.order === 0) {
        this.$set(colStyleItem, 'order', 1);
      }

      this.tableContentData.sort((a, b) => {
        if (colStyleItem.order === 1) {
          return compare(a, b);
        } else if (colStyleItem.order === 0) {
          return compare(b, a);
        } else if (colStyleItem.order === -1) {
          return;
        }
      });

      for (let colCurKey in this.colStyle) {
        if (colCurKey !== key) {
          this.$set(this.colStyle[colCurKey], 'order', -1);
        }
      }
      // 如果这一列有空的项，排完序后将空的项移到最后边
      let deletedArr = [];
      for (var i = 0; i < this.tableContentData.length; i++) {
        let item = this.tableContentData[i];
        if (item[key] === undefined) {
          deletedArr.push(this.tableContentData.splice(i, 1)[0]);
          i--;
        }
      }
      this.tableContentData = this.tableContentData.concat(deletedArr);
      // ---
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.customtable) {
          Ps.destroy(this.$refs.customtable);
          Ps.initialize(this.$refs.customtable, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    },
    iconClass(dataKey) {
      if (this.colStyle[dataKey]) {
        let order = this.colStyle[dataKey].order;
        return order === 1 ? 'icon-up' : order === 0 ? 'icon-down' : 'icon-sort';
      } else {
        return '';
      }
    },
    getTotalNum(key, type) {
      var total = 0;
      var cols = [];
      for (let lineData of this.tableContentData) {
        cols.push(lineData[key]);
      }
      if (type === 1) {
        for (let col of cols) {
          if (col) {
            total += Number(col);
          }
        }
      } else if (type === 4) {
        let set = new Set(cols);
        set.delete(undefined);
        set.delete('');
        total = set.size;
      }
      return total;
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.$refs.tbhead) {
        let h1 = this.$refs.tbhead.offsetHeight;
        let h2 = this.$refs.customtable.offsetHeight;
        this.$set(this.tableBoxStyle, 'height', h2 - h1 + 'px');
      }
    });
  },
  watch: {
    tableData: {
      handler: function(data) {
        this.colStyle = {};
        this.tableContentData = deepCopy(data.data);
        this.$nextTick(() => {
          this.tableTitleItems.forEach((item, index) => {
            if (this.$refs.td0 && this.$refs.td0[index]) {
              this.$set(this.colStyle, item.key, {width: this.$refs.td0[index].offsetWidth + 'px', order: -1});
            }
          });
          if (this.$refs.tbhead) {
            let h1 = this.$refs.tbhead.offsetHeight;
            let h2 = this.$refs.customtable.offsetHeight;
            this.$set(this.tableBoxStyle, 'height', h2 - h1 + 'px');
            this.$set(this.tableBoxStyle, 'marginTop', h1 + 'px');
            this.$set(this.lineWidth, 'width', this.$refs.tbhead.offsetWidth + 'px');
          }
          // this.updateScrollbar();
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.custom-table-wrapper{
  width: 100%;
  height:100%;
  overflow:hidden;
  font-size: @normal-font-size;
  box-sizing: border-box;
  user-select: text;
  position: relative;
  .table.table-head {
    position: absolute;
    top:0;
    left:0;
    &.table-shadow {
      transition: box-shadow 0.5s;
      box-shadow: 0 0 20px 0 #3c485a;
    }
  }
  .table-box {
    overflow: scroll;
  }
  .table {
    min-width: 100%;
    border: 1px solid @light-gray-color;
    border-collapse: collapse;
    .row {
      height: 30px;
      font-size: @normal-font-size;
      background-color: #fff;
      &.title-row {
        background-color: @font-color;
        color: #fff;
      }
      &.total-row {
        background-color: @light-font-color;
        color: #fff;
      }
      .col {
        min-width: 60px;
        border: 1px solid @light-gray-color;
        font-weight: normal;
        div {
          min-width: 60px;
        }
        &.title-col {
          cursor: pointer;
          position: relative;
          padding-left:16px;
          padding-right:16px;
          .coldiv {
            word-break: break-all;
            word-wrap:break-word;
          }
          i.iconfont {
            font-size: 12px;
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        &.content-col {
          white-space: nowrap;
          padding-left: 16px;
          padding-right: 16px;
        }
      }
    }
  }
  .ps__scrollbar-y-rail {
    position: absolute;
    width: 15px;
    right: 0;
    padding: 0 3px;
    box-sizing: border-box;
    opacity: 0.3;
    transition: opacity 0.3s, padding 0.2s;
    .ps__scrollbar-y {
      position: relative;
      background-color: #aaa;
      border-radius: 20px;
    }
  }
  &:hover {
    .ps__scrollbar-y-rail {
      opacity: 0.6;
      &:hover {
        padding: 0;
      }
    }
  }
  .block {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 10px 30px -10px #3c485a;
  }
}
</style>
