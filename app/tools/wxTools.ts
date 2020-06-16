
export const TEACHER_TYPE = 'teacher';
export const STUDENT_TYPE = 'student';

export function getAppidAndsecret(type: string | boolean) {
  let isTeacher: boolean;
  if (typeof type === 'string') {
    isTeacher = type === TEACHER_TYPE;
  } else {
    isTeacher = type;
  }
  if (isTeacher) {
    return {
      appid: 'wxa2c0420dfeaf8d24',
      secret: '97c578ea751117d8c77fc63480cba424',
    };
  }
  return {
    appid: 'wx76bedc76c343e5a2',
    secret: '15ff5d3185b0e164339f8a0a4ea17049',
  };

}

export function isTeacher(type: string) {
  return type === TEACHER_TYPE;
}
export function isStudent(type: string) {
  return type === STUDENT_TYPE;
}
