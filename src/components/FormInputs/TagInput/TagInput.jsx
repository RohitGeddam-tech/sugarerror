import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagInput = ({ tags, suggestions, handleDelete, handleAddition, error }) => {
  return (
    <div>
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        allowUnique={false}
        delimiters={delimiters}
        placeholder=""
        autofocus={false}
      />
      {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
    </div>
  );
};
export default TagInput;
