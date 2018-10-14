import React from 'react';
import ActionIconBar from 'components/ActionIconBar';

function RegularNote(props) {
    return (
        <div className="mason" style={{backgroundColor: props.color}}>
            <div className="mtext">
                <h2>{props.title}</h2>
                <p>{props.text}</p>
            </div>
            <ActionIconBar propType="regular"
                           noteType={props.type}
                           noteId={props.id}
                           color={props.color}
                           trash={props.trash}
                           setRootState={props.setRootState}
                           handleAction={props.handleAction}/>
        </div>
    )
}

export default RegularNote;