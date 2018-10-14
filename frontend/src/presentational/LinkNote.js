import React from 'react';
import ActionIconBar from 'components/ActionIconBar';

function LinkNote(props) {
    return (
        <div className="mason">
            <div className="mtext murl">
                <a href={props.url}>{props.url}</a>
            </div>
            <ActionIconBar propType="url"
                           noteType={props.type}
                           noteId={props.id}
                           trash={props.trash}
                           setRootState={props.setRootState}
                           handleAction={props.handleAction}/>
        </div>
    )
}

export default LinkNote;