import { TEACHER_DB_NAME } from '../config/dbName';
import { FindByActivateAreaOptions } from './aggregateConfig';
import { PersonDocument } from '../model/Person';

/**
 * 将person 转为指定的 teacher | student
 * @param person PersonDocument
 */
export const personToTeacherOrStudent = (person: PersonDocument): FindByActivateAreaOptions => {
  if (person.kind === TEACHER_DB_NAME) {
    return { teacher: person };
  }
  return { student: person };
};
