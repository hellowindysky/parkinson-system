const state = {
  lastOperationTime: (new Date()).getTime(),
  subjectId: parseInt(sessionStorage.getItem('subjectId'), 10),
  hasRightToDisplaySensitiveInfo: false,  // 这个变量代表是否已经通过“全部显示”的短信验证，不代表当前系统的实际脱敏与否
  showSensitiveInfo: false  // 表示是否显示脱敏字段，默认为“否”，即处于脱敏状态
};

export default state;
