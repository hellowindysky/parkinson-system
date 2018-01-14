const state = {
  lastOperationTime: (new Date()).getTime(),

  subjectId: parseInt(sessionStorage.getItem('subjectId'), 10),

  // 这个变量代表是否已经通过“全部显示”的短信验证，不代表当前系统的实际脱敏与否
  hasRightToDisplaySensitiveInfo: false,

  // 表示是否显示脱敏字段，默认为“否”，即处于脱敏状态
  showSensitiveInfo: false,

  // 列表类型，默认为空
  listType: ''
};

export default state;
