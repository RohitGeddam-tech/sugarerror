import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { OutlinedButton, ContainedButton } from '../../Buttons/Button';
import CheckboxInput from '../../FormInputs/Checkbox/CheckboxInput';
import { Attachment } from '../../../assets/icons';

function UploadImage({
  label,
  className = '',
  showCancelBtn,
  showRemoveBtn,
  showSaveChangeBtn,
  imageObj,
  onChange,
  handleSubmit,
  checkboxObj,
  error,
  deleteImage,
  imgClass,
  emptyText,
}) {
  const attachmentRef = useRef(null);
  const [image, setImage] = useState({});
  const [checked, setChecked] = useState(false);
  const [updateCheck, setUpdateCheck] = useState(false);
  const [removeImg, setRemoveImg] = useState(false);

  useEffect(() => {
    if (image) onChange(image);
  }, [image]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileUpload = useCallback(
    e => {
      e.preventDefault();
      setRemoveImg(false);
      let files = attachmentRef.current.files;
      let reader = new FileReader();
      let file = files[0];
      if (file) {
        reader.onloadend = () => {
          setImage({
            file,
            imagePreviewUrl: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [attachmentRef],
  );

  const handleRemoveImage = useCallback(() => {
    setImage({ file: '', imagePreviewUrl: { value: null } });
    deleteImage && deleteImage();
    setRemoveImg(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isChecked = useMemo(() => (updateCheck ? checked : checkboxObj?.checked), [updateCheck, checked, checkboxObj]);
  
  return (
    <div className={`upload-img ${className}`}>
      {label && <label className="label">{label}</label>}
      <div className="img-wrapper d-block mb-3 w-100">
        {(image?.imagePreviewUrl ? image.imagePreviewUrl : imageObj?.imgPath) ? (
          <img
            className={imgClass}
            src={image?.imagePreviewUrl ? image.imagePreviewUrl : imageObj?.imgPath ? imageObj.imgPath : ''}
            alt=""
          />
        ) : (
          <div className="empty-image-div">{emptyText}</div>
        )}
      </div>
      {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
      <div className="d-flex align-items-center justify-content-end">
        {showCancelBtn ||
          (showRemoveBtn && (image?.imagePreviewUrl?.value || imageObj?.imgPath) && (
            <OutlinedButton red className="mr-2" onClick={handleRemoveImage}>
              {showRemoveBtn ? 'Remove' : 'Cancel'}
            </OutlinedButton>
          ))}
        <label className="btn btn-outline blue-outline d-block mt-2">
          {image?.imagePreviewUrl?.value || imageObj?.imgPath ? 'Change' : <>{Attachment} Select a file</>}
          <input type="file" size="" accept=".png,.jpeg,.jpg" ref={attachmentRef} style={{ display: 'none' }} onChange={handleFileUpload} />
        </label>
      </div>
      {checkboxObj && checkboxObj.show && (
        <CheckboxInput
          name="registerWithSameDetails"
          label={checkboxObj.label}
          checked={isChecked}
          value={checkboxObj.key}
          blue
          onClick={() => setChecked(!isChecked) || setUpdateCheck(true)}
        />
      )}
      {showSaveChangeBtn && (
        <>
          <div className="divider my-2 mx-5"></div>
          <div className="d-flex align-items-center justify-content-center ">
            <ContainedButton
              lightBlue
              color="primary"
              withIcon
              onClick={() => handleSubmit({ image, checked, remove: removeImg })}
            >
              Save Changes
            </ContainedButton>
          </div>
        </>
      )}
      {/* <label className="btn btn-outline blue-outline d-block">
              {Attachment}
              Select a file
              <input
                type="file"
                size=""
                accept=".png,.jpeg,.jpg"
                ref={attachmentRef}
                style={{ display: 'none' }}
                onChange={e => handleFileUpload(e, 'letterHead')}
              />
            </label> */}
    </div>
  );
}
export default UploadImage;
