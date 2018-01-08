import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';        // сообщения в верхней части страницы (например, обновить после первого запуска)

export default function Snack({snack = {open: true}, handleClose}) {
  return <Snackbar
    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
    open={snack.open}
    message={snack.message || 'Требуется перезагрузить страницу после первой синхронизации данных'}
    action={<Button color="accent" onClick={handleClose}>Выполнить</Button>}
  />;
}

Snack.propTypes = {
  handleClose: PropTypes.func.isRequired,
  snack: PropTypes.object,
};
