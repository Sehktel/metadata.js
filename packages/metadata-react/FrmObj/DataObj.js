import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import {FormGroup} from 'material-ui/Form';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataObjToolbar from './DataObjToolbar';
import DataField from '../DataField';
import TabularSection from '../TabularSection';

import withStyles from '../styles/paper600';
import {withIface} from 'metadata-redux';

class DataObj extends MDNRComponent {

  static propTypes = {
    _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
    _acl: PropTypes.string,             // Права на чтение-изменение
    _meta: PropTypes.object,            // Здесь можно переопределить метаданные
    _layout: PropTypes.object,          // Состав и расположение полей, если не задано - рисуем типовую форму

    read_only: PropTypes.object,        // Элемент только для чтения

    handlers: PropTypes.object.isRequired, // обработчики редактирования объекта
  };

  constructor(props, context) {
    super(props, context);
    const {_mgr, _meta, match} = props;
    this._handlers = {
      handleSave: this.handleSave.bind(this),
      handleSend: this.handleSend.bind(this),
      handleMarkDeleted: this.handleMarkDeleted.bind(this),
      handlePrint: this.handlePrint.bind(this),
      handleAttachment: this.handleAttachment.bind(this),
      handleClose: this.handleClose.bind(this),
    };
    this.state = {_meta: _meta || _mgr.metadata()};
    _mgr.get(match.params.ref, 'promise').then((_obj) => {
      if(this._mounted) {
        this.setState({_obj}, () => this.shouldComponentUpdate(props));
      }
      else {
        this.state._obj = _obj;
        this.shouldComponentUpdate(props);
      }
    });
  }

  handleSave() {
    //this.props.handleSave(this.state._obj);
    const {_obj} = this.state;
    _obj && _obj.save();
  }

  handleSend() {
    this.props.handlers.handleSave(this.state._obj);
  }

  handleClose() {
    const {handlers, _mgr} = this.props;
    const {_obj} = this.state;
    handlers.handleNavigate(`/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
  }

  handleMarkDeleted() {
  }

  handlePrint() {
  }

  handleAttachment() {
  }

  handleValueChange(_fld) {
    return (event, value) => {
      const {_obj, handlers} = this.props;
      const old_value = _obj[_fld];
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''));
      handlers.handleValueChange(_fld, old_value);
    };
  }


  /**
   * Render part with fields.
   * @return {Element}
   */
  renderFields() {
    const elements = [];
    const {struct} = this.props;
    const {_meta, _obj} = this.state;

    if(!struct) {
      if(_obj instanceof $p.classes.DocObj) {
        elements.push(
          <FormGroup row key={`group_sys`}>
            <DataField _obj={_obj} key={`field_number_doc`} _fld="number_doc"/>
            <DataField _obj={_obj} key={`field_date`} _fld="date"/>
          </FormGroup>);
      }
      else if(_obj instanceof $p.classes.CatObj) {
        _meta.code_length && elements.push(<DataField _obj={_obj} key={`field_id`} _fld="id"/>);
        _meta.main_presentation_name && elements.push(<DataField _obj={_obj} key={`field_name`} _fld="name"/>);
        _meta.has_owners && elements.push(<DataField _obj={_obj} key={`field_owner`} _fld="owner"/>);
      }
      for (const _fld in _meta.fields) {
        _fld != 'predefined_name' && elements.push(<DataField fullWidth key={`field_${_fld}`} _obj={_obj} _fld={_fld}/>);
      }
    }

    return elements.length === 0 ? null : <FormGroup>{elements}</FormGroup>;
  }

  /**
   * Render part with tabular sections.
   * @return {Element} [description]
   */
  renderTabularSections() {
    const elements = [];
    const {_meta, _obj} = this.state;

    for (const ts in _meta.tabular_sections) {
      if(elements.length || Object.keys(_meta.fields).length) {
        elements.push(<Divider light key={`dv_${ts}`}/>);
      }
      elements.push(<div key={`ts_${ts}`} style={{height: 300}}>
        <TabularSection _obj={_obj} _tabular={ts}/>
      </div>);
    }

    return elements.length === 0 ? null : <FormGroup>{elements}</FormGroup>;
  }

  get ltitle() {
    const {_meta, _obj} = this.state;
    return (_obj && _obj.presentation) || _meta.obj_presentation || _meta.synonym;
  }

  render() {
    const {props, state, context, _handlers} = this;

    return state._obj ?
      [
        <DataObjToolbar key="toolbar" {..._handlers} closeButton={!context.dnr}/>,
        <FormGroup key="data" className={props.classes.spaceLeft}>
          {this.renderFields()}
          {this.renderTabularSections()}
        </FormGroup>
      ]
      :
      <LoadingMessage/>;
  }

}

export default withStyles(withIface(DataObj));

