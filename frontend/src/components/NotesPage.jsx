import React, {Component} from 'react';
import notesTrackerEmptyState from 'assets/img/notestracker_empty_state.svg';
import {Redirect} from 'react-router-dom';
import Masonry from 'react-masonry-component';
import axios from 'axios';
import {ApiRoutes} from './../lib/constants';
import RegularNote from '../presentational/RegularNote';
import ImageNote from '../presentational/ImageNote';
import LinkNote from '../presentational/LinkNote';

const masonryOptions = {
    transitionDuration: 0.5
};

export default class NotesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            redirect: false
        };
    }

    componentDidMount() {
        this.props['setRootState']({type: this.props['type']});
        this.reRender();
    }

    reRender() {
        let noteType = this.props['type'];
        this.apiGet(ApiRoutes[noteType])
    }

    apiGet(url) {
        axios
            .get(url)
            .then(resp => {
                this.setState({
                    notes: resp.data
                })
            })
            .catch(error => console.log(error))
    }

    componentWillReceiveProps(props) {
        this.reRender();
    }

    emptyStateForNotes() {
        return (
            <div className="central-div">
                <img className="central-content" src={notesTrackerEmptyState}/>
                <h1 className="central-content central-h1">Keep Track of Your Notes</h1>
                <h2 className="central-content central-h2">Click on a button below to add your first note.</h2>
                <a href="#"
                   className="central-content central-button"
                   onClick={() => {
                       this.props['setRootState']({modal: true, noteId: false, noteType: false})
                   }}>
                    Add New Note
                </a>
            </div>
        )
    }

    emptyStateForTrash() {
        return (
            <div className="central-div">
                <img className="central-content" src={notesTrackerEmptyState}/>
                <h1 className="central-content central-h1">You have no more files in trash</h1>
                <a href="#"
                   className="central-content central-button"
                   onClick={() => this.setState({redirect: true})}>
                    All Notes
                </a>
            </div>
        )
    }

    renderRedirect() {
        if (this.state['redirect']) {
            return <Redirect to="/notes"/>
        }
    }

    render() {
        let childElements;
        if (this.state['notes'].length > 0) {
            this.props['setRootState']({'noNotes': false});
            const setRootState = this.props['setRootState'];
            childElements = this.state['notes'].map((note) => {
                switch (note['type']) {
                    case 'regular':
                        return (
                            <RegularNote id={note.id}
                                         type={note.type}
                                         title={note.title}
                                         text={note.text}
                                         color={note.color}
                                         trash={note.trash}
                                         setRootState={setRootState}
                                         handleAction={this.reRender.bind(this)}
                            />
                        );
                    case 'image':
                        return (
                            <ImageNote id={note.id}
                                       type={note.type}
                                       url={note.url}
                                       trash={note.trash}
                                       setRootState={setRootState}
                                       handleAction={this.reRender.bind(this)}
                            />
                        );
                    case 'url':
                        return (
                            <LinkNote id={note.id}
                                      type={note.type}
                                      url={note.url}
                                      trash={note.trash}
                                      setRootState={setRootState}
                                      handleAction={this.reRender.bind(this)}
                            />
                        );
                }
            });
        } else {
            this.props['setRootState']({'noNotes': true});
            if (this.props['type'] === 'trash') {
                childElements = this.emptyStateForTrash()
            } else {
                childElements = this.emptyStateForNotes();
            }
        }

        return (
            <Masonry elementType={'div'} options={masonryOptions}>
                {childElements}
                {this.renderRedirect()}
            </Masonry>
        );
    }
}

