
export const getTeacherMenu = () => {
  const version = Date.now();
  return {
    button: [
      {
        name: '新人注册',
        sub_button: [
          {
            type: 'view',
            name: '资料填写',
            url: `http://page.teacher.wx.carry.junn.top/teacher/teacherRegister?v=${version}`,
          }, {
            type: 'view',
            name: '了解Carry陪练',
            url: `http://page.teacher.wx.carry.junn.top/teacher/describe?v=${version}`,
          },
        ],
      },
      {
        name: '邀请有奖',
        sub_button: [
          {
            type: 'view',
            name: '邀请教师海报',
            url: `http://page.teacher.wx.carry.junn.top/teacher/inviteTeacher?v=${version}`,
          },
          {
            type: 'view',
            name: '邀请学生海报',
            url: `http://page.teacher.wx.carry.junn.top/teacher/inviteStudent?v=${version}`,
          },
          {
            type: 'view',
            name: '奖金细则',
            url: `http://page.teacher.wx.carry.junn.top/teacher/teacherBonus?v=${version}`,
          },
        ],
      },
      {
        name: '我的',
        sub_button: [
          {
            type: 'view',
            name: '我的课表',
            url: `http://page.teacher.wx.carry.junn.top/showCourse?v=${version}`,
          },
          {
            type: 'view',
            name: '我的薪资',
            url: `http://page.teacher.wx.carry.junn.top/teacher/teacherWage?v=${version}`,
          },
          {
            type: 'view',
            name: '奖金与规章',
            url: `http://page.teacher.wx.carry.junn.top/teacher/teacherSystem?v=${version}`,
          },
          {
            type: 'view',
            name: '请假',
            url: `http://page.teacher.wx.carry.junn.top/leaveList?v=${version}`,
          },
        ],
      },
    ],
  };
};

export const getStudentMenu = () => {
  const version = Date.now();
  return {
    button: [
      {
        name: '新人注册',
        sub_button: [
          {
            type: 'view',
            name: '资料填写',
            url: `http://page.student.wx.carry.junn.top/student/studentRegister?v=${version}`,
          },
        ],
      },
      {
        name: '邀请有奖',
        sub_button: [
          {
            type: 'view',
            name: '邀请海报',
            url: `http://page.student.wx.carry.junn.top/student/InviteStudent?v=${version}`,
          },
        ],
      },
      {
        name: '我的',
        sub_button: [
          {
            type: 'view',
            name: '我的课表',
            url: `http://page.student.wx.carry.junn.top/showCourse?v=${version}`,
          },
          {
            type: 'view',
            name: '请假',
            url: `http://page.student.wx.carry.junn.top/leaveList?v=${version}`,
          },
          {
            type: 'miniprogram',
            name: 'carry商城',
            url: `http://page.student.wx.carry.junn.top/student/studentRegister?v=${version}`,
            appid: 'wx88967eb0d53e3c3d',
            pagepath: 'pages/shelf/shelf',
          },
        ],
      },
    ],
  };
};
