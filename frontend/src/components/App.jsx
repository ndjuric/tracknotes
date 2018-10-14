import React from 'react';
import NotesPage from 'components/NotesPage';
import {BrowserRouter, Route, Link, NavLink, Redirect} from 'react-router-dom';
import notesTrackerLogo from 'assets/img/notestracker_logo.svg';
import {Modal, ModalContainer, ModalRoute} from 'react-router-modal';
import EntryModal from 'components/EntryModal';
import axios from 'axios';
import {ApiRoutes} from './../lib/constants';
import 'react-router-modal/css/react-router-modal.css';
import 'assets/scss/App.scss';
import 'assets/scss/Navigation.scss';
import 'assets/scss/Modal.scss';
import 'assets/scss/Masonry.scss';
import 'assets/scss/ColorPicker.scss';


class App extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            modal: false,
            noteId: false,
            noteType: false,
            noNotes: false,
            trash: []
        }
    }

    setRootState(state) {
        this.setState(state);
    }

    cancelModal() {
        this.setState({
            modal: false,
            noteId: false,
            noteType: false
        });
    }

    renderModal() {
        if (this.state['modal'] === false) {
            return ""
        }

        let modalProps = {
            cancel: this.cancelModal.bind(this)
        };

        if (this.state['noteId'] !== false) {
            modalProps['noteId'] = this.state['noteId'];
        }

        if (this.state['noteType'] !== false) {
            modalProps['noteType'] = this.state['noteType'];
        }

        return (
            <Modal
                component={EntryModal}
                props={modalProps}
                className='add-edit-modal'
                inClassName='add-edit-modal-in'
                outClassName='add-edit-modal-out'
                backdropClassName='add-edit-backdrop'
                backdropInClassName='add-edit-backdrop-in'
                backdropOutClassName='add-edit-backdrop-out'
                outDelay={500}
            >
            </Modal>
        )
    }

    apiGetTrash() {
        axios
            .get(ApiRoutes['trash'])
            .then(resp => {
                this.setState({
                    trash: resp.data
                })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        console.log('componentDidMount: App');
        this.interval = setInterval(
            () => this.apiGetTrash(), 2500
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    clearTrash() {

        this.state['trash'].map((trashedItem) => {
            let trashedItemType = trashedItem['type'];
            let trashedItemId = trashedItem['id'];
            let url = ApiRoutes[trashedItemType] + 'id/' + trashedItemId + '/';
            axios.delete(url)
                .then((response) => {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log('apiDelete error');
                });
        });
    }

    addNoteButton() {
        return (
            <a href="#"
               className="green-button"
               onClick={() => {
                   this.setRootState({modal: true, noteId: false, noteType: false})
               }}>
                Add New Note
            </a>
        )
    }

    clearTrashButton() {
        return (
            <a href="#"
               className="red-button"
               onClick={() => {
                   this.clearTrash();
               }}>
                Clear trash
            </a>
        )
    }

    render() {
        let topButton = "";
        if (this.state['type'] === 'trash') {
            if (this.state['trash'].length > 0) {
                topButton = this.clearTrashButton();
            }
        } else {
            if (this.state['noNotes'] === false) {
                topButton = this.addNoteButton();
            }
        }

        return (
            <BrowserRouter>
                <div className="app">
                    <aside className="hg__left nav">
                        <NavLink to="/">
                            <img className="logo" src={notesTrackerLogo}/>
                        </NavLink>
                        <nav>
                            <NavLink activeClassName='is-active' to="/notes">
                                <div className="nav-section">
                                    <h1>
                                        <span className="icon icon-all-notes"> </span>
                                        <span> All Notes</span>
                                    </h1>
                                </div>
                            </NavLink>


                            <NavLink activeClassName='sub-is-active' to="/notes/regular">
                                <div className="nav-subsection">
                                    <h1>
                                        <span className="icon icon-notes"> </span>
                                        <span> Notes</span>
                                    </h1>
                                </div>
                            </NavLink>


                            <NavLink activeClassName='sub-is-active' to="/notes/images">
                                <div className="nav-subsection">
                                    <h1>
                                        <span className="icon icon-images"> </span>
                                        <span> Images</span>
                                    </h1>
                                </div>
                            </NavLink>


                            <NavLink activeClassName='sub-is-active' to="/notes/links">
                                <div className="nav-subsection">
                                    <h1>
                                        <span className="icon icon-link"> </span>
                                        <span> Links</span>
                                    </h1>
                                </div>
                            </NavLink>

                            <div className="hr-modal"></div>

                            <NavLink to="/trash" activeClassName='is-active'>
                                <div className="nav-section">
                                    <h1>
                                        <span className="icon icon-trash"> </span>
                                        <span> Trash </span>
                                        {
                                            this.state['trash'].length > 0 &&
                                            <div class="numberCircle">{this.state['trash'].length}</div>
                                        }
                                    </h1>
                                </div>
                            </NavLink>

                        </nav>
                    </aside>
                    <header className="hg__header">
                        <div className="header">
                            <div className="header-left">Notes</div>
                            <div className="header-right">
                                {topButton}
                            </div>
                        </div>
                    </header>
                    <main className="hg__main">
                        <Route exact path="/" render={() => (
                            <Redirect to="/notes"/>
                        )}/>
                        <Route exact path="/notes" render={
                            () => <NotesPage setRootState={this.setRootState.bind(this)} type="all"/>
                        }/>
                        <Route exact path="/notes/regular" render={
                            () => <NotesPage setRootState={this.setRootState.bind(this)} type="regular"/>
                        }/>
                        <Route exact path="/notes/images" render={
                            () => <NotesPage setRootState={this.setRootState.bind(this)} type="image"/>
                        }/>
                        <Route exact path="/notes/links" render={
                            () => <NotesPage setRootState={this.setRootState.bind(this)} type="url"/>
                        }/>
                        <Route path="/trash" render={
                            () => <NotesPage setRootState={this.setRootState.bind(this)} type="trash"/>}
                        />
                        {this.renderModal()}
                    </main>
                    <ModalContainer />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
