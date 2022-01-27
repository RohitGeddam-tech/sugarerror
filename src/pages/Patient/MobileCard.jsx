import React, { useContext } from 'react'
import { DownloadReport } from '../../assets/icons';
import { ContainedButton, OutlinedButton } from '../../components/Buttons/Button';
import Card from '../../components/Common/Card/Card'
import { ProfileContext } from '../../context/context';
import { fetchRequest } from '../../utils/api';
import { rupeeSymbol } from '../../utils/constants';

export default function MobileCard(props) {
    const { profile } = useContext(ProfileContext);
    const { columnDefs, tableData } = props;

    const downloadBill = async () => {
        const res = await fetchRequest({
          url: `/patient/${profile.selectedRole.uuid}/reports/${tableData.uuid}/download_receipt
        `,
          method: 'GET',
          isAuth: true,
        });
        if (res && res.status === 200) {
          const data = await res.blob();
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          const downloadLink = document.createElement('a');
          const fileName = `${tableData?.patient?.full_name||'patient'}_bill.pdf`;
          downloadLink.href = fileURL;
          downloadLink.download = fileName;
          downloadLink.click();
          return data;
        }
    }

    return (
        <Card title="Test Visit Details" cardName="mobile-details-card">
        {columnDefs &&
          columnDefs.length &&
          columnDefs.map(({ label, accessKey, renderIcon, classes = '',cellRenderer,defaultValue,isAmount = false,isActionColumn}, ind) => {
            let keys = accessKey ? accessKey.split('.') || [] : null,
                    dataValue = Array.isArray(keys) ? (keys.length > 1 ? tableData[`${keys[0]}`][`${keys[1]}`] : tableData[`${keys[0]}`]) : null;
            return (
            <React.Fragment key={ind}>
              {!renderIcon && (
                <ul className={`card-row single-detail ${isActionColumn ? 'action-column' : ''}`}>
                  <li className="label">{`${label} : `}</li>
                  {cellRenderer ? (
                    <li className={`value ${classes}`}>{cellRenderer(tableData, ind)}</li>
                  ) : dataValue || defaultValue ? (
                    <li className={`value ${classes}`}>
                      {isAmount ? rupeeSymbol + ' ' : ''}
                      {dataValue || defaultValue}
                    </li>
                  ) : null}
              </ul>
              )}
            </React.Fragment>
          )})}
          <div className="d-flex justify-content-between card-row card-buttons">
              <ContainedButton onClick={downloadBill} darkBlue>
                <div className="d-flex align-items-center">
                  <p className="mr-2">{DownloadReport}</p>
                  <p className="pt-1">Download Bill</p>
                </div>
              </ContainedButton>
              <OutlinedButton
              blue
              link
              to={{
                pathname: `/patient/view-report`,
                state: { reportId: tableData.uuid },
              }}
              disabled={!tableData.view_report}
            >
              View Report
            </OutlinedButton>
          </div>
      </Card>
    )
}
