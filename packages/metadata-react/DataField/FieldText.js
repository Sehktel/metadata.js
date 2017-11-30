/**
 * ### Поле ввода текстовых данных
 *
 * @module FieldText
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import AbstractField from './AbstractField';
import withStyles from './styles';

class FieldText extends AbstractField {

  render() {
    const {props, _meta, isTabular, onChange} = this;
    const {_obj, _fld, classes, read_only, fullWidth} = props;

    return isTabular ?
      <input
        type="text"
        disabled={read_only}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_fld}
        value={_obj[_fld]}
        onChange={onChange}
      />
      :
      <TextField
        className={classes.formControl}
        fullWidth={fullWidth}
        margin="dense"
        disabled={read_only}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        InputProps={{placeholder: _fld}}
        value={_obj[_fld]}
        onChange={onChange}
      />;
  }
}

export default withStyles(FieldText);
