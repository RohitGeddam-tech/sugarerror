import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { isOutOfRange } from '../../../../utils/custom';
import Html from 'react-pdf-html';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    fontSize: 12,
    lineHeight: 1.5,
    width: 595,
    height: 845,
  },
  body: {
    flex: 1,
    padding: '0 42 0',
  },
  // Header styles start
  header: {
    top: 30
  },
  headerTop: {
    height: 125
  },
  customLetterheadImage: {
    height: 110,
    width: '100%',
    flexDirection: 'column',
  },
  defaultLetterheadWrapper: {
    padding: '0 0 0',
    margin: '0 42',
  },
  defaultLetterheadLogo: {
    maxHeight: '3cm',
    maxWidth: '5.5cm',
  },
  labDetails: {
    flexDirection: 'column',
    flexGrow: 6,
    textAlign: 'right',
    marginLeft: '1cm',
  },
  labName: {
    color: '#282C36',
    fontSize: 16,
  },
  labAddress: {
    marginLeft: '2.5cm',
    color: '#282C36',
    lineHeight: 1.2,
    marginBottom: 8,
  },

  // Body styles start
  patientDetails: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    borderTop: '1px solid #55575c',
    borderBottom: '1px solid #55575c',
    margin: '0 42 10',
    paddingTop: 10,
    height: 60
  },
  patientInfo: {
    minWidth: 250,
    marginBottom: '0.3cm',
  },

  // Test table css
  testSection: {
    position: 'relative',
    minHeight: 400,
    marginTop: 30
  },
  testName: {
    fontSize: 14,
    display: 'block',
    textAlign: 'center',
  },
  table: {
    lineHeight: 2,
  },
  tableHeadRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 5,
    marginTop: 10,
  },
  tableDataRow: {
    color: '#55575C',
  },
  firstCol: {
    width: '30%',
    color: '#55575C',
  },
  secondCol: {
    width: '45%',
    textAlign: 'left',
    color: '#282C36',
  },
  thirdCol: {
    width: '25%',
    textAlign: 'right',
    color: '#55575C',
  },
  groupTestName: {
    color: '#55575C',
  },
  moreInfoWrapper: {
    marginTop: 20
  },
  moreInfo: {
    marginBottom: 15,
  },
  labelText: {
    color: '#282C36',
    marginBottom: 5,
  },
  valueText: {
    color: '#55575C',
    whiteSpace:'nowrap',
    overflow:'auto'
  },
  endOfReport: {
    textAlign: 'center',
    marginBottom: 20,
  },
  technicianSign: { justifySelf: 'flex-end', width: '6cm', alignItems: 'flex-end' },

  // Footer styles start
  footer: {
    minHeight: 52,
    width: '100%',
    marginTop: 20,
  },
  customFooterImage: {
    height: 70,
    width: '100%',
  },

  // common styles
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },
  tableHead: {
    color: '#282C36',
    fontFamily: 'Helvetica-Bold',
  },
  highlight: {
    color: '#282C36',
    fontFamily: 'Helvetica-Bold',
  },
});

const parseEditorHtml = (value) => {
  value = value.replace(/<figure/gim, "<div ").replace(/\/figure>/gim, "/div>");
  const html = `<body>
  <style>
  *{
    margin: 0;
    padding: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #282C36;
    font-family: Helvetica;
  }
  ul, ol{
    margin: 0 16px 0 -20px;
  }
  li{
    margin-bottom: 5px;
  }
  strong {
    font-family: Helvetica-Bold;
  }
  .table {
    overflow-x: scroll;
    padding-top: 10px;
  }
  table{
    margin: 10px 0;
    width : 100%;
    height : 100%;
  }
  table, th, td {
    border: 1px solid #282C36;
  }
  td{
    padding: 3px 5px;
  }
  </style>
  <div class="editor-content">${value}</div>
  </body>`
  return <Html>{html}</Html>
}

const Result = ({ value, rangeTest, abnormal, reportType }) => {
  const outOfRange = rangeTest && isOutOfRange(rangeTest, value);

  return reportType == 'Pre-Defined Test Result' ? (
    <View style={styles.secondCol}>{parseEditorHtml(value)}</View>
  ) : (
    <Text style={[styles.secondCol, (outOfRange || abnormal) && styles.highlight]}>{value instanceof Object ? value.label : value}</Text>
  );
};

const PdfDocument = (props, ref) => {
  const { tests = [], reportData = {}, patient = {} } = props.data;
  const {
    letterhead_type,
    letterhead,
    footer,
    logo,
    techniciansSign: { print_technician_sign, imgPath: techSign, technician_name, technician_degree },
    doctorsSign: { print_doctor_sign, imgPath: docSign, doctor_name, doctor_degree },
    formatted_lab_name: labName,
    address_line_one,
    address_line_two,
    city,
    state,
    pincode,
    mobile,
    email,
  } = reportData;
  const { full_name, gender, age, referred_by, formatted_created_at } = patient;

  return (
    <Document style={styles.document}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View style={styles.headerTop}>
            {letterhead_type === 'custom' && letterhead.print_letterhead ? (
              letterhead.imagePreviewUrl || letterhead.imgPath ? (
                <Image src={letterhead.imagePreviewUrl || letterhead.imgPath} style={styles.customLetterheadImage} />
              ) : null
            ) : letterhead_type === 'default' ? (
              <View style={[styles.defaultLetterheadWrapper, styles.flexRow]}>
                {logo.imagePreviewUrl || logo.imgPath ? (
                  <Image src={logo.imagePreviewUrl || logo.imgPath} style={styles.defaultLetterheadLogo} />
                ) : null}
                <View style={styles.labDetails}>
                  <Text style={[styles.labName, styles.boldText]}>{labName || ''}</Text>
                  <View style={[styles.labAddress, styles.flexColumn]}>
                    <Text>{address_line_one ? `${address_line_one}, ` : '-'}</Text>
                    <Text>{address_line_two ? `${address_line_two}, ` : '-'}</Text>
                    <Text>{`${city || '-'}, ${state || '-'}, ${pincode || '-'}`}</Text>
                  </View>
                  <Text style={styles.boldText}>
                    {mobile || '-'} | {email || '-'}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientInfo}>
              <Text style={styles.boldText}>Patient Name : </Text>
              {full_name}
            </Text>
            <Text style={styles.patientInfo}>
              <Text style={styles.boldText}>Age / Sex : </Text>
              {`${age} / ${gender}`}
            </Text>
            <Text style={styles.patientInfo}>
              <Text style={styles.boldText}>Referred Doctor : </Text>
              {referred_by?.full_name || 'Self'}
            </Text>
            <Text style={styles.patientInfo}>
              <Text style={styles.boldText}>Date : </Text>
              {formatted_created_at}
            </Text>
          </View>
        </View>

        <View style={styles.body} wrap>
          {tests.map(
            (
              {
                value,
                appt_sub_tests,
                name,
                report_type,
                interpretation = '',
                technique = '',
                method = '',
                test_remark = '',
                remark = '',
                test_validation,
                unit,
                showRangeColumn,
                abnormal,
                note
              },
              ind,
            ) => (
              <View break={ind > 0} style={styles.testSection}>
                <Text style={[styles.testName, styles.boldText]}>{name}</Text>
                <View style={styles.table}>
                  <View style={[styles.tableHeadRow, styles.boldText]}>
                    <Text style={[styles.firstCol, styles.tableHead]}>Test</Text>
                    <Text style={[styles.secondCol, styles.tableHead]}>Result</Text>
                    {showRangeColumn ? <Text style={[styles.thirdCol, styles.tableHead]}>Normal Range</Text> : null}
                  </View>
                  {appt_sub_tests?.length ? (
                    appt_sub_tests.map(subTest => {
                      const { unit, report_type, test_validation } = subTest;
                      return (
                        <>
                          {subTest.test_type === 'group' ? (
                            <Text style={[styles.groupTestName, styles.boldText, { marginBottom: 3 }]}>{subTest.name}</Text>
                          ) : (
                            <></>
                          )}
                          {subTest?.appt_sub_tests?.length ? (
                            subTest.appt_sub_tests.map((groupTest, ind) => {
                              const { unit, report_type, test_validation } = groupTest;
                              const lastIndex = subTest.appt_sub_tests.length;
                              return (
                                <View
                                  style={[styles.tableDataRow, styles.flexRow, { marginBottom: ind === lastIndex - 1 ? 10 : 4, paddingLeft: 10 }]}
                                >
                                  <Text style={styles.firstCol}>{groupTest.name}</Text>
                                  <Result
                                    value={groupTest.value}
                                    rangeTest={report_type.name === 'Range' ? test_validation : null}
                                    abnormal={groupTest.abnormal}
                                    reportType={report_type.name}
                                  />
                                  <Text style={styles.thirdCol}>
                                    {report_type.name === 'Range'
                                      ? `${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                          test_validation?.range_to ? test_validation.range_to : 'NA'
                                        } ${unit?.name ? unit.name : ''}`
                                      : ''}
                                  </Text>
                                </View>
                              );
                            })
                          ) : (
                            <View style={[styles.tableDataRow, styles.flexRow, { marginBottom: 10 }]}>
                              <Text style={styles.firstCol}>{subTest.name}</Text>
                              <Result
                                value={subTest.value}
                                rangeTest={report_type.name === 'Range' ? test_validation : null}
                                abnormal={subTest.abnormal}
                                reportType={report_type.name}
                              />
                              <Text style={styles.thirdCol}>
                                {report_type.name === 'Range'
                                  ? `${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                      test_validation?.range_to ? test_validation.range_to : 'NA'
                                    } ${unit?.name ? unit.name : ''}`
                                  : ''}
                              </Text>
                            </View>
                          )}
                        </>
                      );
                    })
                  ) : (
                    <View style={[styles.tableDataRow, styles.flexRow, { marginBottom: 10 }]}>
                      <Text style={styles.firstCol}>{name}</Text>
                      <Result
                        value={report_type?.format.presentation.result ? (value instanceof Object ? value.label : value) : '-'}
                        rangeTest={report_type.name === 'Range' ? test_validation : null}
                        abnormal={abnormal}
                        reportType={report_type.name}
                      />
                      <Text style={styles.thirdCol}>
                        {report_type?.format.presentation.normal_range
                          ? `${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                              test_validation?.range_to ? test_validation.range_to : 'NA'
                            } ${unit?.name ? unit.name : ''}`
                          : ''}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.moreInfoWrapper} wrap>
                  {interpretation ? (
                    <View style={[styles.flexColumn, styles.moreInfo]} wrap>
                      <Text style={[styles.labelText, styles.boldText]}>Interpretation : </Text>
                      <View style={styles.valueText}>
                        {parseEditorHtml(interpretation)}
                      </View>
                    </View>
                  ) : null}
                  {method ? (
                    <View style={[styles.flexColumn, styles.moreInfo]} wrap>
                      <Text style={[styles.labelText, styles.boldText]}>Method : </Text>
                      <View style={styles.valueText}>
                        {parseEditorHtml(method)}
                      </View>
                    </View>
                  ) : null}
                  {technique ? (
                    <View style={[styles.flexColumn, styles.moreInfo]} wrap>
                      <Text style={[styles.labelText, styles.boldText]}>Technique : </Text>
                      <View style={styles.valueText}>
                        {parseEditorHtml(technique)}
                      </View>
                    </View>
                  ) : null}
                  {note ? (
                    <View style={[styles.flexColumn, styles.moreInfo]} wrap>
                      <Text style={[styles.labelText, styles.boldText]}>Note : </Text>
                      <View style={styles.valueText}>
                        {parseEditorHtml(note)}
                      </View>
                    </View>
                  ) : null}
                  {test_remark ? (
                    <View style={[styles.flexColumn, styles.moreInfo]} wrap>
                      <Text style={[styles.labelText, styles.boldText]}>Remark : </Text>
                      <View style={styles.valueText}>
                        {parseEditorHtml(test_remark)}
                      </View>
                    </View>
                  ) : null}
                  {remark ? (
                    <View style={[styles.flexColumn, styles.moreInfo]} wrap>
                      <Text style={[styles.labelText, styles.boldText]}>Lab Remarks : </Text>
                      <View style={styles.valueText}>
                        <Text>{remark}</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.boldText, styles.endOfReport]}>--------- End Of Report ---------</Text>
                <View style={[styles.flexRow, { marginBottom: 10 }]} wrap>
                  <View style={styles.flexColumn}>
                    <View style={{ order: 1, minHeight: '2cm' }}>
                      {print_technician_sign && techSign ? <Image src={techSign} style={{ width: '3.5cm', height: '2cm' }} /> : null}
                    </View>
                    <Text style={(styles.boldText, { order: 2, fontFamily: 'Helvetica-Bold', marginTop: 14 })}>{technician_name}</Text>
                    <Text style={{ order: 3, marginTop: 5 }}>{technician_degree}</Text>
                  </View>
                  <View style={[styles.flexColumn, styles.technicianSign]}>
                    <View style={{ order: 1, minHeight: '2cm' }}>
                      {print_doctor_sign && docSign ? <Image src={docSign} style={{ width: '3.5cm', height: '2cm' }} /> : null}
                    </View>
                    <Text style={[styles.boldText, { order: 2, marginTop: 14 }]}>{doctor_name}</Text>
                    <Text style={{ order: 3, marginTop: 5 }}>{doctor_degree}</Text>
                  </View>
                </View>
              </View>
            ),
          )}
        </View>
        <View style={styles.footer} fixed>
          {letterhead_type !== 'default' && letterhead.print_letterhead && footer ? (
            <div className="report-footer">
              {footer.imagePreviewUrl || footer.imgPath ? (
                <Image src={footer.imagePreviewUrl || footer.imgPath} style={styles.customFooterImage} />
              ) : null}
            </div>
          ) : (
            <View style={{ borderTop: '1px solid #55575c', margin: '0 42' }}></View>
          )}
        </View>
      </Page>
    </Document>
  );
};
export default PdfDocument;
