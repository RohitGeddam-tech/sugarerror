import React, { memo, useCallback, useEffect, useState, useContext } from 'react';
import SelectInput from '../FormInputs/SelectInput/SelectInput';
import ReactPaginate from 'react-paginate';
import { ProfileContext } from '../../context/context';

const Pagination = props => {
  const { profile, setProfileData } = useContext(ProfileContext);
  const { width, data, filter, listName } = props;
  const [initials, setInitials] = useState({
    data: [],
    perPageObj: { label: '15', value: 15 },
  });
  const [pageState, setPageState] = useState({ per_page: 15, current_page: 1 });

  useEffect(() => {
    setInitials(initials => ({ ...initials, ...data }));
  }, [data]);

  const { total_pages, total, perPageObj } = initials;
  const { current_page, per_page } = pageState;

  useEffect(() => {
    if (filter.current_page === 1) {
      setPageState(pageState => ({ ...pageState, current_page: 1 }));
    }
  }, [filter]);

  useEffect(() => {
    if (current_page && per_page) data.getListPerPage({ ...filter, current_page, per_page });
  }, [current_page, per_page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageClick = useCallback(
    e => {
      const selectedPage = e.selected + 1;
      setPageState({
        ...pageState,
        current_page: selectedPage,
      });
    },
    [pageState],
  );

  const handlePerPage = useCallback(
    obj => {
      setInitials({
        ...initials,
        perPageObj: obj,
      });
      setPageState({
        current_page: 1,
        per_page: obj ? obj.value : initials.per_page,
      });
      setProfileData({ ...profile, perPageData: obj ? obj.value : initials.per_page, perPageValue: obj });
      localStorage.setItem('perPageData', obj ? obj.value : initials.per_page);
    },
    [profile, initials], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="paginate-container d-flex">
      {width > 768 ? (
        <div className="per-page-wrapper d-flex">
          <div>Rows per page :</div>
          <div className="form-group ">
            <SelectInput
              className="per-page-select"
              value={perPageObj}
              onChange={handlePerPage}
              options={[
                { label: '15', value: 15 },
                { label: '50', value: 50 },
                { label: '100', value: 100 },
                { label: '150', value: 150 },
              ]}
              isClearable={false}
            ></SelectInput>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="d-flex flex-column flex-md-row w-100 align-items-md-center justify-content-md-between">
        <div className="order-md-2 text-right page-count">
          <p>
            {`${(current_page - 1) * per_page + 1}-${
              current_page * per_page < total ? current_page * per_page : total
            } of ${total} ${listName}`}
          </p>
        </div>
        <div className="page-numbers-listing">
          <ReactPaginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={total_pages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={width > 768 ? 1 : 1}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            previousLinkClassName={total_pages < 2 ? 'disabled' : ''}
            nextLinkClassName={total_pages < 2 ? 'disabled' : ''}
            forcePage={current_page - 1}
          />
        </div>
      </div>
    </div>
  );
};
export default memo(Pagination);
