import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const TextEditor = ({value, onChange,error}) => {
    return (
        <div className="ck-editor-wrapper">
            <CKEditor
                editor={ ClassicEditor }
                data={value}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    onChange(data)
                } }
                config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList','insertTable','undo','redo',],
                }}
                style={{ innerHeight : 200}}
            />
            {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
        </div>
    )
}

export default TextEditor;