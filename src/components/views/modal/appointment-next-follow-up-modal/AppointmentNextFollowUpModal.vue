<template lang="html">
  <div class="appoint-next-follow-up-wrapper">
    <div class="appoint-next-follow-up-modal">
      <h3 class="title">预约下次随访</h3>
      <div class="content">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ''
    };
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.appoint-next-follow-up-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .appoint-next-follow-up-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    max-height: 80%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
    }
  }
}
</style>
