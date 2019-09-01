import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Components/layout/Header';
import Todos from './Components/Todos';
import AddTodo from './Components/AddTodo';
import About from './Components/pages/About';
// import uuid from 'uuid';
import axios from 'axios';

import './App.css';

class App extends Component {
  state = {
    todos: []
  }

  // lifecycle method 임
  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(res => this.setState({ todos: res.data }))
  }

  // Toggle Complete : 사용자 정의 함수는 안에 컴포넌트의 인자가 들어있을 경우 에로우 함수로 만들거나
  // 호출시점에서 bind 함수로 연결해줘야한다. 그게 귀찮으니 그냥 에로우 함수로 고우!
  markComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id === id) {
        todo.completed = !todo.completed
      }

      return todo;
    }) });
  }

  // Delete Todo: Array.filter() 는 주어진 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환한다.
  // 이 API 는 페이크기 때문에 실제로 백엔드를 쓸 때는 삭제성공시 인덱스 번호를 가져오면 될 듯.
  delTodo = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(res => {
        this.setState({ todos: [...this.state.todos.filter(todo => todo.id !== id)] })
      });
  }

  // Add Todo
  addTodo = (title) => {
    axios.post('https://jsonplaceholder.typicode.com/todos', {
      title,
      completed: false
    })
      .then(res => this.setState({ todos: 
      [...this.state.todos, res.data] }));
    
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header />
            <Route exact path="/" render={props => (
              <React.Fragment>
                <AddTodo addTodo={this.addTodo} />
                <Todos 
                  todos={this.state.todos} 
                  markComplete={this.markComplete}
                  delTodo={this.delTodo} 
                />
              </React.Fragment>
            )} />
            <Route path="/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
