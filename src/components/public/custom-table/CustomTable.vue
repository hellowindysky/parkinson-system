<template lang="html">
  <div class="custom-table-wrapper" ref="customtable" @scroll="tableScroll">
    <table class="table table-head" ref="tbhead" :class="{'table-shadow':boxShadowStatus}">
      <thead>
        <tr class="row title-row">
          <th class="col title-col"
           v-for="(item,index) in tableTitleData"
           :key="'tbtitle'+index"
           :rowspan="rowSpan(item)"
           :colspan="colSpan(item)"
           @click="dataSort(item)">
            <div :style="{width:colStyle[item.dataKey] ? colStyle[item.dataKey].width : ''}">
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
            <div :style="{width:colStyle[item.dataKey] ? colStyle[item.dataKey].width : ''}">
              {{item.colName}}
            </div>
            <i class="iconfont" :class="iconClass(item.dataKey)"></i>
          </th>
        </tr>
      </thead>
    </table>

    <div class="table-box" :style="tableBoxStyle">
      <div :style="lineWidth"></div>
      <table class="table">
        <tbody>
          <tr class="row content-row" v-for="(item,index) in tableContentData" :key="'data'+index">
            <td class="col content-col" v-for="(subItem,tdIndex) in tableTitleKeys" :key="'col'+tdIndex">
              <div :ref="'td'+index">
                {{item[subItem]}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
      }
    };
  },
  props: {
    tableData: {
      type: Object,
      default: () => {}
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
    tableTitleKeys() {
      let keys = [];
      this.tableTitleData.forEach((item) => {
        if (item.subCol && Array.isArray(item.subCol)) {
          item.subCol.forEach((subItem) => {
            keys.push(subItem.dataKey);
          });
        } else {
          keys.push(item.dataKey);
        }
      });
      return keys;
    }
  },
  methods: {
    tableScroll() {
      let scrollTop = this.$refs.customtable.scrollTop;
      this.$refs.tbhead.style.top = scrollTop + 'px';
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
    }
  },
  mounted() {
  },
  watch: {
    tableData: {
      handler: function(data) {
        this.colStyle = {};
        this.tableContentData = deepCopy(data.data);
        this.$nextTick(() => {
          this.tableTitleKeys.forEach((item, index) => {
            if (this.$refs.td0 && this.$refs.td0[index]) {
              this.$set(this.colStyle, item, {width: this.$refs.td0[index].offsetWidth + 'px', order: -1});
            }
          });
          if (this.$refs.tbhead) {
            let h1 = this.$refs.tbhead.offsetHeight;
            let h2 = this.$refs.customtable.offsetHeight;
            this.$set(this.tableBoxStyle, 'height', h2 - h1 + 'px');
            this.$set(this.tableBoxStyle, 'marginTop', h1 + 'px');
            this.$set(this.lineWidth, 'width', this.$refs.tbhead.offsetWidth + 'px');
          }
          this.updateScrollbar();
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
}
</style>
