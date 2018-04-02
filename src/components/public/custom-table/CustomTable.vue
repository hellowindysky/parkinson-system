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
            <div :style="{width:colStyle[item.dataKey]}">
              {{item.colName}}
            </div>
            <i class="iconfont icon-sort" v-if="!item.subCol"></i>
          </th>
        </tr>
        <tr class="row title-row">
          <th class="col title-col"
           v-for="(item,index) in tableTitleData_sub"
           :key="'tbtitle_sub'+index"
           @click="dataSort(item)">
            <div :style="{width:colStyle[item.dataKey]}">
              {{item.colName}}
            </div>
            <i class="iconfont icon-sort"></i>
          </th>
        </tr>
      </thead>
    </table>

    <div class="table-box" :style="tableBoxStyle">
      <div :style="lineWidth"></div>
      <table class="table">
        <tbody>
          <tr v-if="tableContentData.length===0">
            <td>
              <div>无数据</div>
            </td>
          </tr>
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
      this.order = !this.order;

      var dataType = item.dataType;
      var key = item.dataKey;

      var compare = function(x, y) {
        if (y[key] === undefined) {
          return false;
        } else if (x[key] === undefined) {
          return true;
        }
        if (dataType === 1) {
          return x[key] - y[key];
        } else if (dataType === 4) {
          return x[key].localeCompare(y[key], 'zh');
        } else if (dataType === 5) {
          return new Date(x[key]).getTime() - new Date(y[key]).getTime();
        }
      };

      this.tableContentData.sort((a, b) => {
        return this.order ? compare(a, b) : compare(b, a);
      });
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
    }
  },
  mounted() {
  },
  watch: {
    tableData: {
      handler: function(data) {
        this.tableContentData = data.data;
        this.$nextTick(() => {
          if (this.$refs.td0) {
            this.tableTitleKeys.forEach((item, index) => {
              this.$set(this.colStyle, item, this.$refs.td0[index].offsetWidth + 'px');
            });
          }
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
          i.icon-order,i.icon-sort {
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
