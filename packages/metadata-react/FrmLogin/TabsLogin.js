import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tabs, {Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import CnnSettings from './Settings';
import withPrm from 'metadata-redux/src/withPrm';
import withStyles from '../styles/paper600';

class TabsLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      login: props.user_name,
      password: $p.aes.Ctr.decrypt(props.user_pwd),
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  handleLogin () {
    const {props, state} = this;
    props.handleLogin(state.login, state.password);
  }

  // если изменили state - не перерисовываем
  shouldComponentUpdate({handleIfaceState, title}, {index}) {
    const ltitle = index ? 'Параметры подключения' : 'Авторизация...';
    if(title != ltitle){
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  render() {

    const {props, state, handleLogin} = this;
    const {classes, handleLogOut} = props;

    return (

      <Paper className={classes.root} elevation={4}>

        <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Вход"/>
          <Tab label="Подключение"/>
        </Tabs>

        {state.index === 0 &&
        <div>

          <TextField
            label="Имя пользователя"
            InputProps={{placeholder: 'login'}}
            fullWidth
            margin="normal"
            value={state.login}
            onChange={event => this.setState({ login: event.target.value })}
          />

          <TextField
            label="Пароль"
            InputProps={{placeholder: 'password'}}
            fullWidth
            margin="normal"
            type="password"
            value={state.password}
            onChange={event => this.setState({ password: event.target.value })}
          />
          <br/>

          {
            props.user.logged_in ?
              <Button raised
                      className={classes.button}
                      onClick={handleLogOut}>Выйти</Button>
              :
              <Button raised
                      className={classes.button}
                      disabled={!state.login || !state.password}
                      onClick={handleLogin}>Войти</Button>
          }

          <Button disabled={true} className={classes.button}>Забыли пароль?</Button>

        </div>
        }

        {state.index === 1 && <CnnSettings {...props}/>}

      </Paper>

    );
  }
}

TabsLogin.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  user_name: PropTypes.string,
  user_pwd: PropTypes.string,
};

export default withPrm(withStyles(TabsLogin));
