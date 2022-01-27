import React, { useCallback } from 'react';
const { fetchRequest } = require('../../utils/api');
const { OutlinedButton } = require('../Buttons/Button');

const ExportExcel = ({ path, filter, selectedData }) => {
  const exportExcel = useCallback(() => {
    const { per_page = 15, current_page, search, date, date_from, date_to, sort } = filter;
    (async () => {
      let url = `${path}?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${search ? `&search=${search}` : ''}${
        date ? `&date=${date}` : ''
      }${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}${
        sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''
      }${
        typeof selectedData === 'boolean' || selectedData.length
          ? `&select=${typeof selectedData === 'boolean' ? 'all' : selectedData.length && selectedData.join()}`
          : ''
      }`;
      const res = await fetchRequest({ url, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        const data = await res.blob();
        const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
        const fileURL = URL.createObjectURL(file);
        const downloadLink = document.createElement('a');
        const fileName = `${path}.xlsx`;
        downloadLink.href = fileURL;
        downloadLink.download = fileName;
        downloadLink.click();
        return data;
      }
      return;
    })();
  }, [path, filter, selectedData]);

  return (
    <OutlinedButton className="export-excel" onClick={exportExcel}>
      Export Excel
    </OutlinedButton>
  );
};

export default ExportExcel;
