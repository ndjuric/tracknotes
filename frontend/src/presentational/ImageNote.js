import React from 'react';
import ActionIconBar from 'components/ActionIconBar';

function ImageNote(props) {
    return (
        <div className="mason">
            <img className="mimg" src={props.url}/>
            <ActionIconBar propType="image"
                           noteType={props.type}
                           noteId={props.id}
                           trash={props.trash}
                           setRootState={props.setRootState}
                           handleAction={props.handleAction}
            />
        </div>
    )
}

export default ImageNote;