import React from 'react';
import 'assets/scss/Modal.scss';
import SweetAlert from 'sweetalert2-react';
import axios from 'axios';
import isUrl from 'is-url';
import {ApiRoutes} from './../lib/constants';

export default class EntryModal extends React.Component {
    constructor() {
        super();
        this.state = {
            noteType: 'regular',
            showAlert: false,
            alertType: false,
            alertTitle: '',
            alertMessage: ''
        };
        this.resetStateInputValues();
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleRadioChange(event) {
        this.setState({noteType: event.target.value});
        this.resetStateInputValues()
    }

    resetStateInputValues() {
        this.setState({
            text: '',
            title: '',
            imageUrl: '',
            linkUrl: '',
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.checkFields()) {
            return false;
        }

        let noteData = {};
        if (this.state['noteType'] === 'regular') {
            noteData = {title: this.state['title'], text: this.state['text']}
        } else if (this.state['noteType'] === 'image') {
            noteData = {url: this.state['imageUrl']}
        } else if (this.state['noteType'] === 'url') {
            noteData = {url: this.state['linkUrl']}
        }

        console.log(this.state['noteType']);
        if (!('noteId' in this.props) || !('noteType' in this.props)) {
            this.apiPost(noteData);
        } else {
            this.apiPatch(noteData);
        }
    }

    apiPost(data) {
        axios.post(ApiRoutes[this.state['noteType']], data)
            .then((response) => {
                console.log('ok');
                console.log(response);
                this.props['cancel']();
            })
            .catch((error) => {
                console.log('error');
                console.log(error);
            });
    }

    apiPatch(data) {
        let url = ApiRoutes[this.props['noteType']] + 'id/' + this.props['noteId'] + '/';
        axios.patch(url, data)
            .then((response) => {
                this.props['cancel']();
            })
            .catch(function (error) {
                console.log('apiPatch error');
            });
    }

    checkFields() {
        if (this.state.noteType === 'regular') {
            if (!('title' in this.state) || this.state.title === '') {
                this.setState(this.getAlertObject("Alert", "Please fill in the note title field", "warning"));
                return false;
            }
            if (!('text' in this.state) || this.state.text === '') {
                this.setState(this.getAlertObject("Alert", "Please fill in the note text field", "warning"));
                return false;
            }
        } else if (this.state.noteType === 'url') {
            if (!('linkUrl' in this.state) || this.state.linkUrl === '') {
                this.setState(this.getAlertObject("Alert", "Please fill in the URL field", "warning"));
                return false;
            }
            if (!(isUrl(this.state.linkUrl))) {
                this.setState(this.getAlertObject("Alert", "Input doesn't seem to be a URL", "warning"));
                return false;
            }
        } else if (this.state.noteType === 'image') {
            if (!('imageUrl' in this.state) || this.state.imageUrl === '') {
                this.setState(this.getAlertObject("Alert", "Please fill in the image URL field."));
                return false;
            }
            if (!(isUrl(this.state.imageUrl))) {
                this.setState(this.getAlertObject("Alert", "Input doesn't seem to be a URL."));
                return false;
            }
        }
        return true;
    }

    getFormForType() {
        switch (this.state.noteType) {
            case 'regular':
                return (
                    <div>
                        <input value={this.state.title}
                               type="text"
                               name="title"
                               placeholder="Title"
                               onChange={(event) => {
                                   this.setState({title: event.target.value});
                               }}
                        />
                        <br/>
                        <input value={this.state.text}
                               type="text"
                               name="text"
                               placeholder="Take a note..."
                               onChange={(event) => {
                                   this.setState({text: event.target.value});
                               }}
                        />
                    </div>
                );
            case 'image':
                return (
                    <div>
                        <input value={this.state.imageUrl}
                               type="text"
                               name="url"
                               placeholder="Enter Image URL"
                               onChange={(event) => {
                                   this.setState({imageUrl: event.target.value});
                               }}
                        />
                    </div>
                );
            case 'url':
                return (
                    <div>
                        <input value={this.state.linkUrl}
                               type="text"
                               name="url"
                               placeholder="Enter URL"
                               onChange={(event) => {
                                   this.setState({linkUrl: event.target.value});
                               }}
                        />
                    </div>
                );
        }
    }

    getAlertObject(title, message, type) {
        return {
            showAlert: true,
            alertType: type,
            alertMessage: message,
            alertTitle: title
        }
    }

    renderAlert() {
        return (
            <SweetAlert
                show={this.state.showAlert}
                title={this.state.alertTitle}
                type={this.state.alertType}
                text={this.state.alertMessage}
                onConfirm={
                    () => this.setState({
                        showAlert: false,
                        alertType: false,
                        alertMessage: '',
                    })
                }
            />
        )
    }

    displayEditData(editData) {
        if (editData['type'] === 'regular') {
            this.setState({title: editData['title'], text: editData['text']});
        } else if (editData['type'] === 'image') {
            this.setState({noteType: editData['type'], imageUrl: editData['url']});
        } else if (editData['type'] === 'url') {
            this.setState({noteType: editData['type'], linkUrl: editData['url']});
        }
    }

    componentDidMount() {
        if (!('noteId' in this.props) || !('noteType' in this.props)) {
            return false;
        }
        let url = ApiRoutes[this.props['noteType']] + 'id/' + this.props['noteId'] + '/';
        axios.get(url)
            .then((response) => {
                this.displayEditData(response.data);
            })
            .catch((error) => {
                console.log(error);
                this.props['cancel']();
            });
    }

    buttonString() {
        if (!('noteId' in this.props) || !('noteType' in this.props)) {
            return "Add a Note";
        }
        return "Edit Note";
    }

    render() {
        const renderForm = this.getFormForType();

        return (
            <div>
                <div className="modal-title modal-bold">Add/Edit Note</div>
                <div className="hr-full"></div>

                <div className="modal-title">
                    <div className="modal-grey">Choose what kind of note you would like to add:</div>
                    <form className="modalForm" onSubmit={this.handleSubmit}>
                        <fieldset>
                            <div className="item">
                                <input
                                    type="radio"
                                    value="regular"
                                    checked={this.state.noteType === "regular"}
                                    onChange={this.handleRadioChange}
                                />
                                <label className={this.state.noteType === "regular" && "radio-toggle"}>
                                    <span className="icon icon-notes"> </span>
                                    <span> Note</span>
                                </label>
                            </div>

                            <div className="item">
                                <input
                                    type="radio"
                                    value="image"
                                    checked={this.state.noteType === "image"}
                                    onChange={this.handleRadioChange}
                                />
                                <label className={this.state.noteType === "image" && "radio-toggle"}>
                                    <span className="icon icon-images"> </span>
                                    <span> Image</span>
                                </label>
                            </div>

                            <div className="item">
                                <input
                                    type="radio"
                                    value="url"
                                    checked={this.state.noteType === "url"}
                                    onChange={this.handleRadioChange}
                                />
                                <label className={this.state.noteType === "url" && "radio-toggle"}>
                                    <span className="icon icon-link"> </span>
                                    <span> Link</span>
                                </label>
                            </div>
                        </fieldset>

                        {renderForm}

                        {this.renderAlert()}

                        <div className="modal-button-div">
                            <div className="header-left"/>
                            <div className="header-right">
                                <a href="#" className="white-button" onClick={this.props['cancel']}>Cancel</a>
                            </div>
                            <div className="header-right">
                                <button type="submit" className="green-submit">{this.buttonString()}</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
