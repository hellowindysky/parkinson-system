<template lang="html">
  <div class="custom-table-wrapper" ref="customtable">
    <table class="table">
      <thead>
        <tr class="row title-row">
          <th class="col title-col"
           v-for="(item,index) in tableTitleData"
           :key="'tbtitle'+index"
           :rowspan="rowSpan(item)"
           :colspan="colSpan(item)"
           @click="dataSort(item)">
            {{item.colName}}
            <i class="iconfont icon-sort" v-if="!item.subCol"></i>
          </th>
        </tr>
        <tr class="row title-row">
          <th class="col title-col"
           v-for="(item,index) in tableTitleData_sub"
           :key="'tbtitle_sub'+index"
           @click="dataSort(item)">
            {{item.colName}}
            <i class="iconfont icon-sort"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="row content-row" v-for="(item,index) in tableContentData" :key="'data'+index">
          <td class="col content-col" v-for="subItem in tableTitleKeys">{{item[subItem]}}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableContentData: [],
      order: false
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
    }
  },
  mounted() {
  },
  watch: {
    'tableData.data': function(data) {
      this.tableContentData = data;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.custom-table-wrapper{
  width: 100%;
  // height:100%;
  // overflow-x:scroll;
  // overflow-y:hidden;
  font-size: @normal-font-size;
  box-sizing: border-box;
  user-select: text;
  .table {
    height:100%;
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
        min-width: 70px;
        border: 1px solid @light-gray-color;
        font-weight: normal;
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
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
  }
}
</style>
