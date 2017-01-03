//----React

const Component = React.Component;

class App extends Component {
  constructor(props){
    super(props)
    console.log('started');
    this.state = {newTodoText: ""};
    this.textBoxChange = this.textBoxChange.bind(this);
    this.addTodoButton = this.addTodoButton.bind(this);
  }

  textBoxChange(event){
    this.setState({newTodoText: event.target.value});
  }

  addTodoButton(){
    store.dispatch({
      type: 'ADD_TODO',
      id: counter++,
      text: this.state.newTodoText,
      isChecked: false
    });
  }

  render(){
    return(
      <div>
        <input type="text" onChange={this.textBoxChange} value={this.state.newTodoText}></input>
        <button onClick={this.addTodoButton}>Add Todo</button>
        <ul>
        {this.props.todos.map(elem => 
          <li key={elem.id}>
            {elem.text}
          </li>
        )}
        </ul>
      </div>
    )
  }
}

function ShowTodos({todos}){ console.log(todos);
  return (
    <div>
    </div>
  );
}

//----Redux
let counter = 0;
//- Reducer
function reducer(state = {todos: []}, action){
  const {id, text, isChecked} = action
  switch(action.type){
    case 'ADD_TODO':
      return Object.assign(
        {}, 
        state, 
        {
          todos: [...state.todos, {
            id, text, isChecked
          }]
        }
      );
    default:
      return state
  }
}

const store = Redux.createStore(reducer)
store.subscribe(render);

//-----Render
function render(){
  ReactDOM.render(
    <App todos={store.getState().todos}/>,
    document.getElementById('root')
  );
}
render();