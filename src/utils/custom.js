import { fetchRequest } from './api';

const getInitials = function (string) {
  let names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const getNewRoles = ({ roles = [], lab_access, first_name, last_name, uuid }) => {
  let newRoles = [];
  [...roles].map(role => {
    return role.name === 'lab_user'
      ? lab_access &&
          lab_access.length &&
          lab_access.map(lab_user =>
            lab_user.lab_role.name === 'lab_admin'
              ? newRoles.push({
                  role: { formatted_name: lab_user.lab_role.formatted_name, name: lab_user.lab_role.name },
                  lab_name: lab_user.lab_group.name,
                  first_name,
                  last_name,
                  uuid: lab_user.lab_group.uuid,
                  reg_status: lab_user.lab_group.reg_status,
                })
              : lab_user.lab.uuid
              ? newRoles.push({
                  role: { formatted_name: lab_user.lab_role.formatted_name, name: 'lab', actual_role: lab_user.lab_role.name },
                  lab_name: lab_user.lab_group.name,
                  branch_name: lab_user.lab.name,
                  first_name,
                  last_name,
                  uuid: lab_user.lab.uuid,
                })
              : null,
          )
      : newRoles.push({
          role: { formatted_name: role.formatted_name, name: role.name },
          first_name,
          last_name,
          uuid: uuid,
        });
  });
  return newRoles;
};

const compilePieChartData = ({ labels = [], label = [], data }) => {
  return {
    labels: (labels.length && [...labels]) || (label.length && [...label]) || [],
    datasets: [
      {
        data: data?.length ? [...data] : [],
        backgroundColor: ['#66A2F7', '#A6DBFC', '#ECACA5', '#3562C5', '#E4F4FE', '#66A2F7', '#A6DBFC', '#ECACA5', '#3562C5', '#E4F4FE'],
        hoverBackgroundColor: [
          '#66A2F7',
          '#A6DBFC',
          '#ECACA5',
          '#3562C5',
          '#E4F4FE',
          '#66A2F7',
          '#A6DBFC',
          '#ECACA5',
          '#3562C5',
          '#E4F4FE',
        ],
      },
    ],
  };
};

const formatReportValues = (data,selectedTests) => {
  const tempTests = selectedTests || data.appointment_test || data.appointment_tests || [];
  let res = tempTests.map(item => {
    const groupTest = [];
    item.test.appt_sub_tests.filter(
      subItem => subItem.test.appt_sub_tests?.length && groupTest.push(...subItem.test.appt_sub_tests.flat()),
    );
    return item.test.appt_sub_tests.length
      ? {
          test_type: item.test.type,
          test_id: item.uuid,
          name: item.test.name,
          unit: item.test.unit,
          test_remark: item.test.remark,
          remark : item.remark,
          report_sent: item.report_sent,
          interpretation: item.test.interpretation,
          technique: item.test.technique,
          method: item.test.method,
          note: item.test.note,
          report_url : item.report_url || "",
          showRangeColumn:
            item.test.appt_sub_tests.flat()?.length &&
            [item.test.appt_sub_tests, groupTest].flat().some(data => data.test.report_type.name === 'Range'),
          appt_sub_tests: item.test.appt_sub_tests.map(subItem => ({
            test_type: subItem.test.type,
            test_id: subItem.uuid,
            name: subItem.test.name,
            unit: subItem.test.unit,
            value:
              subItem.test.report_type.name === 'Possible Test Results'
                ? subItem.result
                  ? { label: subItem.result, value: subItem.result }
                  : ''
                : subItem.test.report_type.name === 'Pre-Defined Test Result' && (!subItem.result || subItem.result == '')
                ? subItem.test.pre_define_result
                : subItem.result,
            report_type: subItem.test.report_type,
            test: subItem.test,
            possible_test_results: subItem.test.possible_test_results,
            pre_define_result: subItem.test.pre_define_result,
            test_validation: subItem.test_validation,
            abnormal: subItem.test.report_type.name === 'Possible Test Results' && subItem.abnormal,
            formula: subItem.test.formula,
            disabled : subItem.test.formula && subItem.test.formula.length,
            appt_sub_tests:
              subItem.test.type === 'group'
                ? subItem.test.appt_sub_tests.map(groupItem => ({
                    test_type: groupItem.test.type,
                    test_id: groupItem.uuid,
                    name: groupItem.test.name,
                    unit: groupItem.test.unit,
                    value:
                      groupItem.test.report_type.name === 'Possible Test Results'
                        ? groupItem.result
                          ? { label: groupItem.result, value: groupItem.result }
                          : ''
                        : groupItem.test.report_type.name === 'Pre-Defined Test Result' && (!groupItem.result || groupItem.result == '')
                        ? groupItem.test.pre_define_result
                        : groupItem.result,
                    report_type: groupItem.test.report_type,
                    possible_test_results: groupItem.test.possible_test_results,
                    pre_define_result: groupItem.test.pre_define_result,
                    test_validation: groupItem.test_validation,
                    abnormal: groupItem.test.report_type.name === 'Possible Test Results' && groupItem.abnormal,
                  }))
                : [],
          })),
        }
      : {
          test_type: item.test.type,
          test_id: item.uuid,
          name: item.test.name,
          unit: item.test.unit,
          showRangeColumn: item.test.report_type.name === 'Range',
          value:
            item.test.report_type.name === 'Possible Test Results'
              ? item.result
                ? { label: item.result, value: item.result }
                : ''
              : item.test.report_type.name === 'Pre-Defined Test Result' && (!item.result || item.result == '')
              ? item.test.pre_define_result
              : item.result,
          report_type: item.test.report_type,
          test_remark: item.test.remark,
          remark : item.remark,
          interpretation: item.test.interpretation,
          technique: item.test.technique,
          method: item.test.method,
          note: item.test.note,
          report_url : item.report_url || "",
          report_sent: item.report_sent,
          possible_test_results: item.test.possible_test_results,
          pre_define_result: item.test.pre_define_result,
          test_validation: item.test_validation,
          abnormal: item.test.report_type.name === 'Possible Test Results' && item.abnormal,
        };
  });
  return [...res];
};

const getUpdatedRoleData = async uuid => {
  const profileRes = await fetchRequest({ url: `/user_profile?include=roles,lab_access`, method: 'GET', isAuth: true });
  if (profileRes && profileRes.status === 200) {
    const { data } = await profileRes.json();
    return getNewRoles({ ...data }).find(role => role.uuid === uuid);
  }
};

// Takes an object of params to be send & returns query params as string from 
const getQueryParamStr = (params) => {
  let str = '';
  const keys = Object.keys(params);
  keys.forEach((key,ind) => {
    if(params[key]) str+=`${ind===0 ? '?' : '&'}${key}=${params[key]}`;
  });
  return str;
}

// Takes an object of form fields to be validated and returns errors {key: value,....} object 
const validateForm = (formFields) =>{
  const fieldsToValidate = Object.keys(formFields), errors={};
  fieldsToValidate.forEach(field => {
    if(!formFields[field] || typeof formFields[field] === 'object' && !Object.keys(formFields[field]).length) errors[field] = `The ${field.toLocaleLowerCase().split("_").join(' ')} field is required.`;
  });
  return errors;
}

const isOutOfRange = (range,result) =>{
  const min = parseFloat(range.range_from) ,max = parseFloat(range.range_to);
  result = parseFloat(result);
  return result < min || result > max;
} 

export { getInitials, getNewRoles, compilePieChartData, formatReportValues, getUpdatedRoleData, getQueryParamStr,validateForm,isOutOfRange};
