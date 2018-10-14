import React from 'react'
import axios from 'axios';
import {ApiRoutes} from './../lib/constants';
import {CirclePicker} from 'react-color'

export default class ActionIconBar extends React.Component {
    constructor() {
        super();
        this.state = {
            pickerVisible: false,
            noteType: false,
            noteId: false
        };
    }

    handleColorChange(color) {
        this.apiPatch({"color": color['hex']})
    }

    circlePicker(color) {
        let colors = ["#FFFFFF", "#FFC5C0", "#B7E9FF", "#CFD8DC"];
        return (
            <div class="color-picker-container">
                <CirclePicker color={color}
                              colors={colors}
                              onChangeComplete={ this.handleColorChange.bind(this) }
                />
            </div>
        )
    }

    onEdit() {
        this.props['setRootState']({
            modal: true,
            noteId: this.props['noteId'],
            noteType: this.props['propType']
        });
    }

    onTrash() {
        this.apiPatch({"trash": "true"});
    }

    onUnTrash() {
        this.apiPatch({"trash": "false"});
    }

    apiPatch(data) {
        let url = ApiRoutes[this.props['noteType']] + 'id/' + this.props['noteId'] + '/';
        axios.patch(url, data)
            .then((response) => {
                this.props['handleAction']();
            })
            .catch(function (error) {
                console.log('apiPatch error');
            });
    }

    apiDelete() {
        let url = ApiRoutes[this.props['noteType']] + 'id/' + this.props['noteId'] + '/';
        axios.delete(url)
            .then((response) => {
                this.props.handleAction();
            })
            .catch(function (error) {
                console.log('apiDelete error');
            });
    }

    regularActionBar(color) {
        const onTogglePicker = () => this.setState({pickerVisible: !this.state.pickerVisible});

        return (
            <div class="mason-icon-bar">
                <a href="#" onClick={onTogglePicker}><i class="icon icon-color"/></a>
                <a href="#" onClick={() => {
                    this.onEdit()
                }}><i class="icon icon-edit"/></a>
                <a href="#" onClick={this.onTrash.bind(this)}><i class="icon icon-trash"/></a>
                { this.state.pickerVisible && this.circlePicker(color) }
            </div>
        )
    }

    urlActionBar() {
        return (
            <div class="mason-icon-bar">
                <a href="#" onClick={() => {
                    this.onEdit()
                }}><i class="icon icon-edit"/></a>
                <a href="#" onClick={this.onTrash.bind(this)}><i class="icon icon-trash"/></a>
            </div>
        )
    }

    imageActionBar() {
        return (
            <div class="mason-icon-bar mason-icon-bar-url">
                <a href="#" onClick={() => {
                    this.onEdit()
                }}><i class="icon icon-edit"/></a>
                <a href="#" onClick={this.onTrash.bind(this)}><i class="icon icon-trash"/></a>
            </div>
        )
    }

    trashActionBar(className) {
        return (
            <div class="mason-icon-bar">
                <div className={className}>
                    <a href="#" onClick={this.onUnTrash.bind(this)} className="mason-trash-href">Send back to Notes
                        |</a>
                    <a href="#" onClick={this.apiDelete.bind(this)}
                       className="mason-trash-href mason-trash-red">Remove</a>
                </div>
            </div>
        )
    }

    render() {
        let className = '';
        if (this.props['propType'] === "image") {
            className = 'mason-trash-full-width'
        }

        if (this.props['trash'] === true) {
            this.props['propType'] = "trash";
        }

        switch (this.props['propType']) {
            case 'regular':
                return this.regularActionBar(this.props['color']);
            case 'url':
                return this.urlActionBar();
            case 'image':
                return this.imageActionBar();
            case 'trash':
                return this.trashActionBar(className);
            default:
                return this.regularActionBar();
        }
    }
}
